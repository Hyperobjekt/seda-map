#!/bin/bash

# Deploys private version of the explorer
# NOTE: should update "homepage" in package.json to "./" before deploying

npm run build

S3_BUCKET=edop-explorer-staging
CLOUDFRONT_ID=E3RUN2ZOVQG0DY

aws s3 cp build/ s3://$S3_BUCKET/explorer --recursive --cache-control max-age=604800
aws cloudfront create-invalidation --distribution-id=$CLOUDFRONT_ID --paths="/*"