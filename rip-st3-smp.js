'use strict';

const fs = require('fs');
const process = require('process');

if (process.argv.length <= 5) {
	console.error('usage: rip-st3-smp.js file from to dir');
	process.exit(1);
}

const file = process.argv[2];
const from = parseInt(process.argv[3]);
const to = parseInt(process.argv[4]);
const dir = process.argv[5];
const data = new Uint8Array(fs.readFileSync(file))

let sampleStart = from || 0;
let sampleEnd;
const dataEnd = to || data.length;
const page = 0x100;
let no = 1;

while (sampleStart < dataEnd) {
	let pageEnd = sampleStart;
	let sum;
	do {
		pageEnd += page;
		sum = data.slice(pageEnd-16, pageEnd-3).reduce((r, e) => r+e, 0);
	} while (sum !== 0 && sum !== 0xef);

	sampleEnd = pageEnd - 4;
	while (data[sampleEnd-1] === 0) sampleEnd--;
	const extract = `${dir}/${no++}.smp`;
	console.log(' *', sampleStart, sampleEnd, extract);
	fs.writeFileSync(extract, data.slice(sampleStart, sampleEnd));

	sampleStart = pageEnd - page;
	do {
		sampleStart += page;
		pageEnd = sampleStart + page;
		sum = data.slice(pageEnd-16, pageEnd-3).reduce((r, e) => r+e, 0);
	} while (sampleStart < dataEnd && (sum === 0 || sum === 0xef));
}
