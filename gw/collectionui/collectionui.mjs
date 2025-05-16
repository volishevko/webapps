export default class CollectionUI {
	constructor() {
		this.init();
	}

	init() {
		this.createCollectionUI();
		this.createOpenButton();
	}

	createCollectionUI() {
		const collectionUI = document.createElement('div');
		collectionUI.className = 'gw-collection-ui';
		collectionUI.style.display = 'none';
		const h2 = document.createElement('h2');
		h2.innerText = 'Collections';
		const collectionList = document.createElement('div');
		collectionList.id = 'gw-collection-list';
		document.body.appendChild(collectionUI);

		this.collectionList = document.getElementById('gw-collection-list');
		this.createCollectionButton = document.getElementById('gw-create-collection');

		this.createCollectionButton.onclick = () => {
			this.createCollection();
		};

		this.collectionUi = collectionUI;
	}

	createOpenButton() {
		const openButton = document.createElement('button');
		openButton.innerText = 'Open';
		openButton.className = 'gw-collection-ui-button';
		openButton.onclick = () => {
			this.showCollectionUI();
		};

		this.openButton = openButton;
		document.body.appendChild(this.openButton);
	}

	showCollectionUI() {
		this.collectionList.style.display = 'block';
		this.createCollectionButton.style.display = 'block';
	}
}
