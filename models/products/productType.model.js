exports.schema = {
  _id: 'string',
  name: 'string',
  value: 'string',
  productSort: ['string'],
  productLoad: ['string'],
  productSize: ['string'],
  isCustomSize: 'boolean|default:false',
  isCustomSort: 'boolean|default:false',
  isCustomLoad: 'boolean|default:false',
  isPalletType: 'boolean|default:false',
  isCertificate: 'boolean|default:false',
  isBrand: 'boolean|default:false',
  isHeight: 'boolean|default:false',
  isWidth: 'boolean|default:false',
  isLength: 'boolean|default:false',
  isDeleted: 'boolean|default:false',
  createdAt: 'date|convert:true',
  createdBy: 'string',
  modifiedAt: 'date|convert:true|optional:true',
  modifiedBy: 'string|optional:true'
};

exports.fields = [
  '_id',
  'name',
  'value',
  'isCustomSize',
  'isHeight',
  'isWidth',
  'isLength',
  'isDeleted',
  'createdAt',
  'createdBy',
  'updatedAt',
  'updatedBy'
];
