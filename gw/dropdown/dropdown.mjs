function getConfig() {
	const collectionDropDownBox = {
		view: "richselect",
		name: "collectionBoxName",
		css: "select-field ellipsis-text",
		label: "Collections",
		width: 250,
		labelWidth: 100,
		options: {
			body: {
				css: "ellipsis-text",
				template: obj => `<span title='${obj.name}'>${obj.name}</span>` || ""
			}
		}
	};
	return collectionDropDownBox
}

const dropdown = {
	getConfig,
}

export default dropdown;
