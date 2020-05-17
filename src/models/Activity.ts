import mongoose, { Schema, Document, Model } from 'mongoose';
import { __ERROR__ } from '../../../../../core/endpoint';
import patterns from '../config/patterns.json';
import config from '../config/config.json';
mongoose.connect(`${config.service.database.url}/${config.service.database.name}`, { useNewUrlParser: true });


/**
 * Activity document interface (properties & methods)
 */
export interface IActivityDocument extends Document {
  name: string;
  description: string;
  platform: string;
  url: string;
  private: boolean;
  lastActivity: string;
};


/**
 * Activity model interface (statics)
 */
export interface IActivityModel extends Model<IActivityDocument> {
  getGitHubURLs(): Promise<Array<IActivityDocument>>;
};


/**
 * Activity schema
 */
export const ActivitySchema = new Schema({
  name: { type: String },
  description: { type: String },
  platform: { type: String },
  url: { type: String, required: true, unique: true },
  private: { type: Boolean },
  lastActivity: { type: String }
});


/**
 * Get all activity GitHub urls
 */
ActivitySchema.statics.getGitHubURLs = async function () {
  return this.find({ url: { $regex: patterns.githubURL } }, ['url']).exec().then((activity: Array<IActivityDocument>) => Promise.resolve(activity.map((o) => o.url)));
};


var Activity: IActivityModel = mongoose.model<IActivityDocument, IActivityModel>('Activity', ActivitySchema, 'activity');
export default Activity;