exports.schema = {
  _id: 'string',
  userId: 'string',
  name: 'string',
  email: 'string',
  phone: 'string',
  isDriver: 'boolean',
  description: 'string',
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
  'isDriver',
  'description',
  'createdAt',
  'createdBy',
  'updatedAt',
  'updatedBy',
  'isDeleted'
];
