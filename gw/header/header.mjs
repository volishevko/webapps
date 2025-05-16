import AuthenticationPopup from "../auth/auth.mjs";

export default class Header {
	constructor() {
		this.authPopup = new AuthenticationPopup();
		this.init();
	}

	init() {
		this.headerElement = this.createHeader();
	}

	createHeader() {
		const header = document.getElementById("gw-header");
		if (header) {
			header.className = 'gw-header';

			const title = document.createElement('div');
			title.className = 'gw-header-title';
			title.innerText = 'App Name';

			const authSection = document.createElement('div');
			authSection.className = 'gw-header-auth';
			const loginButton = this.authPopup.getOpenButton();
			const logoutButton = this.authPopup.getLogoutButton();
			const statusBar = this.authPopup.getStatusBar();
			authSection.appendChild(statusBar);
			authSection.appendChild(logoutButton);
			authSection.appendChild(loginButton);
			header?.appendChild(title);
			header?.appendChild(authSection);
		}
		return header;
	}

	getHeaderElement() {
		return this.headerElement;
	}
}
