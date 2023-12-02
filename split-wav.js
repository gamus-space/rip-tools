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

if (process.argv.length < 4) {
	console.error(`usage: ${process.argv[1]} list|write file.wav [silence_sec=1 [threshold_db=-30]]`);
	process.exit(1);
}
const [,, op, file, silence_str, threshold_str] = process.argv;
if (op !== 'list' && op !== 'write') throw new Error('invalid op');
const silence = silence_str ? parseFloat(silence_str) : 1;
if (isNaN(silence) || silence <= 0) throw new Error('invalid silence value');
const threshold = threshold_str ? parseFloat(threshold_str) : -30;
if (isNaN(threshold)) throw new Error('invalid threshold value');
console.log({ silence_sec: silence, threshold_db: threshold });

const data = new DataView(fs.readFileSync(file).buffer);
if (data.getString(0, 4) !== 'RIFF') throw new Error('invalid RIFF signature');
if (data.getString(8, 4) !== 'WAVE') throw new Error('invalid WAVE signature');
if (data.getString(12, 4) !== 'fmt ') throw new Error('invalid fmt signature');
if (data.getUint16(20, true) !== 1) throw new Error('invalid format');
const channels = data.getUint16(22, true);
if (channels !== 2) throw new Error('unsupported channels');
const sampleRate = data.getUint32(24, true);
const bytesPerSample = data.getUint16(32, true);
const bits = data.getUint16(34, true);
if (bits !== 16) throw new Error('unsupported bits');
if (bytesPerSample !== bits / 8 * channels) throw new Error('invalid parameters');
if (data.getString(36, 4) !== 'data') throw new Error('invalid data signature');
const length = data.getUint32(40, true);
const offset = 44;
if (offset + length > data.byteLength) throw new Error('file incomplete');
console.log({ channels, sampleRate, bits, length });
const samples = length / bytesPerSample;

let silenceStart;
let silenceCount = 0;
let trackStart = 0;
const tracks = [];
for (let i = 0; i < samples; i++) {
	const l = data.getInt16(offset + i*bytesPerSample, true) / 32767;
	const r = data.getInt16(offset + i*bytesPerSample+2, true) / 32767;
	const db = 20 * Math.log10(Math.abs((l+r)/2));
	if (!silenceStart && db <= threshold) {
		silenceStart = i;
	} else if (silenceStart && db > threshold) {
		if (i-silenceStart > sampleRate * silence) {
			silenceCount++
			console.log(silenceCount, format(silenceStart), format(i-1), format(i-silenceStart));
			tracks.push({ from: trackStart, to: silenceStart });
			trackStart = i;
		}
		silenceStart = null;
	}
}
tracks.push({ from: trackStart, to: silenceStart ?? samples-1 });

console.log('\n--- tracks');
tracks.forEach((track, i) => {
	const outfile = path.join(path.dirname(file), path.basename(path.basename(file, '.wav'), '.WAV') + `_${i+1}.wav`);
	console.log(i+1, format(track.from), format(track.to), outfile);
	if (op === 'write') {
		const header = new DataView(data.buffer.slice(0, offset));
		header.setUint32(4, (track.to-track.from)*bytesPerSample+offset-8, true);
		header.setUint32(40, (track.to-track.from)*bytesPerSample, true);
		const trackData = Buffer.concat([new Uint8Array(header.buffer), new Uint8Array(data.buffer.slice(offset+track.from*bytesPerSample, offset+track.to*bytesPerSample))]);
		fs.writeFileSync(outfile, trackData);
	}
});

if (op === 'write') console.log('\ntracks written!');

function format(sample) {
	const m = Math.floor(sample / sampleRate / 60);
	const s = Math.floor((sample / sampleRate) % 60);
	const f = sample / sampleRate % 1;
	return `${m}:${s.toString().padStart(2, '0')}.${f.toString().slice(2, 5).padEnd(3, '0')}`;
}
