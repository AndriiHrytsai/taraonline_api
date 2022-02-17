exports.schema = {
  _id: 'string',
  deliveryId: 'string',
  price: 'number',
  freeSpace: 'number',
  space: 'number',
  startAddress: 'string',
  endAddress: 'string',
  startDate: 'string',
  endDate: 'string',
  createdAt: 'date|convert:true',
  createdBy: 'string|optional:true',
  updatedAt: 'date|convert:true',
  updatedBy: 'string|optional:true',
  isDeleted: 'boolean|default:false'
}

exports.fields = [
  '_id',
  'userId',
  'name',
  'email',
  'phone',
  'space',
  'createdAt',
  'createdBy',
  'updatedAt',
  'updatedBy',
  'isDeleted'
];
