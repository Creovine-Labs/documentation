#!/bin/bash
# Creovine Docs - AWS Deployment Script
# Usage: ./deploy.sh
#
# Prerequisites:
# - AWS CLI configured with appropriate credentials
# - Node.js 20+ installed
# - ACM certificate validated for docs.creovine.com

set -e

BUCKET="docs.creovine.com"
REGION="us-east-1"

echo "=== Building Docusaurus site ==="
npm run build

echo "=== Uploading to S3 ==="
aws s3 sync build/ "s3://${BUCKET}/" --delete --region "${REGION}"

echo "=== Invalidating CloudFront cache ==="
# Get the distribution ID
DIST_ID=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Aliases.Items[0]=='docs.creovine.com'].Id | [0]" \
  --output text 2>/dev/null)

if [ -n "$DIST_ID" ] && [ "$DIST_ID" != "None" ]; then
  aws cloudfront create-invalidation \
    --distribution-id "$DIST_ID" \
    --paths "/*" \
    --region "${REGION}"
  echo "=== CloudFront invalidation created for distribution ${DIST_ID} ==="
else
  echo "=== No CloudFront distribution found — skipping invalidation ==="
fi

echo "=== Deployment complete ==="
echo "Site: https://docs.creovine.com"
