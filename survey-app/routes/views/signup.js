const keystone = require('keystone');
const User = keystone.list('User').model;

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res);
    const locals = res.locals;

    // Should have set team in the join step, so send user back
    if (!req.query.team && !req.body.team) {
        res.redirect('join');
        return;
    }

    locals.team = req.query.team;
    locals.validationErrors = {};

    // Get formData from request, if this request is from a previously
    // failed registration, get formData from the session
    locals.formData = req.body || {};
    if (req.session.formData) {
        locals.formData = req.session.formData;
    }
    if (req.body) {
        req.session.formData = req.body;
    }

    const onFail = (message) => {
        req.flash('error', message);
        return res.redirect('back');
    }

    function checkExistingEmail() {
        return new Promise((resolve, reject) => {
            keystone.list('User').model.findOne({email: req.body.email}, (err, user) => {
                if (err) {
                    console.log(err);
                }

                if (user) {
                    reject('An account already exists for that email');
                }

                resolve();
            });
        });
    }

    function findTeam() {
        console.log('here??');
        return new Promise((resolve, reject) => {
            keystone.list('Team').model.findOne({name: req.body.team}, (err, team) => {
                if (err) {
                    reject(err);
                }

                if (!team) {
                    reject('Team not found');
                }

                resolve(team);
            });
        });
    }

    view.on('post', () => {
        if (req.body.password !== req.body.confirm) {
            // Clear these since user won't be able to see which is wrong
            req.session.formData.password = null;
            req.session.formData.confirm = null;

            onFail('Passwords don\'t match');
        } else {
            checkExistingEmail().then(() => findTeam()) 
            .then((team) => {
                const newUser = new User({
                    name: {first: req.body.first, last: req.body.last},
                    password: req.body.password,
                    email: req.body.email,
                    phone: req.body.phone,
                    location: {
                        street1: req.body.st_address,
                        postcode: req.body.zip,
                        state: req.body.state,
                        suburb: req.body.city,
                        country: 'USA'
                    },
                    team: team._id,
                    isAdmin: false
                });
    
                newUser.save((err) => {
                    if (err) {
                        console.log('signin issues??');
                        onFail(err);
                    } else {
                        const onSuccess = () => {
                            res.redirect('/home');
                        }
    
                        keystone.session.signin({
                            email: req.body.email, 
                            password: req.body.password
                        }, req, res, onSuccess, onFail);
    
                        // Don't need this anymore, shouldn't keep it
                        req.session.formData = null;
                    }
                });
            }).catch((err) => {
                onFail(err);
            });
        }
    });

    view.render('signup');
};