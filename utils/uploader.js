'use strict';

const S3Uploader = require('../aws/S3Uploader');
const s3 = require('../aws/config');

const fileUploader = new S3Uploader(s3);

module.exports = {fileUploader};
