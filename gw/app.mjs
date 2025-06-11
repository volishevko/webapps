import { RotationControlOverlay } from 'https://cdn.jsdelivr.net/gh/pearcetm/osd-paperjs-annotation@0.4.12/src/js/rotationcontrol.mjs';

import { DSAUserInterface } from '../dsa/dsauserinterface.mjs';
import { SegmentationUI } from '../apps/segmentationui.mjs';
import Header from './header/header.mjs';
import Finder from "./finder/finderView.mjs";
import Dropdown from './dropdown/dropdown.mjs';
import authService from './services/auth.mjs';
import mainService from './services/webixService.mjs';
import apiService from './services/api.mjs';

// create webix view
const finderConfig = Finder.getConfig();
finderConfig.container = "gw-finder";
const finderView = webix.ui(finderConfig);
const tree = webix.$$("gw-finder");
const dropdownConfig = Dropdown.getConfig();
dropdownConfig.id = "gw-dropdown";
dropdownConfig.container = "gw-dropdown";
const dropdownView = webix.ui(dropdownConfig);
if (authService.isAuthenticated()) {
    const collections = await apiService.getCollections();
    dropdownView.getList().parse(collections);
    dropdownView.setValue(dropdownView.getList().getFirstId());
    const selectedCollection = dropdownView.getList().getItem(dropdownView.getValue());
    const folders = await apiService.getFolders("collection", selectedCollection._id);
    tree.parse(folders);
    dropdownView.enable();
    tree.enable();
}
else {
    dropdownView.disable();
    tree.disable();
}

// create the viewer
let viewer = window.viewer = OpenSeadragon({
    element:'viewer',
    prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
    minZoomImageRatio:0.01,
    maxZoomPixelRatio:16,
    visibilityRatio:0,
    crossOriginPolicy: 'Anonymous',
    ajaxWithCredentials: false,
    showNavigator:true,
    sequenceMode:true,
});

// // DSA setup
const dsaUI = new DSAUserInterface(viewer,{showHeader:'hash'});
// // dsaUI.header.appendTo('.dsa-ui-container');

mainService.attachEvents(dropdownView, tree, viewer, dsaUI);
if (authService.isAuthenticated) {
    mainService.connectToDSA();
}

// Add rotation control
const rotationControl = new RotationControlOverlay(viewer);
rotationControl.origActivate = rotationControl.activate;
rotationControl.disable = () => rotationControl.activate = ()=>{};
rotationControl.enable = () => rotationControl.activate = rotationControl.origActivate;

const ANNOTATION_NAME = 'Gray White Segmentation';
const ANNOTATION_DESCRIPTION = 'Created by the Gray-White Segmentation Web App';

const options = {
    name: ANNOTATION_NAME,
    description: ANNOTATION_DESCRIPTION,
    dsa: dsaUI,
    viewer:viewer,
    instructionsURL: 'https://pitt-bdsa.github.io/webapps/gw/instructions',
    regions:[
        {
            name:'White Matter',
            color:'blue'
        },
        {
            name:'Leptomeninges',
            color:'black'
        },
        {
            name:'Background',
            color:'lightgray'
        },
        {
            name:'Gray Matter',
            color:'green'
        },
        {
            name:'Superficial',
            color:'yellow'
        },
        {
            name:'Other',
            color:'magenta'
        },
        {
            name:'Exclude',
            color:'red'
        },
    ]
}
const segmentationUI = new SegmentationUI(options);

segmentationUI.dsaContainer.appendChild(dsaUI.header[0]);

segmentationUI.setSaveHandler((itemID, geoJSON)=>{
    return dsaUI.saveAnnotationInDSAFormat(itemID, geoJSON, true).then(d=>{
        segmentationUI.setAnnotationId(d._id);
        window.alert('Save succeeded');
    }).catch(e=>{
        console.warning('Problem saving annotation:')
        console.log(e);
        window.alert('There was a problem saving the annotaiton. See console for details.');
    });
})

const header = new Header();
