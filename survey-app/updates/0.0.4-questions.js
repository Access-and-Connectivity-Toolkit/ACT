const keystone = require('keystone');
const Question = keystone.list('Question');
const Module = keystone.list('Module');

const fs = require('fs');

// Based off of suggested method to import models with relationships
// here: https://keystonejs.com/documentation/database/application-updates/

const MODULES_FOLDER = 'modules/';

const getQuestions = async () => {
	const files = fs.readdirSync(MODULES_FOLDER);
	const questions = [];

	for (let i = 0; i < files.length; i++) {
		const fileQuestions = JSON.parse(fs.readFileSync(MODULES_FOLDER + files[i], 'utf-8'));
		questions.push(...fileQuestions);
	}

	return questions;
};

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
};

exports = module.exports = async function (done) {
	const questions = await getQuestions();
    await questions.map(async (question) => await createQuestion(question, question.survey));
    done();
};
