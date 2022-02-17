exports.schema = {
  _id: 'string',
  name: 'string',
  type: 'string',
  productId: 'string',
  deliveryId: 'string',
  productCustomerId: 'string',
  deliveryCustomerId: 'string',
  members: ['string'],
  chatClosesUsers: ['string'],
  lastMessageId: 'string',
  lastMessageDate: 'date|convert:true',
  createdAt: 'date|convert:true',
  isDeleted: 'boolean|default:false'
}

exports.fields = [
  '_id',
  'name',
  'type',
  'members',
  'productId',
  'deliveryId',
  'productCustomerId',
  'deliveryCustomerId',
  'lastMessageId',
  'lastMessageDate',
  'createdAt',
  'isDeleted'
];
