const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Resource Model
 * ==========
 */
const Resource = new keystone.List('Resource');

Resource.add({
    title: { type: Types.Text, initial: true, required: true },
    description: { type: Types.Textarea, initial: true, required: true },
    url: { type: Types.Url, initial: true, required: true }
});

Resource.register();