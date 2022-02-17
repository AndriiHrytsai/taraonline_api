"use strict";

const {createUser} = require("./createUser");
const {updateUser} = require("./updateUser");
const {addRankingToUser} = require("./addRankingToUser");
const {createBetaUser} = require("./createBetaUser");
const {createManyBetaUser} = require("./createManyBetaUser");
const {removeBetaUser} = require("./removeBetaUser");
const {forgotPassword} = require("./forgotPassword");
const {changePassword} = require("./changePassword");
const {resetPassword} = require("./resetPassword");
const {activateAccount} = require("./activateAccount");
const {sendActivationLink} = require("./sendActivationLink");
const {banUser} = require("./banUser");
const {changeUserRole} = require("./changeUserRole");

const { createWarehouse } = require('./createWarehouse');
const { updateWarehouse } = require('./updateWarehouse');
const { removeWarehouse } = require('./removeWarehouse');


exports.createUser = createUser;
exports.updateUser = updateUser;
exports.addRankingToUser = addRankingToUser;
exports.createBetaUser = createBetaUser;
exports.createManyBetaUser = createManyBetaUser;
exports.removeBetaUser = removeBetaUser;
exports.forgotPassword = forgotPassword;
exports.changePassword = changePassword;
exports.resetPassword = resetPassword;
exports.activateAccount = activateAccount;
exports.sendActivationLink = sendActivationLink;
exports.banUser = banUser;
exports.changeUserRole = changeUserRole;

exports.createWarehouse = createWarehouse;
exports.updateWarehouse = updateWarehouse;
exports.removeWarehouse = removeWarehouse;
