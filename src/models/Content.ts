import mongoose, { Schema, Document, Model } from 'mongoose';
import { __ERROR__ } from '../core/endpoint';


/**
 * Content document interface (properties & methods)
 */
export interface IContentDocument extends Document {
  contentID: string;
  minClientVersion: string;
  maxClientVersion: string;
  data: Array<any>;
}


/**
 * Content model interface (statics)
 */
export interface IContentModel extends Model<IContentDocument> {
  getContent(contentID: string, clientVersion: string): IContentDocument;
}


/**
 * Content schema
 */
export const ContentSchema = new Schema({
  contentID: { type: String, required: true, unique: true },
  minClientVersion: { type: String, required: true },
  maxClientVersion: { type: String },
  data: { type: [{}], required: true }
});


/**
 * Get content
 * @param {string} contentID the content id
 * @param {string} clientVersion the client version
 */
ContentSchema.statics.getContent = async function (contentID: string, clientVersion: string) {
  let content = await this.find({ contentID, minClientVersion : { $lte :  clientVersion}, maxClientVersion : { $gte :  clientVersion} });
  if (!content) throw __ERROR__("0100", "BADREQUEST");
  return content;
};


var Content: IContentModel = mongoose.model<IContentDocument, IContentModel>('Content', ContentSchema, 'content');
export default Content;