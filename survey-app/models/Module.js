const keystone = require('keystone');

const Module = new keystone.List('Module', {
	autokey: { from: 'name', path: 'key', unique: true },
	label: 'Modules',
});

Module.add({
	name: { type: String, required: true },
	rank: { type: Number, required: true, initial: true}
});

Module.relationship({ ref: 'Question', refPath: 'module' });
Module.relationship({ ref: 'Answer', refPath: 'moduleId'});
Module.relationship({ ref: 'ModuleProgress', refPath: 'moduleId'});
Module.relationship({ ref: 'User', refPath: 'assignedModules'});

Module.register();
