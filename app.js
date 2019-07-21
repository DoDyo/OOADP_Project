
const express = require('express');
const session = require('express-session');
const mainRoute = require('./routes/m_main');
const formRoute = require('./routes/form');
const userRoute = require('./routes/m_user');
const { formatDate, radioCheck } = require('./helpers/hbs');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const app = express();
const MySQLStore = require('express-mysql-session');
const db = require('./config/db'); // db.js config file
const flash = require('connect-flash');
const FlashMessenger = require('flash-messenger');
const passport = require('passport');

app.engine('handlebars', exphbs({
	helpers: {
		formatDate: formatDate,
		radioCheck: radioCheck
	},
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('__method'));
app.use(cookieParser());
// To store session information. By default it is stored as a cookie on browser
app.use(session({
	key: 'reference_session',
	secret: 'tojiv',
	store: new MySQLStore({
		host: db.host,
		port: 3306,
		user: db.username,
		password: db.password,
		database: db.database,
		clearExpired: true,
		// How frequently expired sessions will be cleared; milliseconds:
		checkExpirationInterval: 900000,
		// The maximum age of a valid session; milliseconds:
		expiration: 900000,
	}),

	resave: false,
	saveUninitialized: false,
}));

// Initilize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(FlashMessenger.middleware); // add this statement after flash()
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

app.use(methodOverride('_method'));










app.use('/', mainRoute);
app.use('/form', formRoute)
app.use('/user', userRoute);

const port = 5000;

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

// Bring in database connection
const formDB = require('./config/mDBConnection');
// Connects to MySQL database
formDB.setUpDB(false); // To set up database with new tables set (true)
const authenticate = require('./config/passport');
authenticate.localStrategy(passport);