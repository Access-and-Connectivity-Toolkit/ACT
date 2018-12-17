const keystone = require('keystone');
const Types = keystone.Field.Types;

const Answer = new keystone.List('Answer');

Answer.add({
    userId: { type: Types.Relationship, ref: 'User', initial: true, required: true },
    surveyId: { type: Types.Relationship, ref: 'Survey',initial: true, required: true },
    questionId: { type: Types.Relationship, ref: 'Question', initial: true, required: true },
    answer: { type: Types.TextArray }
});

Answer.register();