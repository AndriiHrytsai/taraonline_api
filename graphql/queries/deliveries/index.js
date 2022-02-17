'use strict';

const { delivery } = require('./delivery');
const { deliveries } = require('./deliveries');
const { deliveryRoute } = require('./deliveryRoute');
const { deliveryRoutes } = require('./deliveryRoutes');
const { deliveryAddress } = require('./deliveryAddress');
const { deliveryAddresses } = require('./deliveryAddresses');
const { deliveryCustomer } = require('./deliveryCustomer');
const { deliveryCustomers } = require('./deliveryCustomers');

exports.delivery = delivery;
exports.deliveries = deliveries;
exports.deliveryRoute = deliveryRoute;
exports.deliveryRoutes = deliveryRoutes;
exports.deliveryAddress = deliveryAddress;
exports.deliveryAddresses = deliveryAddresses;
exports.deliveryCustomer = deliveryCustomer;
exports.deliveryCustomers = deliveryCustomers;
