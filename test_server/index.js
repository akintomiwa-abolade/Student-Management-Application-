const cors = require('cors');
const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const error = require('../middlewares/error');
const expressValidator = require('express-validator');
const http = require('http');
const app = express();

require('dotenv').config();
app.use(cors());

// body parser middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// connect to database
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false', {useNewUrlParser:true,  useUnifiedTopology: true, useFindAndModify:false});
mongoose.Promise = global.Promise;
let db = mongoose.connection;

// check connection
db.once('open', function(){
	// console.log('Connected to mongo db');
});

// check for db errors
db.on('error', function(err){
	// console.log(err);
});

// Express Validtor Middleware
app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;

		while(namespace.length){
			formParam += '['+ namespace.shift() + ']';
		}
		return {
			param : formParam,
			msg : msg,
			value : value
		};
	}
}));

// api routes
let user = require('../routes/user');
let answer = require('../routes/answer');
let question = require('../routes/question');

app.use('/api/v1', user, answer, question);

module.exports = app;