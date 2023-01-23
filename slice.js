'use strict';

const fs = require('fs');
const process = require('process');

function slice(file, part, from, to) {
	let target;
	if (typeof part === 'string') target = part;
	if (typeof part === 'number') target = file + '.' + part;
	fs.writeFileSync(target, fs.readFileSync(file).slice(from, to));
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
case 'dr':
	let offset = 0x10F3;
	slice('MUSICS.BPA', 'MEN-SAM.CMF', offset, offset+=323793);
	slice('MUSICS.BPA', 'MEN-MUS.CMF', offset, offset+=505857);
	slice('MUSICS.BPA', 'TR1-MUS.CMF', offset, offset+=367474);
	slice('MUSICS.BPA', 'TR2-MUS.CMF', offset, offset+=212904);
	slice('MUSICS.BPA', 'TR3-MUS.CMF', offset, offset+=279736);
	slice('MUSICS.BPA', 'TR4-MUS.CMF', offset, offset+=309472);
	slice('MUSICS.BPA', 'TR5-MUS.CMF', offset, offset+=325036);
	slice('MUSICS.BPA', 'TR6-MUS.CMF', offset, offset+=326656);
	slice('MUSICS.BPA', 'TR7-MUS.CMF', offset, offset+=373158);
	slice('MUSICS.BPA', 'TR8-MUS.CMF', offset, offset+=251720);
	slice('MUSICS.BPA', 'TR0-MUS.CMF', offset, offset+=443884);
	slice('MUSICS.BPA', 'ENDANI0E.CMF', offset, offset+=333608);
	slice('MUSICS.BPA', 'SANIM-E.CMF', offset, offset+=628468);
	slice('MUSICS.BPA', 'ENDANI-E.CMF', offset, offset+=302473);
	slice('MUSICS.BPA', 'GEN-EFE.CMF', offset, offset+=385187);
	slice('MUSICS.BPA', 'TR9-MUS.CMF', offset, offset+=352794);
	console.log(offset);
	break;
default:
	console.error(`unknown game: ${game}`);
	process.exit(1);
}
