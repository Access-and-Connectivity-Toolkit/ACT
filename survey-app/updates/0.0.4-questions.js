const keystone = require('keystone');
const Question = keystone.list('Question');
const Module = keystone.list('Module');

// Based off of suggested method to import models with relationships
// here: https://keystonejs.com/documentation/database/application-updates/

const questions = [
    {
        name: 'Test Q1', 
        question:'What is broadband?',
        type: 'Checkboxes',
        answers: ['Internet', 'Food', 'Wires', 'Water'],
        survey: 'Test'
    },
    {
        name: 'Test Q2',
        question: 'What color is this page?',
        type: 'Radio',
        answers: ['Blue', 'White', 'All of the above'],
        survey: 'Test'
    },
    {
        name: 'Test Q3',
        question: 'How are you today?',
        type: 'Textarea',
        survey: 'Test'
    },
    {
        name: 'Test Q4',
        question: 'Did you like this survey?',
        type: 'Scale',
        survey: 'Test'
    },
    {
        name: 'Stuff 1',
        question: 'How important is broadband to you?',
        type: 'Scale',
        survey: 'Stuff',
        answers: ['Very', 'Not at all']
    },
    {
        name: 'Stuff 2',
        question: 'How often do you use the internet?',
        type: 'Scale',
        survey: 'Stuff',
        answers: ['Everyday', 'Never']
    }
];

const surveys = {};

const createQuestion = async (question, survey) => {
    let questionSurvey;
    if (surveys[survey]) {
        questionSurvey = surveys[survey];
    } else {
        questionSurvey = new Module.model({name: survey});
        surveys[survey] = questionSurvey;
        await questionSurvey.save();
    }

    const newQuestion = new Question.model(question);
    newQuestion.module = questionSurvey._id.toString();

    await newQuestion.save();
}

exports = module.exports = async function (done) {
    await questions.map(async (question) => await createQuestion(question, question.survey));
    done();
};