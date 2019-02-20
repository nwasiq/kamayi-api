var express    = require('express'),
	app        = express(),
	port       = process.env.PORT || 3000,
	mongoose   = require('mongoose'),
	passport   = require('passport'),
	User = require('./api/models/User'), //created model loading here
	bodyParser = require('body-parser');
const cors     = require('cors');
const path     = require('path');
const config   = require('./config/database');
mongoose.plugin(schema => {
	schema.options.usePushEach = true
});

require('./config/passport')(passport);

app.use(cors());

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(config.localDatabase, {useNewUrlParser: true});

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
	done(null, user._id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require('./api/routes'));

app.use(function (req, res) {
	res.status(404).send({url: req.originalUrl + ' not found'})
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.listen(port);

console.log('Kamayi api started at: ' + port);