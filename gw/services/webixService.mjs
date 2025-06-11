import apiService from "./api.mjs";
import authService from "./auth.mjs";
import storageService from "./storageService.mjs";
import constants from "../constants.mjs";
const webixViews = {
	dropdown: null,
	foldersView: null,
};

const OSDViewers = {
	viewer: null,
}

const dsaUserInterface = {
	dsaUI: null,
}

function attachEvents(dropdown, foldersView, viewer, dsaUI) {
	webixViews.dropdown = dropdown;
	webixViews.foldersView = foldersView;
	OSDViewers.viewer = viewer;
	dsaUserInterface.dsaUI = dsaUI;
	dropdown.attachEvent("onChange", async (newValue, oldValue) => {
		const selectedCollection = dropdown.getList().getItem(dropdown.getValue());
		if (selectedCollection) {
			const folders = await apiService.getFolders("collection", selectedCollection._id);
			if (folders) {
				foldersView.clearAll();
				foldersView.parse(folders);
			}
		}
	});

	foldersView.attachEvent("onBeforeSelect", () => {
		// TODO: implement folder selection
	});

	foldersView.attachEvent("onBeforeOpen", (id) => {
		foldersView.select(id);
	});

	// after opening the tree branch we fire this event
	foldersView.attachEvent("onAfterSelect", async(id) => {
		const item = foldersView.getItem(id);
		const isCollapsed = item.link !== constants.EXPAND_LINK;
		const parentId = foldersView.getParentId(id);
		if (item._modelType === "item" || !item._modelType) {

			dsaUserInterface.dsaUI.openItem(item._id);
		}
		else if (item._modelType === "folder") {
			if (item?.meta?.isLinear) {
				loadLinearData(id);// TODO: implement linear folder loading
				// loadBranch(id);
			}
			else {
				loadBranch(id);
			}
		}
		else if (item._modelType === constants.SUB_FOLDER_MODEL_TYPE) {
			webix.confirm({
				text: "The folder consists of a large amount of data. Continue?",
				type: "confirm-warning",
				cancel: "No",
				ok: "Yes"
			})
				.then(() => {
					openSubFolder(id);
				})
				.catch(() => {
					foldersView.select(item.$parent);
				});
		}
	});

	foldersView.attachEvent("onAfterClose", (id) => {
		foldersView.unselect(id);
		if (foldersView.getSelectedId()) return;

		console.log("No selected item");
	});
}

async function updateData() {
	if (authService.isAuthenticated()) {
		webixViews.foldersView.enable();
		webixViews.dropdown.enable();
	}
	else {
		webixViews.foldersView.disable();
		webixViews.dropdown.disable();
		webixViews.foldersView.clearAll();
		webixViews.dropdown.getList().clearAll();
	}
	if (webixViews.dropdown) {
		const collections = await apiService.getCollections();
		webixViews.dropdown.getList().parse(collections);
		webixViews.dropdown.enable();
	}
	if (webixViews.foldersView) {
		webixViews.foldersView.clearAll();
		const selectedCollection = webixViews.dropdown.getList().getSelectedItem();
		if (selectedCollection) {
			const folders = await apiService.getFolders("collection", selectedCollection._id);
			if (folders) {
				webixViews.foldersView.clearAll();
				webixViews.foldersView.parse(folders);
			}
		}
		webixViews.foldersView.refresh();
	}
}

async function loadBranch(id) {
	const currentItem = webixViews.foldersView.getItem(id);
	const folders = await apiService.getFolders("folder", currentItem._id);
	const items = await apiService.getItems(currentItem._id);
	if (Array.isArray(folders)) {
		webixViews.foldersView.parse({data: folders, parent: id});
	}
	if (Array.isArray(items)) {
		webixViews.foldersView.parse({data: items, parent: id});
	}
	webixViews.foldersView.open(id);
}

function openSubFolder(id) {
	const subFolder = findItem(id);
	const parent = findItem(subFolder.$parent);
	const branch = webixViews.foldersView.data.getBranch(id);
	parent._showMany = true;
	removeItem(id);
	parseItems(branch, parent.id);
}

