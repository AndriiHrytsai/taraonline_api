'use strict';

const {deleteAsset} = require('./deleteAsset');
const {deleteAssetList} = require('./deleteAssetList');
const {uploadAsset} = require('./uploadAsset');
const {createAssets} = require('./createAssets');
const {updateAsset} = require('./updateAsset');

exports.deleteAsset = deleteAsset;
exports.deleteAssetList = deleteAssetList;
exports.uploadAsset = uploadAsset;
exports.createAssets = createAssets;
exports.updateAsset = updateAsset;
