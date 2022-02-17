'use strict';

const {createProduct} = require('./createProduct');
const {createPaymentType} = require('./createPaymentType');
const {createProductStatus} = require('./createProductStatus');
const {createProductType} = require('./createProductType');
const {createProductSize} = require('./createProductSize');
const {createProductLoad} = require('./createProductLoad');
const {createProductSort} = require('./createProductSort');
const {createProductCustomer} = require('./createProductCustomer');
const {createProductPalletType} = require('./createProductPalletType');
const {createProductBrand} = require('./createProductBrand');

const {removeProduct} = require('./removeProduct');
const {removePaymentType} = require('./removePaymentType');
const {removeProductType} = require('./removeProductType');
const {removeProductStatus} = require('./removeProductStatus');
const {removeProductSize} = require('./removeProductSize');
const {removeProductLoad} = require('./removeProductLoad');
const {removeProductSort} = require('./removeProductSort');
const {removeProductCustomer} = require('./removeProductCustomer');
const {removeProductPalletType} = require('./removeProductPalletType');
const {removeProductBrand} = require('./removeProductBrand');

const {updatePaymentType} = require('./updatePaymentType');
const {updateProduct} = require('./updateProduct');
const {updateProductCustomer} = require('./updateProductCustomer');
const {updateProductStatus} = require('./updateProductStatus');
const {updateProductType} = require('./updateProductType');
const {updateProductSize} = require('./updateProductSize');
const {updateProductLoad} = require('./updateProductLoad');
const {updateProductSort} = require('./updateProductSort');
const {updateProductPalletType} = require('./updateProductPalletType');
const {updateProductBrand} = require('./updateProductBrand');

const {activateProduct} = require('./activateProduct');
const {deactivateProduct} = require('./deactivateProduct');

exports.createProduct = createProduct;
exports.createPaymentType = createPaymentType;
exports.createProductStatus = createProductStatus;
exports.createProductType = createProductType;
exports.createProductSize = createProductSize;
exports.createProductLoad = createProductLoad;
exports.createProductSort = createProductSort;
exports.createProductCustomer = createProductCustomer;
exports.createProductPalletType = createProductPalletType;
exports.createProductBrand = createProductBrand;

exports.removeProduct = removeProduct;
exports.removePaymentType = removePaymentType;
exports.removeProductType = removeProductType;
exports.removeProductStatus = removeProductStatus;
exports.removeProductSize = removeProductSize;
exports.removeProductLoad = removeProductLoad;
exports.removeProductSort = removeProductSort;
exports.removeProductCustomer = removeProductCustomer;
exports.removeProductPalletType = removeProductPalletType;
exports.removeProductBrand = removeProductBrand;

exports.updatePaymentType = updatePaymentType;
exports.updateProduct = updateProduct;
exports.updateProductCustomer = updateProductCustomer;
exports.updateProductStatus = updateProductStatus;
exports.updateProductType = updateProductType;
exports.updateProductSize = updateProductSize;
exports.updateProductLoad = updateProductLoad;
exports.updateProductSort = updateProductSort;
exports.updateProductPalletType = updateProductPalletType;
exports.updateProductBrand = updateProductBrand;

exports.activateProduct = activateProduct;
exports.deactivateProduct = deactivateProduct;
