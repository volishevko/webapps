import constants from "../constants.mjs";
import storageService from "./storageService.mjs";

function parseError(e) {
	console.error(e);
}

function getHostApiUrl() {
	const url = storageService.getServerUrl();
	return `${url}/girder/api/v1`
}

async function getFolders(parentType, parentId, offset, limit) {
	const params = new URLSearchParams({
		parentType: parentType,
		parentId: parentId,
		offset: offset ?? 0,
		limit: typeof limit === "number" ? limit : constants.FOLDERS_LIMIT
	});
	try {
		const url = `${getHostApiUrl()}/folder`
		const response = await fetch(`${url}?${params.toString()}`, {
			headers: {
				"Content-Type": "application/json",
				"Girder-Token": storageService.getToken() ?? null,
			},
		});
		const folders = await response.json();
		return folders;
	}
	catch (e) {
		parseError(e);
	}
}

async function getItems(folderId) {
	const params = new URLSearchParams({
		folderId
	})
	try {
		const url = `${getHostApiUrl()}/item`;
		const response = await fetch(`${url}?${params.toString()}`, {
			headers: {
				"Content-Type": "application/json",
				"Girder-Token": storageService.getToken() ?? null,
			},
		});
		const items = await response.json();
		return items;
	}
	catch(e) {
		parseError(e);
	}
}

async function getCollections() {
	try {
		const url = `${getHostApiUrl()}/collection`;
		const response = await fetch(url, {
			headers: {
				"Content-Type": "application/json",
				"Girder-Token": storageService.getToken() ?? null,
			},
		});
		const collections = await response.json();
		return collections;
	}
	catch(e) {
		parseError(e);
	}
}

async function getTileSources(itemId) {
	try {
		const url = `${getHostApiUrl()}/item/${itemId}/tiles`;
		const response = await fetch(`${url}`, {
			headers: {
				"Content-Type": "application/json",
				"Girder-Token": storageService.getToken() ?? null,
			},
		});
		const tileSources = await response.json();
		return tileSources;
	}
	catch(e) {
		parseError(e);
	}
}

function getImageTileUrl(itemId, z, x, y) {
	const urlSearchParams = new URLSearchParams();
	urlSearchParams.append("edge", "crop");
	urlSearchParams.append("token", storageService.getToken());
	return `${getHostApiUrl()}/item/${itemId}/tiles/zxy/${z}/${x}/${y}?${urlSearchParams.toString()}`;
}

function getImageDownloadUrl(itemId) {
	const urlSearchParams = new URLSearchParams();
	urlSearchParams.append("token", storageService.getToken());
	return `${getHostApiUrl()}/item/${itemId}/download?${urlSearchParams.toString()}`;
}

async function getLinearStructure(folderId, sourceParams) {
	const params = sourceParams ? new URLSearchParams({
		type: "folder",
		limit: sourceParams.limit || 50,
		offset: sourceParams.offset || 0,
		sort: sourceParams.sort || "lowerName",
		sortdir: sourceParams.sortdir || 1
	}) : null;
	const url = `${getHostApiUrl()}/resource/${folderId}/items`;

	const response = await fetch(`${url}?${params.toString()}`, {
		headers: {
			"Content-Type": "application/json",
			"Girder-Token": storageService.getToken() ?? null,
		},
	});
	const items = await response.json()
	return items;
}

const apiService = {
	getFolders,
	getItems,
	getCollections,
	getTileSources,
	getImageTileUrl,
	getImageDownloadUrl,
	getLinearStructure,
}

export default apiService;
