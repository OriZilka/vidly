const mongoose = require('mongoose');
const { logger } = require('./logging');


module.exports = function() {
    mongoose.connect('mongodb://localhost/vidly', 
    {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true })
        // .then(() => console.log('Connected to MongoDB...'))
        // .catch(err => console.error('Could not connect to MongoDB...')); 
        .then(() => {     
            logger.info('Connected to MongoDB...');
        });
        // winston.info('Connected to MongoDB...'));    
}