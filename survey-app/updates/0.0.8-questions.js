const keystone = require('keystone');
const Question = keystone.list('Question');
const Module = keystone.list('Module');

const fs = require('fs');

// Based off of suggested method to import models with relationships
// here: https://keystonejs.com/documentation/database/application-updates/

const MODULES_FOLDER = 'modules/';

const getQuestionFiles = (path) => {
	// return new Promise((resolve, reject) => {
	// 	fs.readdir(path, (err, result) => {
	// 		if (err) {
	// 			reject(err);
	// 		} else {
	// 			resolve(result);
	// 		}
	// 	});
    // });
    return [
        'policyEnvironment.json',
        'rightsWay.json',
        'stakeholderEngagement.json',
        'usePublicAssets.json'
    ];
};

const getFileQuestions = (filePath) => {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, 'utf-8', (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(JSON.parse(result));
			}
		});
	});
};

const getQuestions = async () => {
	const files = await getQuestionFiles(MODULES_FOLDER);
	
	return Promise.all(files.map(async (file) => { 
		return await getFileQuestions(MODULES_FOLDER + file);
	})).then((questions) => {
		return [].concat(...questions);
	});
};

const surveys = {};

const createQuestion = async (question, survey) => {
    let questionSurvey;
    if (surveys[survey]) {
        questionSurvey = surveys[survey];
    } else {
        questionSurvey = new Module.model({name: survey, rank: 1});
        surveys[survey] = questionSurvey;
        await questionSurvey.save();
    }

    const newQuestion = new Question.model(question);
    newQuestion.module = questionSurvey._id.toString();

    // switch this to upsert -- maybe it would have been better to have this for each module
    await newQuestion.save();
};

exports = module.exports = async function (done) {
	const questions = await getQuestions();
    await questions.map(async (question) => await createQuestion(question, question.survey));
    done();
};
