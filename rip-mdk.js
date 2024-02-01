'use strict';

const fs = require('fs');
const path = require('path');

function tree(root) {
  let queue = [''];
  let result = [];
  while (queue.length > 0) {
    const dir = queue.shift();
    fs.readdirSync(`${root}/${dir}`).forEach(entry => {
      const entryPath = `${dir === '' ? '' : dir + '/'}${entry}`;
      const stat = fs.statSync(`${root}/${entryPath}`);
      if (stat.isDirectory())
        queue.push(entryPath);
      else
        result.push(entryPath);
    });
  }
  return result;
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

if (process.argv.length != 4) {
	console.error(`usage: ${process.argv[1]} in-dir out-dir`);
	process.exit(1);
}
const [,, inDir, outDir] = process.argv;
const formats = {
	SNI: { count: 20, entry: 24 },
};

for (const file of tree(inDir)) {
	const format = formats[file.match(/\.([A-Z]+)$/)?.[1]];
	if (!format) continue;
	const filePath = path.join(inDir, file);
	const size = fs.statSync(filePath).size;
	const data = new DataView(fs.readFileSync(filePath).buffer);
	const header = data.getUint32(0, true);
	if (header !== size - 4) continue;
	console.log(' -', file);
	const count = data.getUint32(format.count, true);
	let pos = format.count + 4;
	const files = []
	for (let i = 0; i < count; i++) {
		const name = readVarStr(data, pos, 8);
		const length = data.getUint32(pos + format.entry - 4, true);
		files.push({ name, length });
		pos += format.entry;
	}
	for (const { name, length } of files) {
		const header = String.fromCharCode(...new Uint8Array(data.buffer.slice(pos, pos+4)));
		if (header === 'RIFF') {
			const outFile = path.join(outDir, path.basename(file) + '-' + name + '.wav');
			console.log('    +', name, length);
			fs.writeFileSync(outFile, new Uint8Array(data.buffer.slice(pos, pos+length)));
		}
		pos += length + (length % 4 === 0 ? 0 : 4 - length % 4);
	}
}
