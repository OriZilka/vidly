const express = require('express');
const app = express();
const { logger } = require('./startup/logging');

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

// throw new Error('Something failed during startup.');
// const p = Promise.reject(new Error('something failed miserably!'));
// p.then(() => console.log('Done'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => logger.info(`Listening on port ${port}...`));

module.exports = server;