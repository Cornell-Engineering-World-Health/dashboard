#!/bin/bash

db="test"
collection="restaurants"

pathToRawData="./data/rawData/"
pathToData="./data/"
offset=1000

rm -rf $pathToRawData
mongoexport --db $db --collection $collection --limit $offset --jsonArray --out $pathToRawData"data.json"
zip -rj $pathToData"data.zip" $pathToRawData