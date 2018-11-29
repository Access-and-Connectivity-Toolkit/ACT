const keystone = require('keystone');

const Question = keystone.list('Question').model;
const Survey = keystone.list('Survey').model;

getSurveyId = async (surveyName) => {
    return await Survey.findOne({name: surveyName});
}

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res);
    const locals = res.locals;
    locals.section = 'about';

    getSurveyId('Test').then((surveyId) => {
        view.query('questions', Question.find({survey: surveyId}).sort({'name': 'asc'}));

        view.render('about');
    })

    view.on('post', () => {
        console.log(req.body);
        return res.redirect('back');
    });
};