'use strict';

const fs = require('fs');
const process = require('process');

if (process.argv.length <= 3) {
	console.error('usage: optimize-st3.js source_prefix dest_prefix');
	process.exit(1);
}

const source = process.argv[2];
const dest = process.argv[3];
fs.readdirSync('.').filter(file => file.startsWith(source) && file.endsWith('.s3m')).forEach(file => {
	const no = (new RegExp(`^${source}(.*)\.s3m$`)).exec(file)[1];
	optimize(file, `${dest}${no}.s3m`);
});

function optimize(original, modified) {
	console.log('\n *', original, '=>', modified);

	const file = Uint8Array.from(fs.readFileSync(original));
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
		const valid = file.slice(offset, offset+length).reduce((x, y) => x+y) > 0;
		console.log('s', i+1, { offset, length, flags, c2spd },
			String.fromCharCode.apply(null, file.slice(instrumentPtr+1, instrumentPtr+13)),
			//file.slice(instrumentPtr+36, instrumentPtr+40),
			//file.slice(instrumentPtr+40, instrumentPtr+44),
			//file.slice(instrumentPtr+44, instrumentPtr+48),
			String.fromCharCode.apply(null, file.slice(instrumentPtr+48, instrumentPtr+76)),
			valid);
		samples.push({ i: i+1, offset, length, valid,
			name: String.fromCharCode.apply(null, file.slice(instrumentPtr+48, instrumentPtr+76).filter(c => c)) });
	}
	const used = {};
	for (let i = 0; i < patterns; i++) {
		const offset = ushort_le(file, p) << 4;
		p += 2;
		const length = ushort_le(file, offset);
		size = Math.max(size, offset+length);
		//console.log('p', i, { offset, length });
		let q = offset + 2;
		while (q < offset+length) {
			const what = file[q++];
			if (what & 0x20) used[file[q+1]] = true;
			if (what & 0x20) q += 2;
			if (what & 0x40) q += 1;
			if (what & 0x80) q += 2;
		}
	}

	const newFile = file.slice();
	const newSamples = [];
	let offset = samples[0].offset;
	let newFileSize = 0;
	samples.forEach(sample => {
		if (!sample.valid || !used[sample.i]) {
			newSamples.push({ i: sample.i, offset, length: 0 });
			return;
		}
		for (let i = 0; i < sample.length; i++) {
			newFile[offset + i] = file[sample.offset + i];
		}
		newSamples.push({ i: sample.i, offset, length: sample.length });
		offset += sample.length;
		if (offset % 16 !== 0)
			offset += 16 - offset % 16;
		newFileSize = Math.max(offset, newFileSize);
	});
	console.log(newSamples);
	console.log(newFileSize - file.length);
	p = 0x60 + orders;
	for (let i = 0; i < instruments; i++) {
		const instrumentPtr = (ushort_le(newFile, p) << 4);
		p += 2;
		if (newFile[instrumentPtr] !== 1) continue;
		const offset = ((newFile[instrumentPtr+13] << 16) | ushort_le(newFile, instrumentPtr+14)) << 4;
		const sample = newSamples.find(s => s.i === i+1);
		if (!sample) continue;
		const newOffset = sample.offset >> 4;
		newFile[instrumentPtr+13] = (newOffset >> 16) & 0xff;
		newFile[instrumentPtr+14] = (newOffset >> 0) & 0xff;
		newFile[instrumentPtr+15] = (newOffset >> 8) & 0xff;
		if (sample.length === 0) {
			newFile.set([0, 0, 0, 0], instrumentPtr+16);
		}
	}
	fs.writeFileSync(modified, newFile.slice(0, newFileSize));
}

function ushort_le(array, start) {
	return array[start] | (array[start+1] << 8);
}

function ulong_le(array, start) {
	return array[start] | (array[start+1] << 8) | (array[start+2] << 16) | (array[start+3] << 24);
}
