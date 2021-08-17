const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes/index.js');

const initializeApp = ()=>{

const app = express();

// add other middleware
app.use(cors());
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

app.use('/', routes);
return app;
}
const app = initializeApp();
module.exports = app;

