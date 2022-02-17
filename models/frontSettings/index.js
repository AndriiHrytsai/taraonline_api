exports.schema = {
    enabledRegistration: 'boolean|default:false',
    modifiedAt: 'date|convert:true|optional:true',
    modifiedBy: 'string|optional:true',
};

exports.fields = [
    'enabledRegistration',
    'modifiedBy',
    'modifiedAt',
];
