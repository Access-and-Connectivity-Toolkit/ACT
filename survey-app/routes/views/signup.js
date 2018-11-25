var keystone = require('keystone');
var User = keystone.list('User').model;

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.success = false;

    var newUser = new User({
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
        isAdmin: false
    });

    newUser.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            locals.success = true;

            var onSuccess = function() {
                res.redirect('/home');
            }
    
            var onFail = function() {
                console.log(err);
                res.redirect('/');
            }

            keystone.session.signin({
                email: req.body.email, 
                password: req.body.password
            }, req, res, onSuccess, onFail);
        }

        // view.render('signup');
    });
};