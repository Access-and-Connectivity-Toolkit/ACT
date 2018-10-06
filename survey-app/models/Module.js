var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Module Model
 * ==========
 */
var Module = new keystone.List('Module');

Module.add({
    name: { type: Types.Text, initial: true, required: true },
    url: { type: Types.Url, initial: true, required: true },
    pathways: { type: Types.Relationship, ref: 'ModulePath', initial: true, required: true, many: true },
    index: {type: Types.Number, initial: true, required: true, unique: true, index: true}
});

Module.register();