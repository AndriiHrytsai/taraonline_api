exports.schema = {
  _id: 'string',
  name: 'string',
  value: 'string',
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
  'isDeleted',
  'createdAt',
  'createdBy',
  'updatedAt',
  'updatedBy'
];
