#!/bin/sh

if [ $# -lt 2 ]; then
	echo usage: $0 out_dir file.map ...
	exit 1
fi

dir=$1
shift

for f in $@; do
	echo $f
	vgmstream-cli -S0 -o $dir/map2wav\?05s.wav $f
	sox $dir/map2wav*.wav $dir/`basename $f`.wav
	rm -f $dir/map2wav*.wav
done
