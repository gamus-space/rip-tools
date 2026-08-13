'use strict';

const fs = require('fs');
const process = require('process');

if (process.argv.length <= 4) {
	console.error('usage: mute-cd-files.js original_archive new_archive track_file [...]');
	process.exit(1);
}

const [,, originalArchivePath, newArchivePath, ...trackPaths] = process.argv;

console.log('archive', originalArchivePath);

const offsets = [];

const archive = new Uint8Array(fs.readFileSync(originalArchivePath));
trackPaths.forEach(trackPath => {
	const track = new Uint8Array(fs.readFileSync(trackPath));
	for (let i = 0; i <= archive.length - track.length; i++) {
		let j;
		const offset = i;
		for (j = 0; j < track.length; j++) {
			if (archive[i+j] !== track[j]) {
				if (j !== 0 && archive[i+j+304] === track[j]) {
					i += 304; j--;
					continue;
				} else break;
			}
		}
		if (j < track.length) continue;
		console.log(' * ', trackPath, 'found at offset', offset);
		offsets.push(offset);
	}
});

trackPaths.forEach((trackPath, index) => {
	const track = new Uint8Array(fs.readFileSync(trackPath));
	for (let i = offsets[index]; i <= archive.length - track.length; i++) {
		let j;
		for (j = 0; j < track.length; j++) {
			if (archive[i+j] !== track[j]) {
				if (j !== 0 && archive[i+j+304] === track[j]) {
					i += 304; j--;
					continue;
				} else break;
			}
			archive[i+j] = 0;
		}
		if (j < track.length) throw new Error('inconsistency');
		break;
	}
});

fs.writeFileSync(newArchivePath, archive);
console.log('written to', newArchivePath);
