const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger')

router.get('/', (req, res) => {
	const title = 'Hello Merchant';
	res.render('m_index', { title: title }) // renders views/index.handlebars
});

// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.get('/about', (req, res) => {

	let success_msg = 'Success message';
	let error_msg = 'Error message using error_msg';

	alertMessage(res, 'success',
		'This is an important message', 'fas fa-sign-in-alt', true);
	alertMessage(res, 'danger',
		'Unauthorised access', 'fas fa-exclamation-circle', false);

	var errorTexts = [
		{ text: "Error message using error object" },
		{ text: "First error message🙅‍♀️" },
		{ text: "Second error message 🚫" },
		{ text: "Third error message⛔" }
	];


	var dev_name = "🧐 Happy 脸😀"
	res.render('about', {
		developer_name: dev_name,
		success_msg: success_msg,
		error_msg: error_msg,
		errors: errorTexts
	}) // renders views/about.handlebars
});

router.get('/showLogin', (req, res) => {
	res.render('user/m_login') // renders views/user/login.handlebars
});

router.get('/showRegister', (req, res) => {
	res.render('user/m_register') // renders views/register.handlebars
});





module.exports = router;
