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
	assignedModules: {type: Types.Relationship, ref: 'Module', many: true },
	team: { type: Types.Relationship, ref: 'Team' },
	role: { type: Types.Relationship, ref: 'Role'},
	affiliation: { type: Types.Text },
	lastLogin: { type: Types.Datetime , initial: true, default: Date.now(), parseFormat: 'Do MMM YYYY' }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});

User.relationship({ ref: 'Team', refPath: 'leader'});
User.relationship({ ref: 'Answer', refPath: 'userId'});
User.relationship({ ref: 'ModuleProgress', refPath: 'userId'});


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
