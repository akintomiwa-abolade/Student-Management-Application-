const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const expressValidator = require('express-validator');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const http = require('http');

require('dotenv').config({ path: __dirname + '/.env' });
app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = http.createServer(app);


// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      ,root = namespace.shift()
      ,formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// swagger configuration
const swaggerDefinition = {
  info: {
    title: 'Student Management Application API',
    version: '1.0.0',
    description: 'Endpoints to test the routes',
  },
  host:'localhost:5000',
  basePath: '/',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./routes/api/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
let studentApi = require('./routes/api/student');

app.use('/api/v1', studentApi);

// set port
const port = process.env.PORT || 5000;

app.get('/', function(req, res) {
    res.status(200).json({status:"success", message:"Welcome to Student Management Application Backend."})
});

// start server
server.listen(port, async function () {
  console.log(`Server started on port ${port}...`);
});