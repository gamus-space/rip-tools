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

const data = {
	tr3a: [
		{ file: '02_The_Puzzle_Element.wav', offset: 34840, size: 7665754 },
		{ file: '03_No_Waiting_Around_pt-I.wav', offset: 7700594, size: 6862938 },
		{ file: '04_Something_Spooky_Is_In_That_Jungle.wav', offset: 14563532, size: 6250586 },
		{ file: "05_Lara's_Themes.wav", offset: 20814118, size: 6107226 },
		{ file: '06_The_Cavern_Sewers.wav', offset: 26921344, size: 6023258 },
		{ file: '07_Geordie_Bob.wav', offset: 32944602, size: 6013018 },
		{ file: '08_Tony (The Loon).wav', offset: 38957620, size: 4933722 },
		{ file: '09_No_Waiting_Around_pt-II.wav', offset: 43891342, size: 3465306 },
		{ file: '10_The_Greedy_Mob.wav', offset: 47356648, size: 2728026 },
		{ file: '11_A_Long_Way_Up.wav', offset: 50084674, size: 2177114 },
		{ file: '12_No_Waiting_Around_pt-III.wav', offset: 52261788, size: 2130010 },
		{ file: '13_There_Be_Butterflies_Here_pt-II.wav', offset: 54391798, size: 2113626 },
		{ file: "14_She's_Cool.wav", offset: 56505424, size: 1753178 },
		{ file: '15_Mind_The_Gap_pt-II.wav', offset: 58258602, size: 1622106 },
		{ file: '16_Around_The_Corner_pt-II.wav', offset: 59880708, size: 1362010 },
		{ file: '17_Around_The_Corner_pt-I.wav', offset: 61242718, size: 1331290 },
		{ file: '18_Kneel_And_Pray.wav', offset: 62574008, size: 1232986 },
		{ file: '19_Around_The_Corner_pt-IV.wav', offset: 63806994, size: 1216602 },
		{ file: '20_Around_The_Corner_pt-III.wav', offset: 65023596, size: 1093722 },
		{ file: '21_Seeing_Is_Believing_pt-I.wav', offset: 66117318, size: 974938 },
		{ file: '22_Looky_What_We_Have_Here_pt-III.wav', offset: 67092256, size: 952410 },
		{ file: '23_There_Be_Butterflies_Here_pt-IV.wav', offset: 68044666, size: 929882 },
		{ file: '24_Stone_The_Crows_pt-X.wav', offset: 68974548, size: 925786 },
		{ file: '25_There_Be_Butterflies_Here_pt-III.wav', offset: 69900334, size: 909402 },
		{ file: '26_Meteorite_Cavern.wav', offset: 70809736, size: 9306202 },
		{ file: '27_Steady.wav', offset: 80115938, size: 8140890 },
		{ file: '28_Antarctica.wav', offset: 88256828, size: 7385178 },
		{ file: '29_Things.wav', offset: 95642006, size: 5605466 },
		{ file: '30_Anyone_There.wav', offset: 101247472, size: 5240922 },
		{ file: '31_Grotto.wav', offset: 106488394, size: 5224538 },
		{ file: '32_On_The_Beach.wav', offset: 111712932, size: 4667482 },
		{ file: '33_Gamma_Pals.wav', offset: 116380414, size: 4401242 },
		{ file: '34_In_The_Jungle.wav', offset: 120781656, size: 4024410 },
		{ file: '35_Piranha_Waters.wav', offset: 124806066, size: 3915866 },
		{ file: '36_The_Rapids.wav', offset: 128721932, size: 2926682 },
		{ file: '37_Supper_Time.wav', offset: 131648614, size: 2543706 },
		{ file: '38_Look_Out_pt-V.wav', offset: 134192320, size: 835674 },
		{ file: '39_Looky_What_We_Have_Here_pt-I.wav', offset: 135027994, size: 786522 },
		{ file: '40_Around_The_Corner_pt-V.wav', offset: 135814516, size: 774234 },
		{ file: '41_Seeing_Is_Believing_pt-II.wav', offset: 136588750, size: 727130 },
		{ file: '42_Stone_The_Crows_pt-IX.wav', offset: 137315880, size: 718938 },
		{ file: '43_Look_Out_pt-VIII.wav', offset: 138034818, size: 575578 },
		{ file: '44_Look_Out_pt-IV.wav', offset: 138610396, size: 561242 },
		{ file: '45_Stone_The_Crows_pt-VII.wav', offset: 139171638, size: 258138 },
		{ file: '46_Stone_The_Crows_pt-III.wav', offset: 139429776, size: 512090 },
		{ file: '47_Stone_The_Crows_pt-VIII.wav', offset: 139941866, size: 487514 },
		{ file: '48_Looky_What_We_Have_Here_pt-II.wav', offset: 140429380, size: 475226 },
		{ file: '49_Stone_The_Crows_pt-IV.wav', offset: 140904606, size: 456794 },
		{ file: '50_Stone_The_Crows_pt-VI.wav', offset: 141361400, size: 456794 },
		{ file: '51_Look_Out_pt-III.wav', offset: 141818194, size: 403546 },
		{ file: '52_Look_Out_pt-I.wav', offset: 142221740, size: 376922 },
		{ file: '53_There_Be_Butterflies_Here_pt-I.wav', offset: 142598662, size: 333914 },
		{ file: '54_Stone_The_Crows_pt-I.wav', offset: 142932576, size: 319578 },
		{ file: '55_Stone_The_Crows_pt-V.wav', offset: 143252154, size: 262234 },
		{ file: '56_Mind_The_Gap_pt-I.wav', offset: 143514388, size: 251994 },
		{ file: '57_There_Be_Butterflies_Here_pt-V.wav', offset: 143766382, size: 223322 },
		{ file: '58_Look_Out_pt-II.wav', offset: 143989704, size: 223322 },
		{ file: '59_Look_Out_pt-VII.wav', offset: 144213026, size: 223322 },
		{ file: '60_Stone_The_Crows_pt-II.wav', offset: 144436348, size: 223322 },
		{ file: '61_Look_Out_pt-VI.wav', offset: 144659670, size: 223322 },
		{ file: '62_Scotts-Hut_(English).wav', offset: 144882992, size: 6137946 },
		{ file: '63_Cavern-Sewers_(English).wav', offset: 151020938, size: 6023258 },
		{ file: '64_Jungle-Camp_(English).wav', offset: 157044196, size: 4933722 },
		{ file: '65_Worship-Room_(English).wav', offset: 161977918, size: 4415578 },
		{ file: '66_Cavern_(English).wav', offset: 166393496, size: 4239450 },
		{ file: '67_Rooftops_(English).wav', offset: 170632946, size: 4034650 },
		{ file: '68_Tree-Shack_(English).wav', offset: 174667596, size: 4022362 },
		{ file: '69_Temple-Exit_(Generic).wav', offset: 178689958, size: 2732122 },
		{ file: '70_Delivery-Truck_(English).wav', offset: 181422080, size: 2144346 },
		{ file: '71_Penthouse_(English).wav', offset: 183566426, size: 1906778 },
		{ file: '72_Ravine_(English).wav', offset: 185473204, size: 1757274 },
		{ file: '73_Old_Smokey.wav', offset: 187230478, size: 5955674 },
		{ file: '74_Under_Smokey.wav', offset: 193186152, size: 7475362 },
		{ file: '75_Refining_Plant.wav', offset: 200661514, size: 7381082 },
		{ file: '76_Rumble_Sub.wav', offset: 208042596, size: 5220442 },
		{ file: '77_Quake.wav', offset: 213263038, size: 4384858 },
		{ file: '78_Blank.wav', offset: 217647896, size: 223322 }
	],
	tr3b: [
		{ file: '82.wav', offset: 217871218, size: 28762 },
		{ file: '83.wav', offset: 217899980, size: 32858 },
		{ file: '84.wav', offset: 217932838, size: 65626 },
		{ file: '85.wav', offset: 217998464, size: 69722 },
		{ file: '86.wav', offset: 218068186, size: 71770 },
		{ file: '87.wav', offset: 218139956, size: 75866 },
		{ file: '88.wav', offset: 218215822, size: 77914 },
		{ file: '89.wav', offset: 218293736, size: 86106 },
		{ file: '90.wav', offset: 218379842, size: 88154 },
		{ file: '91.wav', offset: 218467996, size: 88154 },
		{ file: '92.wav', offset: 218556150, size: 92250 },
		{ file: '93.wav', offset: 218648400, size: 106586 },
		{ file: '94.wav', offset: 218754986, size: 125018 },
		{ file: '95.wav', offset: 218880004, size: 129114 },
		{ file: '96.wav', offset: 219009118, size: 129114 },
		{ file: '97.wav', offset: 219138232, size: 149594 },
		{ file: '98.wav', offset: 219287826, size: 155738 },
		{ file: '99.wav', offset: 219443564, size: 161882 },
		{ file: '100.wav', offset: 219605446, size: 168026 },
		{ file: '101.wav', offset: 219773472, size: 168026 },
		{ file: '102.wav', offset: 219941498, size: 180314 },
		{ file: '103.wav', offset: 220121812, size: 192602 },
		{ file: '104.wav', offset: 220314414, size: 198746 },
		{ file: '105.wav', offset: 220513160, size: 217178 },
		{ file: '106.wav', offset: 220730338, size: 223322 },
		{ file: '107.wav', offset: 220953660, size: 229466 },
		{ file: '108.wav', offset: 221183126, size: 290906 },
		{ file: '109.wav', offset: 221474032, size: 397402 },
		{ file: '110.wav', offset: 221871434, size: 407642 },
		{ file: '111.wav', offset: 222279076, size: 458842 },
		{ file: '112.wav', offset: 222737918, size: 501850 },
		{ file: '113.wav', offset: 223239768, size: 563290 },
		{ file: '114.wav', offset: 223803058, size: 641114 },
		{ file: '115.wav', offset: 224444172, size: 669786 },
		{ file: '116.wav', offset: 225113958, size: 694362 },
		{ file: '117.wav', offset: 225808320, size: 733274 },
		{ file: '118.wav', offset: 226541594, size: 755802 },
		{ file: '119.wav', offset: 227297396, size: 831578 },
		{ file: '120_In_The_Hut.wav', offset: 228128974, size: 7385178 },
		{ file: '121_And_So_On.wav', offset: 235514152, size: 3551322 },
		{ file: '122_secret.WAV', offset: 239065474, size: 284762 },
		{ file: '123_secret.WAV', offset: 239350236, size: 284762 }
	],
};

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
case 'tr3a':
case 'tr3b':
	for (const entry of data[game]) {
		console.log(entry);
		slice('data/cdaudio.wad', 'data/tr3/' + entry.file, entry.offset, entry.offset + entry.size);
	}
	break;
default:
	console.error(`unknown game: ${game}`);
	process.exit(1);
}
