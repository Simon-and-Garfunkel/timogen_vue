#!/bin/bash

export NODE_OPTIONS='--openssl-legacy-provider'
npm run build

cd dist

git init
git remote add origin git@github.com:timogen-be/timogen-be.github.io.git
git add -A
git commit -m 'deploy'

git push --set-upstream origin main -f

cd -
