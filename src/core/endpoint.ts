import { Request, Response } from 'express';
import config from '../../config.json';
import responseErrors from './errors.json';
import statuses from './statuses.json';

/**
 * Responds with an error
 */
export const __ERROR__ = (error: string, status: string) => {
  // @ts-ignore
  throw {error: (error || "0000"), status: (statuses[status] || statuses["FATAL"])}
}

/**
 * Error interface
 */
interface IError {
  name: string;
  description: string;
};


/**
 * Generic controller interface (not bound to endpoint model)
 */
export interface IEndpoint {
  (req: Request, res: Response): void;
};

/**
 * POST controller interface
 */
export interface IPostEndpoint {
  (this: Endpoint, body?: Record<string, string>, query?: Record<string, string>): void;
}

/**
 * GET controller interface
 */
export interface IGetEndpoint {
  (this: Endpoint, params?: Record<string, string>, query?: Record<string, string>): void;
}

/**
 * Controller for path mismatch
 */
export const NOTFOUND: IEndpoint = () => __ERROR__("0001", "NOTFOUND");

/**
 * Endpoint model
 */
export class Endpoint {
  public endpoint: IEndpoint;
  // @ts-ignore
  private req: Request;
  // @ts-ignore
  private res: Response;

  /**
   * Gets a cookie's value
   */
  getCookie(cookie: any) : string {
    return this.req.cookies[cookie.name];
  }

  /**
   * Clears a cookie
   */
  clearCookie(cookie: any) : void {
    this.res.clearCookie(cookie.name);
  }

  setCookie(cookie: any, value: string) : void {
    this.res.cookie(cookie.name, value, {maxAge: cookie.maxAge})
  }

  /**
   * Create Endpoint instance
   * @param {string} method the endpoint method
   * @param {IPostEndpoint|IGetEndpoint} endpoint the endpoint
   */
  constructor(method: string, endpoint: IPostEndpoint | IGetEndpoint) {
    this.endpoint = async function (req, res) {
      try {
        this.req = req;
        this.res = res;
        if (method === 'post') {
          await endpoint.bind(this)(req.body, req.query);
        } else {
          await endpoint.bind(this)(req.query);
        }
      }
      // handle errors
      catch (error) {
        if (error) {
          this.res.status(error.status.status).send({ ...error.status, error: {
            // @ts-ignore
            ...responseErrors[error.code],
            code: config.service.id + error.code}
          });
        }
      }
    }
    this.endpoint = this.endpoint.bind(this);
  }

  /**
   * Sends a 200 response
   * @param {*} data the data
   */
  respond(data: any = {}) {
    this.res.send({ name: "OK", status: 200, data });
    throw undefined;
  }

  /**
   * Redirects to another microservice
   * @param {string} service the service name
   */
  redirect(service: string) {
    this.res.redirect(`${config.services.api}/${service}`);
    throw undefined;
  }
};