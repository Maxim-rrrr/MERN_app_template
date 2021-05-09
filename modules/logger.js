import { createLogger, transports, format } from 'winston';
const { combine, timestamp, colorize, printf } = format;
import config from 'config';

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

require('winston-mongodb');
const logger = createLogger({
    transports: [
        new transports.Console({
            format: combine(
                timestamp(),
                colorize(),
                myFormat
            )
        }),
        new transports.File({
            filename: 'logs/logs.log',
            format: combine(
                timestamp(),
                myFormat
            )
        }),
        // new transports.MongoDB({
        //     db: config.get('mongoUrl'),
        //     options: {
        //         useUnifiedTopology: true
        //     },
        //     collection: 'log',
        //     format: combine(timestamp(), json())
        // })
    ]
})

export default logger