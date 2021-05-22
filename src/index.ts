import { Server } from '@alipianu/microservice-core';
import config from './config/config.json';
import errors from './config/errors.json';
import ContentController from './controllers/Content';
import ActivityWorker from './workers/Activity';
import { __API_IMAGE_PATH__, __API_ID__, __API_PORT__ } from './constants';

// start api
(new Server(__API_ID__, config.service.name, errors, config.service.cors))
  .mountStaticRoutes({
    '/images': __API_IMAGE_PATH__
  })
  .mountRoutes({
    '/content': {
      get: {
        '/:contentID/version/:clientVersion': ContentController.getContent
      }
    }
  })
  .scheduleWorkers({
    720: [ActivityWorker.getLatest] // 12 hr = 60 min * 12
  })
  .scheduleBackups({
    10080: [config.service.database] // 1 week = 60 min * 24 * 7
  })
  .listen(__API_PORT__);
