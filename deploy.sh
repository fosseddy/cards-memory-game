#!/bin/bash

set -e

tsc
cd build

git init
git add .
git commit -m "deploy"

git push -f git@github.com:fosseddy/cards-memory-game.git master:gh-pages
