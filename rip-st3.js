'use strict';

const fs = require('fs');
const process = require('process');

if (process.argv.length <= 3) {
	console.error('usage: rip-st3.js game file');
	process.exit(1);
}

const game = process.argv[2];
const file = process.argv[3];
const data = new Uint8Array(fs.readFileSync(file));
let count = 0;

const samplesMappings = { bmania_d: {}, bmania_f: {} };
if (!samplesMappings[game]) {
	console.error(`unsupported game: ${game}`);
	process.exit(1);
}

samplesMappings.bmania_d = {
	/* 01 */ "bom.s3s": `bmania_d/41-46.smp`,
	/* 02 */ "bzeep.s3s": `bmania_d/47.smp`,
	/* 03 */ "graaahh.s3s": `bmania_d/48.smp`,
	/* 04 */ "ding.s3s": `bmania_d/49.smp`,
	/* 05 */ "gong.s3s": `bmania_d/50.smp`,
	/* 06 */ "aaahh.s3s": `bmania_d/51.smp`,
	/* 07 */ "bummm.s3s": `bmania_d/52.smp`,
	/* 08 */ "plug.s3s": `bmania_d/53.smp`,
	/* 09 */ "spak.s3s": `bmania_d/54.smp`,
	/* 0a */ "shi.s3s": `bmania_d/55.smp`,
	/* 0b */ "whoosh.s3s": `bmania_d/56.smp`,
	/* 0d */ "shhhhh.s3s": `bmania_d/57.smp`,
	/* 14 */ "basbuz6.s3s": `bmania_d/33.smp`,
	/* 15 */ "bassdrum.s3s": `bmania_d/34.smp`,
	/* 16 */ "hihat.s3s": `bmania_d/35.smp`,
	/* 17 */ "snare.s3s": `bmania_d/36.smp`,
	/* 18 */ "trumpet.s3s": `bmania_d/38.smp`,
};

samplesMappings.bmania_f = {
	/* 01 */ "bom.s3s": `bmania_f/55-60.smp`,
	/* 02 */ "bzeep.s3s": `bmania_f/61.smp`,
	/* 03 */ "graaahh.s3s": `bmania_f/62.smp`,
	/* 04 */ "ding.s3s": `bmania_f/63.smp`,
	/* 05 */ "gong.s3s": `bmania_f/64.smp`,
	/* 06 */ "aaahh.s3s": `bmania_f/65.smp`,
	/* 07 */ "bummm.s3s": `bmania_f/66.smp`,
	/* 08 */ "plug.s3s": `bmania_f/67.smp`,
	/* 09 */ "spak.s3s": `bmania_f/68.smp`,
	/* 0a */ "shi.s3s": `bmania_f/69.smp`,
	/* 0b */ "whoosh.s3s": `bmania_f/70.smp`,
	/* 0c */ "ahhheqfx.s3s": `bmania_f/ahhh.s3s`,
	/* 0c */ "ahhh.s3s": `bmania_f/ahhh.s3s`,
	/* 0e */ "tekb2!.s3s": `bmania_f/tekb2!.s3s`,
	/* 0d */ "shhhhh.s3s": `bmania_f/71.smp`,
	/* 13 */ "Bassbuz7.s3s": `bmania_f/Bassbuz7.s3s`,
	/* 14 */ "basbuz6.s3s": `bmania_f/46.smp`,
	/* 15 */ "bassdrum.s3s": `bmania_f/47.smp`,
	/* 15 */ "squarewv.s3s": `bmania_f/squarewv.s3s`,
	/* 16 */ "hihat.s3s": `bmania_f/48.smp`,
	/* 17 */ "snare.s3s": `bmania_f/49.smp`,
	/* 18 */ "trumpet.s3s": `bmania_f/51.smp`,
	/* 19 */ "bloop.s3s": `bmania_f/bloop.s3s`,
};

