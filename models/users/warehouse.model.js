exports.schema = {
  _id: 'string',
  name: 'string',
  placeId: 'string',
  houseNumber: 'string',
  streetName: 'string',
  isDeleted: 'boolean|default:false',
  createdAt: 'date|convert:true',
  createdBy: 'string|optional:true',
  updatedAt: 'date|convert:true',
  updatedBy: 'string|optional:true',
};

exports.fields = [
  '_id',
  'name',
  'placeId',
  'houseNumber',
  'streetName',
  'isDeleted',
  'createdAt',
  'createdBy',
  'updatedAt',
  'updatedBy',
];
