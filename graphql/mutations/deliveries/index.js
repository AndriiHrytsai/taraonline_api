'use strict';

const { createDelivery } = require('./createDelivery');
const { createDeliveryRoute } = require('./createDeliveryRoute');
const { createDeliveryAddress } = require('./createDeliveryAddress');
const { createDeliveryCustomer } = require('./createDeliveryCustomer');

const { removeDelivery } = require('./removeDelivery');
const { removeDeliveryRoute } = require('./removeDeliveryRoute');
const { removeDeliveryAddress } = require('./removeDeliveryAddress');
const { removeDeliveryCustomer } = require('./removeDeliveryCustomer');

const { updateDelivery } = require('./updateDelivery');
const { updateDeliveryRoute } = require('./updateDeliveryRoute');
const { updateDeliveryAddress } = require('./updateDeliveryAddress');
const { updateDeliveryCustomer } = require('./updateDeliveryCustomer');

exports.createDelivery = createDelivery;
exports.createDeliveryRoute = createDeliveryRoute;
exports.createDeliveryAddress = createDeliveryAddress;
exports.createDeliveryCustomer = createDeliveryCustomer;

exports.removeDelivery = removeDelivery;
exports.removeDeliveryRoute = removeDeliveryRoute;
exports.removeDeliveryAddress = removeDeliveryAddress;
exports.removeDeliveryCustomer = removeDeliveryCustomer;

exports.updateDelivery = updateDelivery;
exports.updateDeliveryRoute = updateDeliveryRoute;
exports.updateDeliveryAddress = updateDeliveryAddress;
exports.updateDeliveryCustomer = updateDeliveryCustomer;