function removeItem(id, baseId) {
	let item = null;
	if (id) {
		item = webixViews.foldersView.getItem(id);
		webixViews.foldersView.remove(id);
	}
	else if (baseId) {
		webixViews.foldersView.remove(item.id);
		delete customFinderDataPull[baseId];
	}
}

function parseItems(dataArray, parentId, linearDataCount) {
	const finderDataPull = {};
	dataArray.forEach((item) => {
		const id = webix.uid();
		item.id = id;
		if (item._id) {
			finderDataPull[item._id] = item;
		}
	});

	if (parentId) {
		parseItemsToFolder(dataArray, parentId, linearDataCount);
	}
	else {
		webixViews.foldersView.parse(dataArray);
	}
}

function parseItemsToFolder(dataArray, parentId, linearDataCount) {
	let branch = webixViews.foldersView.data.getBranch(parentId) || [];
	const parent = findItem(parentId);
	if (parent?.linear) {
		if (!parent.linear.count) {
			parent.linear.count = linearDataCount;
		}
		else {
			parent.linear.count += linearDataCount;
		}
	}

	webixViews.foldersView.parse({data: dataArray, parent: parentId});
	webixViews.foldersView.blockEvent();
	webixViews.foldersView.open(parent.id);
	webixViews.foldersView.unblockEvent();
}

function findItem(id, baseId) {
	let item = null;
	if (id) {
		item = webixViews.foldersView.getItem(id);
	}
	return item;
}

async function loadLinearData(folderId) {
	const sourceParams = {
		sort: "lowerName",
		offset: 0,
		limit: constants.LINEAR_STRUCTURE_LIMIT,
	}
	const addBatch = false;
	const isCollapsed = true;
	webixViews.foldersView.open(folderId);
	const folder = webixViews.foldersView.getItem(folderId);
	folder.linear = Object.assign({}, constants.LOADING_STATUSES.IN_PROGRESS);
	linearStructureHandler(
		folderId,
		sourceParams,
		addBatch,
		isCollapsed,
	)
	webixViews.foldersView.updateItem(folderId, folder);
}

async function linearStructureHandler(
	folderId,
	sourceParams,
	addBatch,
	isCollapsed) {
		const folder = webixViews.foldersView.getItem(folderId);
		webixViews.foldersView.blockEvent();
		webixViews.foldersView.select(folderId);
		webixViews.foldersView.unblockEvent();
		const data = await apiService.getLinearStructure(folder._id, sourceParams);
		if (data.length === 0) {
			folder.linear = null;
		}
		else if (folder.linear) {
			const finderElements = [];
			if (isCollapsed) {
				finderElements.push(
					...data
					// ...data.slice(0, constants.COLLAPSED_ITEMS_COUNT - sourceParams.offset)
				);
				// if (data.length < sourceParams.limit) {
				// 	finderElements.push({link: constants.EXPAND_LINK});
				// }
			}
			else if (data.length < sourceParams.limit) {
				finderElements.push(...webix.copy(data));
				// finderElements.push({link: constants.COLLAPSE_LINK});
			}

			parseItemsToFolder(finderElements, folderId, data.length);

			if (data.length < sourceParams.limit) {
				const currentLinear = folder.linear;
				webixViews.foldersView.updateItem(
					folderId,
					{linear: Object.assign(currentLinear, constants.LOADING_STATUSES.DONE)}
				);
				webixViews.foldersView.open(folderId)
			}
			else {
				const newOffset = sourceParams.offset + data.length;
				const newParams = {
					sort: "lowerName",
					limit: constants.LINEAR_STRUCTURE_LIMIT,
					offset: newOffset
				};

				linearStructureHandler(
					folderId,
					newParams,
					addBatch,
					isCollapsed
				);
			}
		}
}

function connectToDSA(baseUrl) {
	const url = baseUrl ?? storageService.getServerUrl();
	if (url) {
		dsaUserInterface.dsaUI.connectToDSA(url)
	}
}

const mainService = {
	attachEvents,
	updateData,
	connectToDSA,
}

export default mainService;
