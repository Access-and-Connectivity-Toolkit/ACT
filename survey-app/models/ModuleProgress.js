const keystone = require('keystone');
const Types = keystone.Field.Types;

const ModuleProgress = new keystone.List('ModuleProgress', {track: {updatedAt: true}});

ModuleProgress.add({
	userId: { type: Types.Relationship, ref: 'User', initial: true, required: true },
	moduleId: { type: Types.Relationship, ref: 'Module',initial: true, required: true },
	progress: { type: Types.Select, options: [{value: 'IN_PROGRESS', label: 'In Progress'}, {value: 'COMPLETE', label: 'Complete'}, {value: 'NOT_STARTED', label: 'Not Started'}]}, 
	percentage: { type: Types.Number }
});

ModuleProgress.register();
