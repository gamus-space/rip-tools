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
	console.error('usage: rip-midi.js file');
	process.exit(1);
}

const file = process.argv[2];
const data = new DataView(fs.readFileSync(file).buffer);
let count = 0;

let pos = 0;
while (pos < data.byteLength) {
	const start = data.findString(pos, 'MThd');
	if (start == null) break;
	let tracks = data.getUint16(start+10);
	if (tracks === 0)
		throw new Error("midi without tracks");
	pos = start+4;
	while (tracks--) {
		const track = data.findString(pos, 'MTrk');
		if (track == null) break;
		pos = track+4;
		const length = data.getUint32(pos);
		pos += 4;
		pos += length;
	}

	count++;
	let name = `${path.basename(file)}_${String(count).padStart(3, '0')}.mid`;

	if (data.byteLength >= pos + 8 && data.getUint8(pos) === 0 && data.getUint8(pos+1) === 0xff && data.getUint8(pos+2) === 3) {
		// Prince of Persia 2
		const textLength = data.getUint8(pos+3);
		pos += 4;
		const text = data.getString(pos, textLength);
		if (text.length > 4 && text.length <= 16) {
			name = text.trim();
			if (fs.existsSync(name)) name = `${name}_${count}`;
		}
		pos -= 4;
	}

	const end = pos;
	console.log(name, start, end);

	const MAX_SCAN = 10;
	pos -= 4;
	for (let i = 0; i < MAX_SCAN; i++, pos++) {
		if (data.getUint32(pos) === 0x00ff2f00) break;
	}
	const dataEnd = pos+4;
	if (data.getUint32(pos) !== 0x00ff2f00)
		console.error('warning: missing end signature');
	else if (dataEnd !== end) {
		console.error('found end signature', dataEnd-end);
		data.setUint32(track+4, length + dataEnd-end);
	}

	fs.writeFileSync(name, new DataView(data.buffer.slice(start, dataEnd)));
}
console.log(`total songs: ${count}`);
