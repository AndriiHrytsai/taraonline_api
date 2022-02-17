exports.schema = {
  _id: 'string',
  userId: 'string',
  conversationId: 'string',
  message: 'string',
  seen: 'boolean',
  createdAt: 'date|convert:true',
  updatedAt: 'date|convert:true',
  isDeleted: 'boolean|default:false'
}

exports.fields = [
  '_id',
  'userId',
  'conversationId',
  'message',
  'seen',
  'createdAt',
  'updatedAt',
  'isDeleted'
];
