import apiService from "./api.mjs";
import authService from "./auth.mjs";
import constants from "../constants.mjs";

function attachEvents(dropdown, foldersView, viewer) {
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
			const itemId = item._id;
			const itemTiles = await apiService.getTileSources(itemId);
			const tileSources = new OpenSeadragon.ImageTileSource({
				width: itemTiles.sizeX,
				height: itemTiles.sizeY,
				tileWidth: itemTiles.tileWidth,
				tileHeight: itemTiles.tileHeight,
				minLevel: 0,
				maxLevel: itemTiles.levels - 1,
				url: apiService.getImageDownloadUrl(itemId),
			});
			viewer.open(tileSources);
		}
		else if (item._modelType === "folder") {
			if (item?.meta?.isLinear) {
				loadBranch(id, foldersView);// TODO: implement linear folder loading
			}
			else {
				loadBranch(id, foldersView);
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
					openSubFolder(foldersView, id);
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
	const tree = webix.$$("gw-finder");
	const dropdown = webix.$$("gw-dropdown");
	if (authService.isAuthenticated()) {
		tree.enable();
		dropdown.enable();
	}
	else {
		tree.disable();
		dropdown.disable();
		tree.clearAll();
		dropdown.getList().clearAll();
	}
	if (dropdown) {
		const collections = await apiService.getCollections();
		dropdown.getList().parse(collections);
		dropdown.enable();
	}
	if (tree) {
		tree.clearAll();
		const selectedCollection = dropdown.getSelectedItem();
		if (selectedCollection) {
			const folders = await apiService.getFolders("collection", selectedCollection._id);
			if (folders) {
				tree.clearAll();
				tree.parse(folders);
			}
		}
		tree.refresh();
	}
}

async function loadBranch(id, foldersView) {
	const currentItem = foldersView.getItem(id);
	const folders = await apiService.getFolders("folder", currentItem._id);
	const items = await apiService.getItems(currentItem._id);
	if (Array.isArray(folders)) {
		foldersView.parse({data: folders, parent: id});
	}
	if (Array.isArray(items)) {
		foldersView.parse({data: items, parent: id});
	}
	foldersView.open(id);
}

function openSubFolder(foldersView, id) {
	const subFolder = findItem(foldersView, id);
	const parent = findItem(foldersView, subFolder.$parent);
	const branch = foldersView.data.getBranch(id);
	parent._showMany = true;
	removeItem(foldersView, id);
	parseItems(foldersView, branch, parent.id);
}

function removeItem(foldersView, id, baseId) {
	let item = null;
	if (id) {
		item = foldersView.getItem(id);
		foldersView.remove(id);
	}
	else if (baseId) {
		foldersView.remove(item.id);
		delete customFinderDataPull[baseId];
	}
}

function parseItems(foldersView, dataArray, parentId, linearDataCount) {
	const finderDataPull = {};
	dataArray.forEach((item) => {
		const id = webix.uid();
		item.id = id;
		if (item._id) {
			finderDataPull[item._id] = item;
		}
	});

	if (parentId) {
		parseItemsToFolder(foldersView,dataArray, parentId, linearDataCount);
	}
	else {
		foldersView.parse(dataArray);
	}
}

function parseItemsToFolder(foldersView, dataArray, parentId, linearDataCount) {
	let branch = foldersView.data.getBranch(parentId) || [];
	const parent = findItem(parentId);
	if (parent?.linear) {
		if (!parent.linear.count) {
			parent.linear.count = linearDataCount;
		}
		else {
			parent.linear.count += linearDataCount;
		}
	}
	const count = getFolderCount(parent) + dataArray.length;
	let items = dataArray;
	if (count >= constants.FOLDER_MAX_SHOWED_ITEMS && !parent._showMany) {
		if (branch.length === 1 && branch[0]._modelType === subFolderType) {
			parentId = branch[0].id;
		}
		else {
			foldersView.callEvent("putItemsToSubFolder");
			foldersView.blockEvent();
			foldersView.close(parentId);
			branch.forEach(item => removeItem(foldersView, item.id));
			foldersView.unblockEvent();

			items = [{
				_modelType: subFolderType,
				data: branch.concat(dataArray),
				name: "&lt;items&gt;"
			}];
		}
	}
	foldersView.parse({data: items, parent: parentId});
	foldersView.blockEvent();
	foldersView.open(parent.id);
	foldersView.unblockEvent();
}

function findItem(foldersView, id, baseId) {
	let item = null;
	if (id) {
		item = foldersView.getItem(id);
	}
	return item;
}

const mainService = {
	attachEvents,
	updateData,
}

export default mainService;
