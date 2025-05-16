const STORAGE_KEYS = {
	AUTH_TOKEN: "auth-token",
	USER: "user",
	SERVER_URL: "server-url"
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
}

export default storageService;
