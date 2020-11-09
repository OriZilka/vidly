const mongoose = require('mongoose');
const { logger } = require('./logging');
const config = require('config');


module.exports = function() {
    const db = config.get('db');
    mongoose.connect(db, 
    {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true })
        // .then(() => console.log('Connected to MongoDB...'))
        // .catch(err => console.error('Could not connect to MongoDB...')); 
        .then(() => {     
            logger.info(`Connected to ${db}...`);
        });
        // winston.info('Connected to MongoDB...'));    
}