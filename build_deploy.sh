npm run browserify
aws s3 cp lib/output.js s3://krzysztof.morcinek.conquerorgame/output.js --acl public-read --profile s3_conqueror_uploader