#!/bin/bash

lines=`ls -l *.jpg | wc -l`
line=0

echo -e "define(function definePhotos(){\n\treturn [" > data.js

for f in `ls *.jpg`
do
	desc=${f/.jpg/}
	desc=${desc//-/ }

    echo -e "\t\t{" >> data.js
	echo -e "\t\t\t\"file\": \"photos/$f\"", >> data.js
	echo -e "\t\t\t\"description\": \"$desc\"" >> data.js
	close="\t\t}"

	line=$((line+1))

	if [ "$line" -lt "$lines" ] ; then close=$close, >> data.js ; fi

	echo -e $close >> data.js
done

echo -e "\t];\n});" >> data.js