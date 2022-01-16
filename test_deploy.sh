#!/bin/bash

# sh ./build.sh &&
npm test &&
npm run browserify

aws s3 cp lib/output.js s3://krzysztof.morcinek.conquerorgame/output-for-testing.js --acl public-read --profile s3_conqueror_uploader
