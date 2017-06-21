#!/bin/bash

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 web-socket-uri"
  exit 1
fi
newuri=$1
echo "Using ws://$newuri"

if [[ $OSTYPE == darwin* ]]; then
  sed -i '' -- 's/CHANGEMEWSURI/'"$newuri"'/g' script.js
else
  sed -i -- 's/CHANGEMEWSURI/'"$newuri"'/g' script.js
fi



