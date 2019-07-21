// const express = require('express');
// const router = express.Router();
// const User = require('../models/M_User');
// const alertMessage = require('../helpers/messenger');
// var bcrypt = require('bcryptjs');
// const passport = require('passport');
// // SendGrid
// const sgMail = require('@sendgrid/mail');
// // JWT
// const jwt = require('jsonwebtoken');


// // Login Form POST => /user/login
// router.post('/login', (req, res, next) => {
//     passport.authenticate('local', {
//         successRedirect: '/form/showsendForm', // Route to /video/listVideos URL
//         failureRedirect: '/showLogin', // Route to /login URL
//         failureFlash: true
//         /* Setting the failureFlash option to true instructs Passport to flash an error
//         message using the message given by the strategy's verify callback, if any.
//         When a failure occur passport passes the message object as error */
//     })(req, res, next);
// });


// // User register URL using HTTP post => /user/register
// router.post('/m_register', (req, res) => {

//     let errors = [];
//     // Retrieves fields from register page from request body
//     let { name, email, password, password2 } = req.body;

//     // Checks if both passwords entered are the same
//     if (password !== password2) {
//         errors.push({ text: 'Passwords do not match' });
//     }

//     // Checks that password length is more than 4
//     if (password.length < 4) {
//         errors.push({ text: 'Password must be at least 4 characters' });
//     }
//     if (errors.length > 0) {
//         res.render('user/m_register', {
//             errors,
//             name,
//             email,
//             password,
//             password2
//         });
//     } else {
//         // If all is well, checks if user is already registered
//         User.findOne({ where: { email: req.body.email } })
//             .then(user => {
//                 if (user) {
//                     // If user is found, that means email has already been
//                     // registered
//                     res.render('user/m_register', {
//                         error: user.email + ' already registered',
//                         name,
//                         email,
//                         password,
//                         password2
//                     });
//                 } else {

//                     // Generate JWT token
//                     let token;
//                     jwt.sign(email, 's3cr3Tk3y', (err, jwtoken) => {
//                         if (err) console.log('Error generating Token: ' + err);
//                         token = jwtoken;
//                     });
//                     // Encrypt the password
//                     var salt = bcrypt.genSaltSync(10);
//                     var hashedPassword = bcrypt.hashSync(password, salt);
//                     password = hashedPassword;

//                     // Create new user record
//                     User.create({
//                         name,
//                         email,
//                         password,
//                         verified: 0,
//                     })
//                         .then(user => {
//                             sendEmail(user.id, user.email, token)
//                                 .then(msg => {
//                                     alertMessage(res, 'success', user.name + ' added. Please login' + user.email + 'to verify account', 'fas fa-sign-in-alt', true);
//                                     res.redirect('/showLogin');
//                                 }).catch(err => {
//                                     alertMessage(res, 'warning', 'Error sending to' + user.email, 'fas fa-sign-in-alt', true);
//                                     res.redirect('/');
//                                 });
//                         }).catch(err => console.log(err));
//                 }
//             });
//     }
// });

// function sendEmail(userId, email, token) {
//     sgMail.setApiKey(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);

//     const message = {
//         to: email,
//         from: 'Do Not Reply <admin@video-jotter.sg>',
//         subject: 'Verify Video Jotter Account',
//         text: 'Video Jotter Email Verification',
//         html: `Thank you registering with Video Jotter.<br><br>
//             Please <a href="http://localhost:5000/user/verify/${userId}/${token}">
//                 <strong>verify</strong></a>your account.`
//     };
//     // Returns the promise from SendGrid to the calling function
//     return new Promise((resolve, reject) => {
//         sgMail.send(message)
//             .then(msg => resolve(msg))
//             .catch(err => reject(err));
//     });
// }

// router.get('/verify/:userId/:token', (req, res, next) => {
//     // retrieve from user using id
//     User.findOne({
//         where: {
//             id: req.params.userId
//         }
//     }).then((user) => {
//         if (user) { // If user is found
//             let userEmail = user.email; // Store email in temporary variable
//             if (user.verified === true) { // Checks if user has been verified
//                 alertMessage(res, 'info', 'User already verified', 'fas fa-exclamation-circle', true);
//                 res.redirect('/showLogin');
//             } else {
//                 // Verify JWT token sent via URL
//                 jwt.verify(req.params.token, 's3cr3Tk3y', (err, authData) => {
//                     if (err) {
//                         alertMessage(res, 'danger', 'Unauthorised Access', 'fas fa-exclamation-circle', true);
//                         res.redirect('/');
//                     } else {
//                         User.update({ verified: 1 }, {
//                             where: { id: user.id }
//                         }).then(user => {
//                             alertMessage(res, 'success', userEmail + ' verified.Please login', 'fas fa - sign -in -alt', true);
//                             res.redirect('/showLogin');
//                         });
//                     }
//                 });
//             }}}
//             );
//         });
        


