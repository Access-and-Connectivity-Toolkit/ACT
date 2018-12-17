const keystone = require('keystone');

const Survey = new keystone.List('Survey', {
	autokey: { from: 'name', path: 'key', unique: true },
	label: 'Surveys',
});

Survey.add({
	name: { type: String, required: true },
});

Survey.relationship({ ref: 'Question', refPath: 'survey' });
Survey.relationship({ ref: 'Answer', refPath: 'surveyId'});

Survey.track = true;
Survey.register();