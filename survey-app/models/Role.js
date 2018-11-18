var keystone = require('keystone');
var Types = keystone.Field.Types;

var Role = new keystone.List('Role');

Role.add({
    name: { type: Types.Text, initial: true, required: true }
});

Role.register();