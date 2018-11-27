const keystone = require('keystone');
const Types = keystone.Field.Types;

const Role = new keystone.List('Role');

Role.add({
    name: { type: Types.Text, initial: true, required: true }
});

Role.register();