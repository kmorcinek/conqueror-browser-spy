#!/bin/bash

npm test &&
npm run browserify &&

az storage blob upload \
  --account-name conquerorgamespy \
  --container-name spy \
  --name output-for-testing.js \
  --file lib/output.js \
  --overwrite
