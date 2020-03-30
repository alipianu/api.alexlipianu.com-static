import { IGetEndpoint, IPostEndpoint, __ERROR__ } from "@core/endpoint";
// import config from '../../config.json';
import Content, { IContentDocument } from "@models/Content";

/**
 * Get content
 * @param body - req body
 * @param params - the req params
 */
export const getContent: IGetEndpoint = async function (body: Record<string, string> = {}, params?: Record<string, string>) {
  if (!params || !params['clientVersion'] || !params['contentID']) throw __ERROR__("0100", "BADREQUEST");
  const clientVersion: string = params['clientVersion'];
  const contentID: string = params['contentID'];
  const content: IContentDocument = await Content.getContent(contentID, clientVersion);
  this.respond(content.data);
};

/**
 * Get content
 * @param body - req body
 * @param params - the req params
 */
export const test: IGetEndpoint = async function (body: Record<string, string> = {}, params?: Record<string, string>) {
  this.respond({"status": "Test successfull"});
};

/**
 * Set content
 * @param body - req body
 */
export const setContent: IPostEndpoint = async function (body: any = {}) {
  this.respond({});
};

export default {
  getContent, setContent, test
}