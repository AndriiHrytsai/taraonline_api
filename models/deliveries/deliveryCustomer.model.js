exports.schema = {
  _id: 'string',
  deliveryId: 'string',
  customerId: 'string',
  ownerId: 'string',
  startAddress: {
    name: 'string',
    placeId: 'string'
  },
  endAddress: {
    name: 'string',
    placeId: 'string'
  },
  freeSpace: 'number',
  message: 'string',
  createdAt: 'date|convert:true',
  createdBy: 'string|optional:true',
  updatedAt: 'date|convert:true',
  updatedBy: 'string|optional:true',
  isDeleted: 'boolean|default:false'
}

exports.fields = [
  '_id',
  'deliveryId',
  'customerId',
  'ownerId',
  'startAddress',
  'endAddress',
  'freeSpace',
  'message',
  'createdAt',
  'createdBy',
  'updatedAt',
  'updatedBy',
  'isDeleted'
];
