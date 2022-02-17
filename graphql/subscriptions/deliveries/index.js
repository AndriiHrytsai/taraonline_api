'use strict';

const {deliveryCreated} = require('./deliveryCreated');
const {deliveryUpdated} = require('./deliveryUpdated');
const {deliveryDeleted} = require('./deliveryDeleted');

exports.deliveryCreated = deliveryCreated;
exports.deliveryUpdated = deliveryUpdated;
exports.deliveryDeleted = deliveryDeleted;
