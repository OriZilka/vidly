require('express-async-errors');
require('winston-mongodb');
const { createLogger, format, transports } = require('winston');

const logger = (createLogger({
    format: format.combine(
        format.timestamp(),
        format.prettyPrint(),        
        format.colorize()
        // format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'uncaughtExeption.log'})
    ]
}));

module.exports = function () {    
    // *Better implementation if only needed to log to file*
    // One line that catches uncaught exceptions and writes only
    // to the log file and exit(1).
    
    // winston.add(new transports.Console({colorize: true, prettyPrint: true }), 
    //     new transports.File({ filename: 'uncaughtExeption.log', handleExceptions: true }));
    
    // catches uncaught exceptions and writes to log file and console.
    process.on('uncaughtException', (ex) => {
        logger.error(ex.message, { meta: ex.stack });
        setTimeout(() => {
            process.exit(1);
        }, 1000);
    });
    
    process.on('unhandledRejection', (ex) => {
        throw ex; // throwing this to the uncaughtException
                 // to handel unhandeled Promise rejections.
    });
}

module.exports.logger = logger;
