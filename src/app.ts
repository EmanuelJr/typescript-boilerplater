import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import helmet from 'helmet';
import passport from 'passport';

import i18next from 'i18next';
import i18nextBackend from 'i18next-node-fs-backend';
import i18nextMiddleware from 'i18next-express-middleware';
import i18nextSprintf from 'i18next-sprintf-postprocessor';
import {
  createConnection,
} from 'typeorm';

import * as config from './config';
import log from './tools/logger';

import indexRouter from './routers/index';

const loadRouters = (app: express.Application): void => {
  const fileExt = '.ts';

  fs
    .readdirSync(path.join(__dirname, 'routers'))
    .filter(file => file.includes(fileExt))
    .map((file) => {
      const fileName = path.basename(file);
      const extPosition = fileName.lastIndexOf(fileExt);

      return fileName.slice(0, extPosition);
    })
    .forEach(async (file) => {
      const route = file === 'index' ? '/' : `/${file}`;
      const router = await import(path.join(__dirname, 'routers', file));

      app.use(route, router.default);
    });
};

const createApp = async (): Promise<express.Application> => {
  log.info('Connecting to Postgres');
  await createConnection({
    type: 'postgres',
    host: config.postgresHost,
    port: config.postgresPort,
    username: config.postgresUser,
    password: config.postgresPassword,
    database: config.postgresDatabase,
  });
  log.info('Connected to Postgres');

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({
    host: config.redisHost,
    port: config.redisPort,
    password: config.redisPassword,
  });

  const app = express();
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(session({
    name : 'sessionId',
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({ client: redisClient }),
  }));
  app.use('/public', express.static(path.join(__dirname, '../public')));
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'pug');

  // i18next setup
  i18next
    .use(i18nextBackend)
    .use(i18nextSprintf)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
      backend: {
        loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
      },
      preload: ['en', 'pt'],
      fallbackLng: 'en',
    });
  app.use(i18nextMiddleware.handle(i18next));

  // Passport setup
  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  // Passport strategies here

  // Routes setup
  app.use('/', indexRouter);

  return app;
};

export default createApp;
