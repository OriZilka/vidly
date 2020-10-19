const express = require('express');
const app = express();
const { logger } = require('./startup/logging');

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

// throw new Error('Something failed during startup.');
// const p = Promise.reject(new Error('something failed miserably!'));
// p.then(() => console.log('Done'));

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));