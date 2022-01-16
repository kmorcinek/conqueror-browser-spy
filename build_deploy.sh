#!/bin/bash

sh ./build.sh &&

aws s3 cp lib/output.js s3://krzysztof.morcinek.conquerorgame/output.js --acl public-read --profile s3_conqueror_uploader

# when extracting version will be possible then taging can be automated
echo "remember to run tagging:
git tag v1.x
git push origin --tags"
