'use strict';

const {notificationCreated} = require('./notificationCreated');
const {notificationUpdated} = require('./notificationUpdated');
const {notificationDeleted} = require('./notificationDeleted');

exports.notificationCreated = notificationCreated;
exports.notificationUpdated = notificationUpdated;
exports.notificationDeleted = notificationDeleted;
