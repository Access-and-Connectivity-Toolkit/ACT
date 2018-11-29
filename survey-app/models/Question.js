const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Question Model
 * ==========
 */
const Question = new keystone.List('Question');

Question.add({
    name: { type: Types.Text, initial: true, required: true},
    title: { type: Types.Text, initial: true, required: true },
    type: { type: Types.Select, options:['Checkboxes', 'Radio', 'Textarea', 'Scale'], default:'Radio', intial: true, required: true },
    survey: { type: Types.Relationship, ref: 'Survey'},
    answers: { type: Types.TextArray }
});

Question.register();