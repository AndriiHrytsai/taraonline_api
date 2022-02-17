'use strict';

const {createNotification} = require('./createNotification');
const {updateNotification} = require('./updateNotification');
const {updateManyNotifications} = require('./updateManyNotifications');
const {removeNotification} = require('./removeNotification');
const {removeManyNotifications} = require('./removeManyNotifications');

exports.createNotification = createNotification;
exports.updateNotification = updateNotification;
exports.updateManyNotifications = updateManyNotifications;
exports.removeNotification = removeNotification;
exports.removeManyNotifications = removeManyNotifications;
