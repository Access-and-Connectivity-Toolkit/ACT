const keystone = require('keystone');

const Question = keystone.list('Question').model;
const Survey = keystone.list('Survey').model;
const Answer = keystone.list('Answer').model;

getSurveyId = async (surveyName) => {
    return await Survey.findOne({name: surveyName});
}

getUserAnswers = async (surveyId) => {
    return await Answer.find(
        {$and: [
            {surveyId: surveyId},
            {userId: req.user._id}
        ]}
    );
}

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res);
    const locals = res.locals;
    locals.section = 'about';

    getSurveyId('Test').then((surveyId) => {
        view.query('questions', Question.find({survey: surveyId}).sort({'name': 'asc'}));
<<<<<<< HEAD
=======

        // view.query('userAnswers', Answer.find({$and: [
        //     {surveyId: surveyId},
        //     {userId: req.user._id}
        // ]}));
        // const ans = await getUserAnswers(surveyId);

>>>>>>> add saving users answers to module
        view.render('about');
    });

    view.on('post', async () => {
        console.log(req.body);

        await getSurveyId('Test').then((surveyId) => {
            for (const question in req.body) {
                const answer = req.body[question];

                // Need to handle editing answers...

                // Textareas can submit empty strings
                if (answer) {
                    const newAnswer = new Answer({
                        userId: req.user._id,
                        questionId: question,
                        surveyId:surveyId,
                        answer: answer
                    });
        
                    newAnswer.save((err) => {
                        if (err) {
                            console.log('failed');
                            console.log(err);
                        } else {
                            console.log('worked..?');
                        }
                    });
                }
            }
    
            return res.redirect('back');
        });
    });
};
