import { Server } from './core/server';
import config from '../config.json';
import { NOTFOUND } from './core/endpoint';
import Content from './controllers/Content';
import { join } from 'path';

// start api
(new Server(config.core.service.corsOptions))
  .mountStaticRoutes({
    '/images': join(__dirname, 'images')
  })
  .mountRoutes({
    '/content': {
      get: {
        '/:contentID/version/:clientVersion': Content.getContent
      },
      post: {
        '/:contentID': Content.setContent
      }
    }
  })
  .listen(config.core.service.port, NOTFOUND, () => console.log(`Listening on port ${config.core.service.port}..`));
