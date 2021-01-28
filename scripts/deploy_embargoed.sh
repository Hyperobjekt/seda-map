#!/bin/bash

# Deploys private version of the explorer

S3_BUCKET=private.edopportunity.org
CLOUDFRONT_ID=E8AMX240UHX5F

npm run build

aws s3 cp build/ s3://$S3_BUCKET --recursive --cache-control max-age=604800
aws cloudfront create-invalidation --distribution-id=$CLOUDFRONT_ID --paths="/*"