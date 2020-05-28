import { Server } from '../../../../core/server';
import config from './config/config.json';
import errors from './config/errors.json';
import ContentController from './controllers/Content';
import ActivityWorker from './workers/Activity';

// start api
(new Server(config.service.id, config.service.name, errors, config.service.cors))
  .mountStaticRoutes({
    '/images': process.env.API_IMAGE_PATH
  })
  .mountRoutes({
    '/content': {
      get: {
        '/:contentID/version/:clientVersion': ContentController.getContent
      }
    }
  })
  .scheduleWorkers({
    60: [ActivityWorker.getLatest] // 1 hr
  })
  .scheduleBackups({
    1440: [config.service.database] // 24 hrs
  })
  .listen(config.service.port);
