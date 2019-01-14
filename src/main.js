import App from './App.html';
import Diff from './jsdiff.js';

import contents from './contents.js';

let groundTruth = contents["ground-truth"];
let image_path = contents['original'];
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
		groundTruth: contents["ground-truth"],
		activePage: entries[0][0],
		showDiff: true
	}
});

export default app;