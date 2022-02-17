exports.schema = {
  _id: 'string',
  userId: 'string',
  itemId: 'string',
  votedUserId: 'string',
  rating: 'number',
  createdAt: 'date|convert:true',
}

exports.fields = [
  '_id',
  'userId',
  'itemId',
  'votedUserId',
  'rating',
  'createdAt',
];
