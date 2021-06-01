#!/bin/bash

# Loop through arguments to determine deploy env (dev, staging, embargoed, or prod)
for arg in "$@"
do
    case $arg in
        --dev)
        S3_BUCKET=edop-explorer-dev/explorer
        CLOUDFRONT_ID=EX40URMY4LM1
        shift # Remove --dev from processing
        ;;
        --staging)
        S3_BUCKET=edop-explorer-staging/explorer
        CLOUDFRONT_ID=E3RUN2ZOVQG0DY
        shift # Remove --dev from processing
        ;;
        --embargoed)
        S3_BUCKET=private.edopportunity.org
        CLOUDFRONT_ID=E8AMX240UHX5F
        shift # Remove --dev from processing
        ;;
        --prod)
        S3_BUCKET=edop-explorer-production/explorer
        CLOUDFRONT_ID=E2OT07260LEDV6
        shift # Remove --dev from processing
        ;;
        OTHER_ARGUMENTS+="$1")
        shift # Remove generic argument from processing
        ;;
    esac
done

# Build and deploy
npm run build
aws s3 cp build/ s3://$S3_BUCKET --recursive --cache-control max-age=604800
aws cloudfront create-invalidation --distribution-id=$CLOUDFRONT_ID --paths="/*"

exit 0