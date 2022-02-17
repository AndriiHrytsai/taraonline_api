exports.schema = {
  _id: 'string',
  userId: 'string',
  title: 'string',
  message: 'string',
  seen: 'boolean',
  createdAt: 'date|convert:true',
  updatedAt: 'date|convert:true',
  isDeleted: 'boolean|default:false'
}

exports.fields = [
  '_id',
  'userId',
  'title',
  'message',
  'seen',
  'createdAt',
  'updatedAt',
  'isDeleted'
];
