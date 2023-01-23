'use strict';

const fs = require('fs');
const process = require('process');

if (process.argv.length <= 3) {
	console.error('usage: decrypt.js game in out');
	process.exit(1);
}

const game = process.argv[2];
const infile = process.argv[3];
const outfile = process.argv[4];
const encrypted = new Uint8Array(fs.readFileSync(infile).buffer);
let decrypted;

switch (game) {
case 'dr':
	decrypted = new Uint8Array(encrypted.byteLength);
	for (let i = 0; i < encrypted.byteLength; i++) {
		let v = encrypted[i];
		v = ((v<<(i%7)) | (v>>(8-(i%7)))) & 0xFF;
		v = (v - (0x6D + (i*0x11))) & 0xFF;
		decrypted[i] = v;
	}
	break;
default:
	throw 'unknown game: ' + game;
}

fs.writeFileSync(outfile, decrypted);
