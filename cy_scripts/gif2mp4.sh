#!/bin/bash
[ ! -d exports ] && mkdir exports
crf=26
[ $2 ] && crf=$2
echo 'using crf = ' $crf 

file=$(basename $1);file=${file%.*}

ffmpeg -i $1 -an -crf $crf -strict -2 -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -preset veryslow -pix_fmt yuv420p exports/$file.mp4

# Example usage in bash
#   for file in source/img/guides/*.gif; ./cy_scripts/cy-videos/gif2mp4.sh $file; done
# then copy exports/<new-file>.mp4 where you want, probably source/img/snippets


