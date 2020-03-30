import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { json, text, urlencoded } from 'body-parser';
import { Endpoint, IEndpoint } from './endpoint';
import config from '../../config.json';

const apiPath: string = config.service.path;


/**
 * Server class
 */
export class Server {
  methods: Array<string>;
  express: any;
  cors: any;

  /**
   * Creates server
   * @param {any} options the server options
   */
  constructor(options: any = {}) {
    this.methods = options.methods.split(',').map((x: string) => x.toLowerCase());
    this.express = express();

    this.cors = options;
    this.express.use(cors(this.cors));

    // parse application/x-www-form-urlencoded
    this.express.use(urlencoded({ extended: false }))

    // parse application/json
    this.express.use(json())
    this.express.use(text())

    // cookie parser
    this.express.use(cookieParser());

    // cors
    if (options.origin) {
      options.origin = RegExp(options.origin);
    }
    
    this.express.options('*', cors(this.cors));
  }

  /**
   * Mounts server routes
   * @param {Array<any>} routesObj the routes object
   * @returns {this} server instance
   */
  mountRoutes(routesObj: any) {
    Object.keys(routesObj).forEach((routeBase: string) => {
      const router: any = express.Router();
      this.methods.forEach((method: string) => {
        if (routesObj[routeBase][method]) {
          Object.keys(routesObj[routeBase][method]).forEach((routeEnd: string) => {
            router[method](routeEnd, cors(this.cors), (new Endpoint(method, routesObj[routeBase][method][routeEnd]).endpoint));
          });
        }
      });
      this.express.use(`${apiPath}${routeBase}`, router);
    });
    return this;
  }

  /**
   * Mounts server static routes
   * @param {Array<any>} staticRoutesObj the static routes object
   * @returns {this} server instance
   */
  mountStaticRoutes(staticRoutesObj: any) {
    Object.keys(staticRoutesObj).forEach((routeBase: string) => {
      this.express.use(routeBase, express.static(staticRoutesObj[routeBase]));
    });
    return this;
  }

  /**
   * Starts server
   * @param {number} port port number
   * @param {Function} routeErrorCallback the route error callback
   * @param {Function} listeningListener the onListen callback
   * @returns {this} server instance
   */
  listen(port: number, routeErrorCallback: IEndpoint, listeningListener: Function) {
    // handle unknown routes
    if (routeErrorCallback) {
      this.express.get('*', routeErrorCallback);
    }
    // start listening
    this.express.listen(port, listeningListener);
    return this;
  }
};