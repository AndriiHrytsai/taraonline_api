'use strict';

const {v4: uuid} = require('uuid');
const FileType = require('file-type');
const {DeleteObjectCommand, PutObjectCommand} = require('@aws-sdk/client-s3');

const createPublicUrl = (key) => `https://${process.env.S3_BUCKET}.s3.us-west-2.amazonaws.com/${key}`;

const createKey = (folder, entityId, ext) => `${folder}/${entityId}/${uuid()}.${ext}`;

class S3Uploader {
  constructor(s3) {
    this.s3 = s3;
  }

  async upload(buffer, key, mimetype) {
    const command = new PutObjectCommand({
      Key: key,
      CacheControl: 'max-age=31536000',
      Bucket: process.env.S3_BUCKET,
      ACL: 'public-read',
      Body: buffer,
      ContentType: mimetype
    });
    return this.s3.send(command);
  }

  async deleteFile(publicKey) {
    const keys = publicKey.split('/');

    const command = new DeleteObjectCommand({
      Key: keys[keys.length - 1],
      Bucket: process.env.S3_BUCKET
    });

    return this.s3.send(command);
  }

  async getDataForUpload(folder, entityId, buffer) {
    const {mime, ext} = await FileType.fromBuffer(buffer);
    const size = buffer.toString().length;
    const key = createKey(folder, entityId, ext);

    return {
      mime,
      key,
      size,
      url: createPublicUrl(key)
    };
  }
}

module.exports = S3Uploader;