// router.post('/m_register', (req, res) => {
//     req.logout();
//     res.redirect('/');
// });

// router.get('/', (req, res) => {
//     const title = 'I\'m at the user router!';
//     res.render('m_index', { title: title }) // renders views/index.handlebars
// });


//             module.exports = router;

// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const feedback = require('../models/feedback');
// const alertMessage = require('../helpers/messenger');
// var bcrypt = require('bcryptjs');
// //const passport = require('passport');


// // Login Form POST => /user/login
// router.post('/login', (req, res, next) => {
//     passport.authenticate('local', {
//         successRedirect: '../home', // Route to /video/listVideos URL
//         failureRedirect: '/cLogin', // Route to /login URL
//         failureFlash: true
//         /* Setting the failureFlash option to true instructs Passport to flash an error
//         message using the message given by the strategy's verify callback, if any.
//         When a failure occur passport passes the message object as error */
//     })(req, res, next);
// });


// // User register URL using HTTP post => /user/register
// router.post('/cregister', (req, res) => {

//     let errors = [];
//     // Retrieves fields from register page from request body
//     let { name, gender, email,password, password2 } = req.body;

//     // Checks if both passwords entered are the same
//     if (password !== password2) {
//         errors.push({ text: 'Passwords do not match' });
//     }

//     // Checks that password length is more than 4
//     if (password.length < 4) {
//         errors.push({ text: 'Password must be at least 4 characters' });
//     }
//     if (errors.length > 0) {
//         res.render('cuser/cregister', {
//             errors,
//             name,
//             email,
//             gender,
//             password,
//             password2
//         });
//     } else {
//         // If all is well, checks if user is already registered
//         User.findOne({ where: { email: req.body.email } })
//             .then(user => {
//                 if (user) {
//                     // If user is found, that means email has already been
//                     // registered
//                     res.render('cuser/cregister', {
//                         error: user.email + ' already registered',
//                         name,
//                         email,
//                         gender,
//                         password,
//                         password2
//                     });
//                 } else {
//                     // Encrypt the password
//                     var salt = bcrypt.genSaltSync(10);
//                     var hashedPassword = bcrypt.hashSync(password, salt);
//                     password = hashedPassword;

//                     // Create new user record
//                     User.create({ name, email,gender, password })
//                         .then(user => {
//                             alertMessage(res, 'success', user.name + ' added. Please login', 'fas fa-sign-in-alt', true);
//                             res.redirect('/cLogin');
//                         })
//                         .catch(err => console.log(err));
//                 }
//             });
//     }
// });


// router.post('/cregister', (req, res) => {
//     req.logout();
//     res.redirect('/');
// });

// router.get('/', (req, res) => {
//     const title = 'I\'m at the user router!';
//     res.render('index', { title: title }) // renders views/index.handlebars
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/M_User');
const alertMessage = require('../helpers/messenger');
var bcrypt = require('bcryptjs');
const passport = require('passport');


// Login Form POST => /user/login
router.post('/m_login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/form/saveForm', // Route to /video/listVideos URL
        failureRedirect: '/showLogin', // Route to /login URL
        failureFlash: true
        /* Setting the failureFlash option to true instructs Passport to flash an error
        message using the message given by the strategy's verify callback, if any.
        When a failure occur passport passes the message object as error */
    })(req, res, next);
});


// User register URL using HTTP post => /user/register
router.post('/m_register', (req, res) => {

    let errors = [];
    // Retrieves fields from register page from request body
    let { name, email, password, password2 } = req.body;

    // Checks if both passwords entered are the same
    if (password !== password2) {
        errors.push({ text: 'Passwords do not match' });
    }

    // Checks that password length is more than 4
    if (password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters' });
    };
    if (errors.length > 0) {
        res.render('user/m_register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // If all is well, checks if user is already registered
        User.findOne({ where: { email: req.body.email } })
            .then(user => {
                if (user) {
                    // If user is found, that means email has already been
                    // registered
                    res.render('user/m_register', {
                        error: user.email + ' already registered',
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    // Encrypt the password
                    var salt = bcrypt.genSaltSync(10);
                    var hashedPassword = bcrypt.hashSync(password, salt);
                    password = hashedPassword;

                    // Create new user record
                    User.create({ name, email, password })
                        .then(user => {
                            alertMessage(res, 'success', user.name + ' added. Please login', 'fas fa-sign-in-alt', true);
                            res.redirect('/showLogin');
                        })
                        .catch(err => console.log(err));
                }
            });
    }
});


router.post('/m_register', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/', (req, res) => {
    const title = 'I\'m at the user router!';
    res.render('index', { title: title }) // renders views/index.handlebars
});

module.exports = router;