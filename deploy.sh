#!/bin/bash

set -e

tsc

src=$(cat index.html)
src=${src/build/cards-memory-game}
echo $src > ./build/index.html

cd build

git init
git add .
git commit -m "deploy"

git push -f git@github.com:fosseddy/cards-memory-game.git master:gh-pages
