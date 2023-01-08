'use strict';

const fs = require('fs');
const process = require('process');

function slice(file, part, from, to) {
	fs.writeFileSync(file + '.' + part, fs.readFileSync(file).slice(from, to));
}

if (process.argv.length != 3) {
	console.error(`usage: ${process.argv[1]} game`);
	process.exit(1);
}
const game = process.argv[2];

switch (game) {
case 'cf':
	slice('fodtitle.rol', 1, 0x8, undefined);
	slice('fodtitle.adl', 1, 0x8, undefined);

	slice('fodmus.rol', 1, 0x1c, 0x2f65);
	slice('fodmus.rol', 2, 0x2f65, 0x3661);
	slice('fodmus.rol', 3, 0x3661, 0x5662);
	slice('fodmus.rol', 4, 0x5662, 0x6ca9);
	slice('fodmus.rol', 5, 0x6ca9, 0x6f58);
	slice('fodmus.rol', 6, 0x6f58, undefined);

	slice('fodmus.adl', 1, 0x1c, 0x4ae0);
	slice('fodmus.adl', 2, 0x4ae0, 0x5360);
	slice('fodmus.adl', 3, 0x5360, 0x6242);
	slice('fodmus.adl', 4, 0x6242, 0x793e);
	slice('fodmus.adl', 5, 0x793e, 0x80a9);
	slice('fodmus.adl', 6, 0x80a9, undefined);
	break;
default:
	console.error(`unknown game: ${game}`);
	process.exit(1);
}
