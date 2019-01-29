import App from './App.html';
import Diff from './jsdiff.js';

let prepareData = (contents) => {
	console.log(contents["Original"]);
	let groundTruth = contents["Transcript"];
	let entries = Object.entries(contents).map((row)=>{
		let name = row[0];
		console.log(name);
		let original = row[1];
		let diff = Diff.diffString(groundTruth, original);
		return [name, original, diff];
	});
	entries.shift();

	return {
		groundTruth: groundTruth,
		imagePath: contents['Original'],
		pages: entries
	};
};

import execOrder9066 from './exec_order_9066.js';
import commissaryReceipt from './commissary_receipt.js';
import carterPageFisa from './carter_page_fisa.js';
import texasCampaignFiling from './texas_campaign_filing.js';
import yanukovychLeaks from './yanukovychleaks-img132.js';


let data = {
	"Order 9066":	    	 prepareData(execOrder9066),
	"Commissary Receipt":     prepareData(commissaryReceipt),
	"Carter Page Fisa":     	 prepareData(carterPageFisa),
	"Texas Campaign Filing": 	 prepareData(texasCampaignFiling),
	"Yanukovych Leaks":				 prepareData(yanukovychLeaks)
};

console.log(data);
const app = new App({
	target: document.body,
	data: {
		data: data,
		topic: Object.keys(data)[0],
		activePage: "Transcript",
		showDiff: true
	}
});

export default app;
