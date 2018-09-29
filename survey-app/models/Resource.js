var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Resource Model
 * ==========
 */
var Resource = new keystone.List('Resource');

Resource.add({
    title: { type: Types.Text, initial: true, required: true },
    description: { type: Types.Textarea, initial: true, required: true },
    url: { type: Types.Url, initial: true, required: true }
});

Resource.register();