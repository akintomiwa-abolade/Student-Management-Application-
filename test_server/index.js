const cors = require('cors');
const express = require('express');
const expressValidator = require('express-validator');
const app = express();

require('dotenv').config();
app.use(cors());

// body parser middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());


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
let student = require('../routes/api/student');

app.use('/api/v1', student);

module.exports = app;