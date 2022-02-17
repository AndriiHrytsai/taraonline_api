exports.schema = {
  _id: 'string',
  placeId: 'string',
  placeName: 'string',
  latitude: 'string',
  longitude: 'string',
  houseNumber: 'string',
  streetName: 'string',
  createdAt: 'date|convert:true',
  createdBy: 'string|optional:true',
  updatedAt: 'date|convert:true',
  updatedBy: 'string|optional:true',
  isDeleted: 'boolean|default:false'
}

exports.fields = [
  '_id',
  'placeId',
  'placeName',
  'latitude',
  'longitude',
  'houseNumber',
  'streetName',
  'createdAt',
  'createdBy',
  'updatedAt',
  'updatedBy',
  'isDeleted'
];
