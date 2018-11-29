const keystone = require('keystone');
const Question = keystone.list('Question');
const Survey = keystone.list('Survey');

// Based off of suggested method to import models with relationships
// here: https://keystonejs.com/documentation/database/application-updates/

const questions = [
    {
        name: 'Test Q1', 
        title:'What is broadband?',
        type: 'Checkboxes',
        answers: ['Internet', 'Food', 'Wires', 'Water'],
        survey: 'Test'
    },
    {
        name: 'Test Q2',
        title: 'Why can\'t I stop sneezing?',
        type: 'Radio',
        answers: ['I have a cold', 'I am allergic to myself', 'All of the above'],
        survey: 'Test'
    },
    {
        name: 'Test Q3',
        title: 'How are you today?',
        type: 'Textarea',
        survey: 'Test'
    },
    {
        name: 'Test Q4',
        title: 'Did you like this survey?',
        type: 'Scale',
        survey: 'Test'
    }
];

const surveys = {};

const createQuestion = async (question, survey) => {
    let questionSurvey;
    if (surveys[survey]) {
        questionSurvey = surveys[survey];
    } else {
        questionSurvey = new Survey.model({name: survey});
        surveys[survey] = questionSurvey;
        await questionSurvey.save();
    }

    const newQuestion = new Question.model(question);
    newQuestion.survey = questionSurvey._id.toString();

    await newQuestion.save();
}

exports = module.exports = async function (done) {
    await questions.map(async (question) => await createQuestion(question, question.survey));
    done();
};