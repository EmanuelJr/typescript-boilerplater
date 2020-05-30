import winston from 'winston';

import * as config from '../config';

const logger = winston.createLogger({
  level: config.logLevel,
  format: config.logFormat === 'json' ? winston.format.json() : winston.format.simple(),
  transports: [
    new winston.transports.Console(),
  ],
});

export default logger;
