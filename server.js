const app = require("./index");
require("dotenv");
const config = {
    port: process.env.PORT || 8080,
  };
  
 const server = app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log('Express server listening on port', config.port);
  });
  module.exports = server;