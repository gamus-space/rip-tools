'use strict';

const fs = require('fs');
const path = require('path');
const process = require('process');

DataView.prototype.getString = function(offset, length){
    var end = typeof length == 'number' ? offset + length : this.byteLength;
    var text = '';
    var val = -1;

    while (offset < this.byteLength && offset < end){
        val = this.getUint8(offset++);
        if (val == 0) break;
        text += String.fromCharCode(val);
    }

    return text;
};

DataView.prototype.findString = function(pos, string) {
	for (let i = pos; i <= this.byteLength - string.length; i++)
		if (this.getString(i, string.length) === string) return i;
	return undefined;
};

if (process.argv.length <= 2) {
	console.error('usage: rip-hmi.js file');
	process.exit(1);
}

const file = process.argv[2];
const data = new DataView(fs.readFileSync(file).buffer);
let count = 0;
let pos = 0;

while (pos < data.byteLength) {
	const signature = data.findString(pos, 'ADLIB');
	if (signature == null) break;
	const start = signature - 2;
	const end = pos + 5404;
	const name = `${file}.${++count}.BNK`;
	console.log(name, start, end);
	fs.writeFileSync(name, new DataView(data.buffer.slice(start, end)));
	pos = end;
}

count = 0;
pos = 0;

while (pos < data.byteLength) {
	const start = data.findString(pos, 'HMIMIDIP');
	if (start == null) break;
	pos = start + 0x20;
	const end = start + data.getUint32(pos, true);
	const name = `${file}.${++count}.HMP`;
	console.log(name, start, end);
	fs.writeFileSync(name, new DataView(data.buffer.slice(start, end)));
	pos = end;
}
