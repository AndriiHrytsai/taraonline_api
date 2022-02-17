'use strict';

const {productCreated} = require('./productCreated');
const {productUpdated} = require('./productUpdated');
const {productDeleted} = require('./productDeleted');
const {productCustomerCreated} = require('./productCustomerCreated');
const {productCustomerUpdated} = require('./productCustomerUpdated');

exports.productCreated = productCreated;
exports.productUpdated = productUpdated;
exports.productDeleted = productDeleted;
exports.productCustomerCreated = productCustomerCreated;
exports.productCustomerUpdated = productCustomerUpdated;
