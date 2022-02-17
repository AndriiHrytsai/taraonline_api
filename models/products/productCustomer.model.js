exports.schema = {
  _id: 'string',
  customerId: 'string',
  ownerId: 'string',
  productId: 'string',
  conversationId: 'string',
  city: {
    name: 'string',
    placeId: 'string'
  },
  count: 'number',
  houseNumber: 'string',
  streetName: 'string',
  createdAt: 'date|convert:true',
  updatedAt: 'date|convert:true',
  isApproved: 'boolean|default:false',
  isFinished: 'boolean|default:false',
  isOwnerTransport: 'boolean|default:false',
  isDeleted: 'boolean|default:false',
  dateLoad: 'date|convert:true'
};

exports.fields = [
  '_id',
  'customerId',
  'conversationId',
  'ownerId',
  'productId',
  'createdAt',
  'updatedAt',
  'isApproved',
  'isFinished',
  'isOwnerTransport',
  'isDeleted',
  'dateLoad'
];
