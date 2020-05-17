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
  .mountWorkers({
    30: [ActivityWorker.getLatest] // 30 min
  })
  .listen(config.service.port, () => console.log(`${config.service.name}-${config.service.id} service running on port ${config.service.port}..`));
