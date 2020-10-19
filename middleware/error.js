// const winston = require('winston');
require('winston-mongodb');
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.prettyPrint(),
        format.colorize()
        // format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logfile.log'}),
        new transports.MongoDB({ 
            db: 'mongodb://localhost/vidly',
            level: 'info',
            options: { useUnifiedTopology: true },
            metaKey: 'meta'
        })
    ]
});

module.exports = function (err, req, res, next){
    logger.error(err.message, { meta: err.stack });
    res.status(500).send('Something failed.');
}

