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
	console.error('usage: rip-xmi.js file');
	process.exit(1);
}

const file = process.argv[2];
const data = new DataView(fs.readFileSync(file).buffer);
let count = 0;
let pos = 0;

while (pos < data.byteLength) {
	const start = data.findString(pos, 'FORM');
	if (start == null) break;
	pos = start + 8;
	const body = data.findString(pos, 'EVNT');
	pos = body + 4;
	const end = pos + 4 + data.getUint32(pos);
	const name = `${file}.${++count}.XMI`;
	console.log(name, start, end);
	fs.writeFileSync(name, new DataView(data.buffer.slice(start, end)));
	pos = end;
}
