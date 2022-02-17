'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.ProductOptionsList = gql`
    type ProductOptionsList  {
        productTypes: ProductTypeList
        productSizes: ProductSizeList
        productSorts: ProductSortList
        productLoads: ProductLoadList
        paymentTypes: PaymentTypeList
        productPalletTypes: ProductPalletTypeList
        productBrands: ProductBrandList
    }
`;
