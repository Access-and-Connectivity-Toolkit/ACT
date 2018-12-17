const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
const User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	assignedPath: {type: Types.Relationship, ref: 'ModulePath', many: false },
	team: { type: Types.Relationship, ref: 'Team' },
	location: {type: Types.Location, initial: true },
	phone: { type: Types.Text, initial: true }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});

User.relationship({ ref: 'Team', refPath: 'leader'});
User.relationship({ ref: 'Answer', refPath: 'userId'});


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
