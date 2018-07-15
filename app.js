const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
var methodOverride = require('method-override')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
var dateformat = require('helper-dateformat');

// Load User Model
require('./models/User');
require('./models/Story');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');
const {
  truncate,
  stripTags,
  editIcon
} = require('./helpers/hbs');

// Load Keys
const keys = require('./config/keys');

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose.connect(keys.mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// Handlebars Middleware
app.engine('handlebars', exphbs({
	helpers: {
    truncate: truncate,
    stripTags: stripTags,
    editIcon : editIcon,
    dateformat : dateformat
  },
  	defaultLayout:'main'
}));

app.set('view engine', 'handlebars');

app.use(methodOverride('_method'));

app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

// Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});