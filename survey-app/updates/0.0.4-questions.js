const keystone = require('keystone');
const Question = keystone.list('Question');
const Module = keystone.list('Module');

// Based off of suggested method to import models with relationships
// here: https://keystonejs.com/documentation/database/application-updates/

const questions = [
   {
	name: 'Motivation & Areas of Concern 1',
	question: 'What motivates you to work on this project? Do you have specific areas of concern? ',
	type: 'Textarea',
	survey: 'Community Priorities'
	},
	{
	name: 'Areas of Concern – scope 1',
	question: 'What are the areas of concern in your community?   Please check all that apply: ',
	type: 'Checkboxes',
	answers: ['Broadband service is not available in all or parts of our community.', 'Broadband service quality is poor or unreliable.', 'We have middle mile problems. Traffic into our community is throttled.', 'Broadband service is too expensive for the services offered.', 'People who need broadband cannot afford the services they need.', 'We need better broadband to support our schools.', 'We have a homework gap.  Our kids need access to the Internet at home.', 'We need better broadband to help residents access government services.', 'We need better broadband for healthcare or health services.', 'Our workforce needs more digital skills.', 'Without better broadband, we can_t retain and attract younger people to the area.', 'We need better broadband to attract businesses and drive economic development.', 'People need broadband to work at home or to run family businesses.', 'We are innovators. We need better connectivity to support and drive innovation.', 'Lack of digital access/skills is creating an opportunity gap. We need to work on inclusion and equity.', 'I don_t know.'],
	survey: 'Community Priorities'
	},
	{
	name: 'Community vision & goals 1',
	question: 'Please describe your community vision/goals and note how improved broadband would support those goals.',
	type: 'Textarea',
	survey: 'Community Priorities'
	},
// 	{
// 	name: 'Community priorities – rating 1',
// 	question: 'Of the following community purposes, please note the importance',
// 	type: 'Info',
// 	survey: 'Community Priorities'
// 	},
	{
	name: 'Community priorities – rating 2',
	question: 'Government services',
	type: 'Scale',
	answers: ['Low', 'High'],
	survey: 'Community Priorities'
	},
	{
	name: 'Community priorities – rating 3',
	question: 'Citizen engagement',
	type: 'Scale',
	answers: ['Low', 'High'],
	survey: 'Community Priorities'
	},
	{
	name: 'Community priorities – rating 4',
	question: 'Economic development and innovation',
	type: 'Scale',
	answers: ['Low', 'High'],
	survey: 'Community Priorities'
	},
	{
	name: 'Community priorities – rating 5',
	question: 'Education and continuous learning',
	type: 'Scale',
	answers: ['Low', 'High'],
	survey: 'Community Priorities'
	},
	{
	name: 'Community priorities – rating 6',
	question: 'Health and wellness',
	type: 'Scale',
	answers: ['Low', 'High'],
	survey: 'Community Priorities'
	},
	{
	name: 'Community priorities – rating 7',
	question: 'Energy and the environment',
	type: 'Scale',
	answers: ['Low', 'High'],
	survey: 'Community Priorities'
	},
	{
	name: 'Community priorities – rating 8',
	question: 'Transportation',
	type: 'Scale',
	answers: ['Low', 'High'],
	survey: 'Community Priorities'
	},
	{
	name: 'Community priorities – rating 9',
	question: 'Public safety',
	type: 'Scale',
	answers: ['Low', 'High'],
	survey: 'Community Priorities'
	},
	{
	name: 'Community priorities – rating 10',
	question: 'Arts and culture',
	type: 'Scale',
	answers: ['Low', 'High'],
	survey: 'Community Priorities'
	},
	{
	name: 'Community priorities – rating 11',
	question: 'Community sustainability and improvement',
	type: 'Scale',
	answers: ['Low', 'High'],
	survey: 'Community Priorities'
	},
	{
	name: 'Community priorities – rating 12',
	question: 'Internet of things & smart devices (e.g., roads, energy, safety)',
	type: 'Scale',
	answers: ['Low', 'High'],
	survey: 'Community Priorities'
	},
	{
	name: 'Community priorities – rating 13',
	question: 'Other priorities',
	type: 'Textarea',
	survey: 'Community Priorities'
	},
// 	{
// 	name: 'Community priorities – rating ',
// 	question: 'State and national data on broadband use: 	You can learn more about how people generally use the Internet by using the Data Explorer from NTIA Computer and Internet Survey which includes detailed responses from over 100,000 people on devices, Internet, applications, and concerns. https://www.ntia.doc.gov/data/digital-nation-data-explorer#sel=internetUser&disp=map https://www.ntia.doc.gov/category/data-central',
// 	type: 'Info',
// 	survey: ''
// 	},
	{
	name: 'In your community 1',
	question: 'Do you have additional comments about the relationship between broadband goals and broader community goals?',
	type: 'Textarea',
	survey: 'Community Priorities'
	},
	{
	name: 'In your community 17',
	question: 'How important is broadband compared with other priorities in your community?',
	type: 'Scale',
	answers: ['Not Really','Important'],
	survey: 'Community Priorities'
	},
	{
	name: 'In your community 18',
	question: 'Links to local resources - names and/or web addresses',
	type: 'Textarea',
	survey: 'Community Priorities'
	},
	{
	name: 'Leadership 19',
	question: 'Are there one or more broadband champions active in your community?',
	type: 'Scale',
	answers: ['Not Really','Definitely'],
	survey: 'Community Priorities'
	},
	{
	name: 'Leadership 20',
	question: 'Who are your broadband leaders?',
	type: 'Textarea',
	survey: 'Community Priorities'
	},
	{
	name: 'Broadband planning team 21',
	question: 'Does your community have a formal or informal broadband planning team?',
	type: 'Scale',
	answers: ['No','We have a representative team that meets regularly'],
	survey: 'Community Priorities'
	},
	{
	name: 'Broadband planning team 22',
	question: 'Does your community have a broadband plan?  ',
	type: 'Scale',
	answers: ['No','We have a documented plan, updated regularly'],
	survey: 'Community Priorities'
	},
	{
	name: 'Broadband planning team 23',
	question: 'If your broadband planning team has a website or if the broadband plan is available online, please provide links. ',
	type: 'Textarea',
	survey: 'Community Priorities'
	},
	{
	name: 'Stakeholder identification 24',
	question: 'Have you identified broadband stakeholders? Please check all that apply: ',
	type: 'Checkboxes',
	answers: ['We have a list of stakeholders.', 'The list of stakeholders includes representatives from a broad cross-section of our community.', 'We_ve considered partnerships with businesses or nonprofits.', 'We_ve considered the interests of the stakeholders.', 'The list of includes both advocates and naysayers.', 'I don_t know.'],
	survey: 'Community Priorities'
	},
	{
	name: 'Stakeholder Outreach 25',
	question: 'Have you contacted the stakeholders?   Please check all that apply: ',
	type: 'Checkboxes',
	answers: ['We_ve contacted many of the stakeholders on our list.', 'We have a formal plan or program to engage stakeholders.', 'We engage with stakeholders informally.', 'We have an advisory group that provides insight and direction on broadband projects.', 'Our meetings are open to the public.', 'Planning documents and meeting notes are publicly-available.', 'Stakeholder feedback is documented.', 'Project plans are regularly adjusted to reflect input from stakeholders.', 'Our stakeholder plan includes engagement with people who have concerns or who may be critical of our efforts.', 'Stakeholder engagement activities are appropriate to each audience.', 'We_ve identified potential project partners (e.g. local businesses or nonprofits).', 'Public-private partnerships are part of our broadband plan.', 'I don_t know.'],
	survey: 'Community Priorities'
	},
	{
	name: 'Stakeholder Outreach 26',
	question: 'If you see potential for greater stakeholder engagement over the next one to two years, please comment on what you would like to see. Are there more people who should be included?  Please describe: ',
	type: 'Textarea',
	survey: 'Community Priorities'
	},
	{
	name: 'Needs Assessment 27',
	question: 'Have you asked community members about their connectivity needs and interests? Please check all that apply: ',
	type: 'Checkboxes',
	answers: ['We informally discuss input from residents and businesses.', 'We have a formal process to gather input from residents.', 'We have a formal process to gather input from business owners, entrepreneurs, and business organizations.', 'We have a formal process to gather input from community anchor institutions and nonprofit organizations.', 'We solicit community input as part of our franchise renewal process and carrier negotiations.', 'We_ve conducted community surveys or meetings to discuss community connectivity.', 'We issue public reports that summarize the connectivity needs and issues expressed in community surveys or forums.', 'I don_t know.'],
	survey: 'Community Priorities'
	},
	{
	name: 'Service provider engagement 28',
	question: 'Do you engage with service providers to understand their plans? Please check all that apply: ',
	type: 'Checkboxes',
	answers: ['We know the service providers that operate in our community.', 'We cultivate relationships with providers.', 'We tell providers what we need, i.e., needs of residents and businesses', 'We understand the deployment plans of providers operating in our community.', 'Our government leaders manage contracts to ensure that agreements serve the public interest.', 'I don_t know.'],
	survey: 'Community Priorities'
	},
	{
	name: 'Community Priorities - near-term goals 29',
	question: 'What changes would you like to see in the next one to two years in the way your community works to improve broadband?  What leadership changes are needed to strengthen broadband in your community? How can you better engage stakeholders, partners, and providers?',
	type: 'Textarea',
	survey: 'Community Priorities'
	},
	{
	name: 'Community Priorities - near-term goals 30',
	question: 'Links to other resources you_d like to include in your plan. ',
	type: 'Textarea',
	survey: 'Community Priorities'
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
