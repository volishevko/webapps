// Auth service for handling user authentication
import storageService from "./storageService.mjs";
import mainService from "./webixService.mjs";

const AUTH_ENDPOINT = "/user/authentication";

async function login (serverUrl, username, password) {
	const tok = `${username}:${password}`;
	let hash;
	try {
		hash = btoa(tok)
	}
	catch (e) {
		console.log("invalid character in password or login");
	}
	const headers = {
		"Accept": "*/*",
		"Authorization": `Basic ${hash}`,
		"Content-Type": "application/json",
		"Girder-Token": null,
	}
	const response = await fetch(`${serverUrl}/girder/api/v1${AUTH_ENDPOINT}`, {
		headers
	});
	if (response.ok) {
		const data = await response.json();
		storageService.setToken(data.authToken.token);
		storageService.setUserInfo(data.user.login);
		storageService.setServerUrl(serverUrl);
		mainService.updateData();
	}
}

function logout() {
	storageService.removeToken();
	storageService.removeUserInfo();
	storageService.removeServerUrl();
	mainService.updateData();
}

function isAuthenticated() {
	return !!storageService.getToken();
}

function getToken() {
	return storageService.getToken();
}

function getUserInfo() {
	return storageService.getUserInfo();
}

const authService = {
	login,
	logout,
	isAuthenticated,
	getToken,
	getUserInfo
};

export default authService;
