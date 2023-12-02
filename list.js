'use strict';

const fs = require('fs');
const process = require('process');

if (process.argv.length <= 3) {
	console.error('usage: list.js game file');
	process.exit(1);
}

const game = process.argv[2];
const file = process.argv[3];
const data = new DataView(fs.readFileSync(file).buffer);
let pos = 0;
const result = [];

switch (game) {
case 'dr':
	const count = data.getUint32(pos, true);
	pos += 4;
	console.log({ count });
	for (let i = 0; i < count; i++) {
		const filename = new Uint8Array(13);
		for (let j = 0; j < 13; j++)
			filename[j] = data.getUint8(pos++);
		for (let j = 0; j < 13 && filename[j] !== 0; j++)
			filename[j] -= 117 - 3*j;
		const file = new TextDecoder().decode(filename);
		const size = data.getUint32(pos, true);
		pos += 4;
		console.log(file, size);
	}
	break;
case 'tr3':
	pos = [0x218, 0x55d8][0];
	while (data.getUint8(pos) !== 0) {
		const file = readVarStr(data, pos, 256);
		pos += 260;
		const size = data.getUint32(pos, true);
		pos += 4;
		const offset = data.getUint32(pos, true);
		pos += 4;
		result.push({ file, offset, size });
	}
	console.log(result);
	break;
default:
	throw 'unknown game: ' + game;
}

function readVarStr(data, pos, maxLength) {
	let length;
	for (let i = 0; i < maxLength; i++) {
		if (data.getUint8(pos+i) === 0) {
			length = i;
			break;
		}
	}
	if (length == null) length = maxLength;
	return new TextDecoder('ascii').decode(data.buffer.slice(pos, pos+length));
}
