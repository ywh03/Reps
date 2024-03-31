import winston from "winston"

const logger = winston.createLogger({
    format: winston.format.simple(),
    level: 'info',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

export default logger;