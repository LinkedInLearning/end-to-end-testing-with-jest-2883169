const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes/index.js');

const app = express();

const config = {
  port: process.env.PORT || 8080,
};

// add other middleware
app.use(cors());
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/', routes);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log('Express server listening on port', config.port);
});
