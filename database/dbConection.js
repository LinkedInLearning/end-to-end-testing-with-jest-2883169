const mongoose = require('mongoose');
require('dotenv').config();

// (process.NODE_ENV === 'test') ?
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
);
// :
// mongoose.connect(
// process.env.TEST_MONGODB_URI,
// { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
// );

module.exports = mongoose;
