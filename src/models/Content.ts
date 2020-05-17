import mongoose, { Schema, Document, Model } from 'mongoose';
import { __ERROR__ } from '../../../../../core/endpoint';
import patterns from '../config/patterns.json';
import config from '../config/config.json';
mongoose.connect(`${config.service.database.url}/${config.service.database.name}`, { useNewUrlParser: true });


/**
 * Content target interface
 */
export interface IContentTarget {
  contentID: number;
  minClientVersion: number;
  maxClientVersion: number;
};


/**
 * Content document interface (properties & methods)
 */
export interface IContentDocument extends IContentTarget, Document {
  data: any;
};


/**
 * Content model interface (statics)
 */
export interface IContentModel extends Model<IContentDocument> {
  getContent(contentID: string, clientVersion: string): IContentDocument;
  updateTarget(contentID: number, minClientVersion: number, maxClientVersion: number, path: string, item: Array<any>): void;
};


/**
 * Content schema
 */
export const ContentSchema = new Schema({
  contentID: { type: Number, required: true },
  minClientVersion: { type: Number, required: true },
  maxClientVersion: { type: Number, required: true },
  data: { type: {}, required: true }
});


/**
 * Get content
 * @param {string} contentID the content id
 * @param {string} clientVersion the client version
 */
ContentSchema.statics.getContent = async function (contentID: string, clientVersion: string) {
  if (!contentID.match(patterns.integer) || !clientVersion.match(patterns.integer)) throw __ERROR__("0100", "BADREQUEST");
  const id: number = parseInt(contentID);
  const version: number = parseInt(clientVersion);
  let content = await this.findOne({ contentID: id, minClientVersion : { $lte : version }, maxClientVersion : { $gte : version } }, ['data'], { sort: { '_id': -1 } });
  if (!content) throw __ERROR__("0100", "BADREQUEST");
  return content;
};


/**
 * Updates a specific content target by updating items at a specific path
 * @param {number} contentID the content target's id
 * @param {string} minClientVersion the content target's minimum client version
 * @param {string} maxClientVersion the content target's maximum client version
 * @param {string} path the path inside the content target's data property to perform the update
 * @param {string} items the new items
 */
ContentSchema.statics.updateTarget = async function (contentID: number, minClientVersion: number, maxClientVersion: number, path: string, items: Array<any>) {
  // check for valid path
  if (!path.match(patterns.path)) return;
  
  // update target content
  const update: any = { $set: {} };
  update['$set'][`data.${path}`] = items;
  this.updateMany({ contentID, minClientVersion : { $gte : minClientVersion }, maxClientVersion : { $lte : maxClientVersion } }, update);
};


var Content: IContentModel = mongoose.model<IContentDocument, IContentModel>('Content', ContentSchema, 'content');
export default Content;