const samplesData = Object.fromEntries(Object.entries(samplesMappings[game]).map(([name, file]) => [name, fs.readFileSync(file)]));

for (let i = 0; i < data.length; i++) {
	if (String.fromCharCode.apply(null, data.slice(i, i+4)) === "SCRM") tryS3m(i);
	//if (String.fromCharCode.apply(null, data.slice(i, i+4)) === "SCRS") tryS3s(i);
}

function tryS3m(signature) {
	const start = signature - 44;
	console.log('\n --- ', start);
	const file = data.slice(start);
	if (file[28] !== 0x1a) return;
	const title = String.fromCharCode.apply(null, file.slice(0, 28).filter(c => c));
	const orders = ushort_le(file, 32);
	const instruments = ushort_le(file, 34);
	const patterns = ushort_le(file, 36);
	console.log('module', { title, orders, instruments, patterns });
	let p = 0x60 + orders;
	let size = p;
	let samplesStart;
	let samplesSize = 0;
	let samplesCount = 0;
	const samples = [];
	for (let i = 0; i < instruments; i++) {
		const instrumentPtr = (ushort_le(file, p) << 4);
		p += 2;
		if (file[instrumentPtr] !== 1) continue;
		const offset = ((file[instrumentPtr+13] << 16) | ushort_le(file, instrumentPtr+14)) << 4;
		const length = ulong_le(file, instrumentPtr+16);
		if (!samplesStart) samplesStart = offset;
		samplesSize += length;
		samplesCount++;
		size = Math.max(size, offset+length);
		const flags = file[instrumentPtr+31];
		const pack = file[instrumentPtr+30];
		if (pack) throw 'packed!';
		if (flags > 1) throw 'flags?';
		const c2spd = ulong_le(file, instrumentPtr+32)
		console.log('s', i+1, { offset, length, flags, c2spd },
			String.fromCharCode.apply(null, file.slice(instrumentPtr+1, instrumentPtr+13)),
			//file.slice(instrumentPtr+36, instrumentPtr+40),
			//file.slice(instrumentPtr+40, instrumentPtr+44),
			//file.slice(instrumentPtr+44, instrumentPtr+48),
			String.fromCharCode.apply(null, file.slice(instrumentPtr+48, instrumentPtr+76)));
		samples.push({ offset, length,
			name: String.fromCharCode.apply(null, file.slice(instrumentPtr+48, instrumentPtr+76).filter(c => c)) });
	}
	for (let i = 0; i < patterns; i++) {
		const offset = ushort_le(file, p) << 4;
		p += 2;
		const length = ushort_le(file, offset);
		size = Math.max(size, offset+length);
		console.log('p', i, { offset, length });
	}
	console.log({ p, size, samplesStart, samplesSize, samplesCount });
	const name = `${game}${String(++count).padStart(2, "0")}.s3m`;
	console.log(' =>', name);
	const dump = new Uint8Array(size);
	for (let i = 0; i < samplesStart; i++) dump[i] = file[i];
	for (let { offset, length, name } of samples) {
		(samplesData[name] || []).forEach((d, i) => {
			dump[offset+i] = d;
		});
		if (samplesData[name] && samplesData[name].length < length)
			console.warn(`sample ${name} too short (${samplesData[name].length} vs ${length})`);
	}
	fs.writeFileSync(name, dump);
}

function tryS3s(signature) {
	const start = signature - 76;
	console.log('\n +++ ', start);
	const file = data.slice(start);
	const offset = ((file[13] << 16) | ushort_le(file, 14)) << 4;
	const length = ulong_le(file, 16);
	console.log('S', { offset, length},
		String.fromCharCode.apply(null, file.slice(1, 13)),
		String.fromCharCode.apply(null, file.slice(48, 76)));
}

function ushort_le(array, start) {
	return array[start] | (array[start+1] << 8);
}

function ulong_le(array, start) {
	return array[start] | (array[start+1] << 8) | (array[start+2] << 16) | (array[start+3] << 24);
}
