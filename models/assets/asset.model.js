exports.name = 'assets';

exports.schema = {
  _id: 'number|string',
  itemId: 'number|string',
  assetUrl: 'string',
  mimetype: 'string',
  filesize: 'number',
  filename: 'string',
  userId: 'number|string',
  createdAt: 'date|convert:true',
  createdBy: 'string|optional:true',
  updatedAt: 'date|convert:true',
  updatedBy: 'string|optional:true',
  isDeleted: 'boolean|default:false'
}

exports.fields = [
  '_id',
  'itemId',
  'assetUrl',
  'mimetype',
  'filesize',
  'filename',
  'userId',
  'createdAt',
  'createdBy',
  'updatedAt',
  'updatedBy'
];
