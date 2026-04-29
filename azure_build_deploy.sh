#!/bin/bash

sh ./build.sh &&

az storage blob upload \
  --account-name conquerorgamespy \
  --container-name spy \
  --name output.js \
  --file lib/output.js \
  --overwrite

echo "remember to run tagging:
git tag v1.x
git push origin --tags"
