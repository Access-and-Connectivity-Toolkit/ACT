const keystone = require('keystone');

const ModulePath = new keystone.List('ModulePath', {
	autokey: { from: 'name', path: 'key', unique: true },
	label: 'Pathways',
});

ModulePath.add({
	name: { type: String, required: true },
});

ModulePath.relationship({ ref: 'Module', refPath: 'pathways' });
ModulePath.relationship({ ref: 'User', refPath: 'assignedPath'});

ModulePath.track = true;
ModulePath.register();