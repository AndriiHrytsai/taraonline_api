'use strict';

const { S3Client } = require('@aws-sdk/client-s3');
const { config } = require('dotenv');

config();

module.exports = new S3Client({
  region: process.env.AWS_REGION,
  forcePathStyle: true,
  ...(process.env.AWS_ENDPOINT ? { bucketEndpoint: process.env.AWS_ENDPOINT } : {}),
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
