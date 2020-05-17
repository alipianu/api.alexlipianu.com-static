import { IGetEndpoint, __ERROR__ } from "../../../../../core/endpoint";
import Content, { IContentDocument } from "../models/Content";

/**
 * Get content
 * @param body - req body
 * @param params - the req params
 */
export const getContent: IGetEndpoint = async function (params?: Record<string, string>) {
  if (!params || !params['clientVersion'] || !params['contentID']) throw __ERROR__("0100", "BADREQUEST");
  const clientVersion: string = params['clientVersion'];
  const contentID: string = params['contentID'];
  const content: IContentDocument = await Content.getContent(contentID, clientVersion);
  this.respond(content.data);
};

export default {
  getContent
};