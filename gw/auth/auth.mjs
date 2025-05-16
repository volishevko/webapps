import authService from '../services/auth.mjs';
import mainService from '../services/webixService.mjs';

export default class AuthenticationPopup {
	constructor() {
		this.init();
	}

	init() {
		this.createPopup();
		this.createOpenButton();
		this.createLogoutButton();
		this.createStatusBar();
	}

	createOpenButton() {
		const authButton = document.createElement('button');
		authButton.innerText = 'Login';
		authButton.className = 'gw-auth-button';
		authButton.onclick = () => {
			this.showPopup();
		};

		this.openButton = authButton;
	}

	createLogoutButton() {
		const logoutButton = document.createElement('button');
		logoutButton.innerText = 'Logout';
		logoutButton.className = 'gw-auth-logout-btn';
		logoutButton.onclick = () => {
			authService.logout();
			this.logoutButton.style.display = 'none';
			this.openButton.style.display = 'block';
			this.updateStatus();
		};

		this.logoutButton = logoutButton;
	}

	createStatusBar() {
		const statusBar = document.createElement('div');
		statusBar.className = 'gw-auth-status';

		const statusText = document.createElement('span');
		if (authService.isAuthenticated()) {
			statusText.innerText = 'Logged in as: ' + authService.getUserInfo();
			this.openButton.style.display = 'none';
			this.logoutButton.style.display = 'block';
		}
		else {
			statusText.innerText = 'Not logged in';
			this.openButton.style.display = 'block';
			this.logoutButton.style.display = 'none';
		}

		statusBar.appendChild(statusText);
		this.statusBar = statusBar;
	}

	getOpenButton() {
		return this.openButton;
	}

	getLogoutButton() {
		return this.logoutButton;
	}

	getStatusBar() {
		return this.statusBar;
	}

	createPopup() {
		const popup = document.createElement('div');
		popup.id = 'gw-auth-popup';
		popup.className = 'gw-auth-popup';

		const loginButton = document.createElement('button');
		loginButton.innerText = 'Login';
		loginButton.className = 'gw-auth-popup-button';
		loginButton.onclick = () => {
			this.login();
		};

		const closeButton = document.createElement('span');
		closeButton.innerText = 'x';
		closeButton.className = 'gw-auth-popup-close-btn';
		closeButton.onclick = () => {
			this.popup.style.display = 'none';
		};

		const content = document.createElement('div');
		content.className = 'gw-auth-popup-content';

		const popupTitle = document.createElement('h2');
		popupTitle.innerText = 'Login';
		popupTitle.className = 'gw-auth-popup-title';
		content.appendChild(popupTitle);

		const popupDescription = document.createElement('p');
		popupDescription.innerText = 'Please enter your credentials to log in.';
		popupDescription.className = 'gw-auth-popup-description';
		content.appendChild(popupDescription);

		const serverInput = document.createElement('input');
		serverInput.type = 'text';
		serverInput.placeholder = 'Server URL';
		serverInput.className = 'gw-auth-popup-input';
		serverInput.value = 'https://styx.neurology.emory.edu'; // Default server URL
		content.appendChild(serverInput);

		const usernameInput = document.createElement('input');
		usernameInput.type = 'text';
		usernameInput.placeholder = 'Username';
		usernameInput.className = 'gw-auth-popup-input';

		const passwordInput = document.createElement('input');
		passwordInput.type = 'password';
		passwordInput.placeholder = 'Password';
		passwordInput.className = 'gw-auth-popup-input';

		content.appendChild(usernameInput);
		content.appendChild(passwordInput);
		content.appendChild(loginButton);
		content.appendChild(closeButton);
		
		// Append the popup to the body
		document.body.appendChild(popup);
		
		// Set initial styles for the popup
		popup.appendChild(content);

		// set this properties
		this.loginButton = loginButton;
		this.popup = popup;
		this.closeButton = closeButton;
		this.serverInput = serverInput;
		this.usernameInput = usernameInput;
		this.passwordInput = passwordInput;
	}

	showPopup() {
		this.popup.style.display = 'flex';
	}

	destroy() {
		if (this.popup) {
			this.popup.remove();
		}
		if (this.openButton) {
			this.openButton.remove();
		}
	}
	getPopup() {
		return this.popup;
	}

	getOpenButton() {
		return this.openButton;
	}

	async login() {
		const serverURL = this.serverInput.value;
		const username = this.usernameInput.value;
		const password = this.passwordInput.value;

		if (serverURL && username && password) {
			// Perform login logic here
			await authService.login(serverURL, username,password);
			const authFlag = authService.isAuthenticated();
			if (authFlag) {
				this.statusBar.innerText = 'Logged in as: ' + authService.getUserInfo();
				this.popup.style.display = 'none';
				this.openButton.style.display = 'none';
				this.logoutButton
			} else {
				alert('Login failed. Please check your credentials.');
			}
		} else {
			alert('Please fill in all fields.');
		}
		this.updateStatus();
		mainService
	}

	updateStatus() {
		if (authService.isAuthenticated()) {
			this.statusBar.innerText = 'Logged in as: ' + authService.getUserInfo();
			this.openButton.style.display = 'none';
			this.logoutButton.style.display = 'block';
		} else {
			this.statusBar.innerText = 'Not logged in';
			this.openButton.style.display = 'block';
			this.logoutButton.style.display = 'none';
		}
	}
}
