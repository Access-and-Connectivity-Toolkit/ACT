var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Team Model
 * ==========
 */
var Team = new keystone.List('Team');

Team.add({
    name: { type: Types.Text, initial: true, required: true },
    state: { type: Types.Select, options:['Oregon', 'Washington'], default: 'Washington', initial: true, required: true },
    leader: { type: Types.Relationship, ref: 'User', many: false, initial: true,  required: true }
});

Team.relationship({ ref: 'User', refPath: 'team'});

Team.register();