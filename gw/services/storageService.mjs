const STORAGE_KEYS = {
	AUTH_TOKEN: "auth-token",
	USER: "user",
	SERVER_URL: "server-url",
	SERVER_URL_LIST: "server-url-list",
};

function setToken(token) {
	localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
}

function getToken() {
	return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

function removeToken() {
	localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
}

function setUserInfo(login) {
	localStorage.setItem(STORAGE_KEYS.USER, login);
}

function getUserInfo() {
	return localStorage.getItem(STORAGE_KEYS.USER);
}

function removeUserInfo() {
	localStorage.removeItem(STORAGE_KEYS.USER);
}

function setServerUrl(url) {
	localStorage.setItem(STORAGE_KEYS.SERVER_URL, url);
}

function getServerUrl() {
	return localStorage.getItem(STORAGE_KEYS.SERVER_URL);
}

function removeServerUrl() {
	localStorage.removeItem(STORAGE_KEYS.SERVER_URL);
}

function clearServerUrlList() {
	localStorage.setItem(STORAGE_KEYS.SERVER_URL_LIST, []);
}

function getServerUrlList() {
	const urlList = localStorage.getItem(STORAGE_KEYS.SERVER_URL_LIST);
	if (urlList) {
		return JSON.parse(urlList);
	}
	return [];
}

function addServerUrlToList(url) {
	const urlListString = localStorage.getItem(STORAGE_KEYS.SERVER_URL_LIST);
	const urlList = urlListString ? JSON.parse(urlListString) : [];
	if (urlList) {
		const urlSet = new Set(urlList)
		if (urlSet.has(url)) {
			return;
		}
		urlSet.add(url);
		localStorage.setItem(STORAGE_KEYS.SERVER_URL_LIST, JSON.stringify(Array.from(urlSet)))
	}
	else {
		localStorage.setItem(STORAGE_KEYS.SERVER_URL_LIST, [url]);
	}
}

const storageService = {
	setToken,
	getToken,
	removeToken,
	setUserInfo,
	getUserInfo,
	removeUserInfo,
	setServerUrl,
	getServerUrl,
	removeServerUrl,
	clearServerUrlList,
	getServerUrlList,
	addServerUrlToList,
}

export default storageService;
