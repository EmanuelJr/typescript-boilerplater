import 'reflect-metadata';

import * as config from './config';
import createApp from './app';
import log from './tools/logger';

(async (): Promise<void> => {
  const app = await createApp();
  app.listen(config.port, () => {
    log.info(`App is running at http://localhost:${config.port}`);
  });
})();
