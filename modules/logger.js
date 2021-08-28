import pkg from 'winston';
const { createLogger, transports, format } = pkg;

const { combine, timestamp, colorize, printf } = format;
import config from 'config';

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

import 'winston-mongodb';

let logger_transports_conf = []

if (config.get("logger_console")) {
    logger_transports_conf.push(new transports.Console({
            format: combine(
                timestamp(),
                colorize(),
                myFormat
            )
        })
    )
}

if (config.get("logger_file")) {
    logger_transports_conf.push(new transports.File({
        filename: 'logs/logs.log',
        format: combine(
            timestamp(),
            myFormat
        )
        })
    )
}

if (config.get("logger_mongoDB")) {
    logger_transports_conf.push(new transports.MongoDB({
        db: config.get('mongoUrl'),
        options: {
            useUnifiedTopology: true
        },
        collection: 'log',
        format: combine(timestamp(), json())
    })
    )
}


const logger = createLogger({
    transports: logger_transports_conf
})

export default logger