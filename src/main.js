import App from './App.html';
import Diff from './jsdiff.js';

import contents from './exec_order_9066.js';

let groundTruth = contents["Ground Truth"];
let image_path  = contents['Original'];
let entries = Object.entries(contents).map((row)=>{ 
	let name = row[0];
	let original = row[1];
	let diff = Diff.diffString(groundTruth, original);
	return [name, original, diff]; 
});
entries.shift();

const app = new App({
	target: document.body,
	data: {
		image: image_path,
		pages: entries,
		groundTruth: groundTruth,
		activePage: entries[0][0],
		showDiff: true
	}
});

export default app;
