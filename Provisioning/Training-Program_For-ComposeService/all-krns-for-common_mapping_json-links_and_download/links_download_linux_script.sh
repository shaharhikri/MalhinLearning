#!/bin/bash

links="$1"
i=0
while IFS= read -r link
do
  #echo $i
  wget $link -O "./krns/$i.krn" &
  (( i++ ))
  sleep 0.5
done < "$links"
wait
