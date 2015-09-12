#!/bin/bash

lines=`ls -l *.jpg | wc -l`
line=0

echo [ > data.json

for f in `ls *.jpg`
do
	desc=${f/.jpg/}
	desc=${desc//-/ }

    echo -e "\t{" >> data.json
	echo -e "\t\t\"file\": \"$f\"", >> data.json
	echo -e "\t\t\"description\": \"$desc\"" >> data.json
	close="\t}"

	line=$((line+1))

	if [ "$line" -lt "$lines" ] ; then close=$close, >> data.json ; fi

	echo -e $close >> data.json
done

echo ] >> data.json