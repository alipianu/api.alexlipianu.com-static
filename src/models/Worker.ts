import mongoose, { Schema, Document, Model } from 'mongoose';
import { __ERROR__ } from '../../../../../core/endpoint';
import config from '../config/config.json';
import Content, { IContentTarget } from './Content';
import models from './models';
mongoose.connect(`${config.service.database.url}/${config.service.database.name}`, { useNewUrlParser: true });


/**
 * Content target update interface
 */
interface IUpdateFn {
  (item: any): Promise<any>;
};


/**
 * Content target update interface
 */
interface IContentTargetUpdate extends IContentTarget {
  path: string;
  filter: any;
  projection: any;
  options: any;
};


/**
 * Worker document interface (properties & methods)
 */
export interface IWorkerDocument extends Document {
  mdlName: string;
  targets: Array<IContentTargetUpdate>;
};


/**
 * Worker model interface (statics)
 */
export interface IWorkerModel extends Model<IWorkerDocument> {
  updateAndPush(mdlName: string, data: Array<any>, updateFn: IUpdateFn): void;
};


/**
 * Worker schema
 */
export const WorkerSchema = new Schema({
  mdlName: {type: String, required: true, unique: true},
  targets: [{
    contentID: { type: Number, required: true },
    minClientVersion: { type: Number, required: true },
    maxClientVersion: { type: Number, required: true },
    path: { type: String, required: true },
    filter: { type: {} },
    projection: { type: {} },
    options: { type: {} }
  }]
});


/**
 * Get content
 * @param {string} contentID the content id
 * @param {string} clientVersion the client version
 */
WorkerSchema.statics.updateAndPush = async function (mdlName: string, data: Array<any>, updateFn: IUpdateFn) {
  // get model from which to push, exit if doesn't exist
  const model = models[mdlName];
  if (!model) return;

  // perform updates
  await Promise.all(data.map(updateFn));

  // find worker push details
  const worker = await Worker.findOne({ mdlName });
  if (!worker) return;

  // perform data push to content
  worker.targets.forEach((target) => {
    const {filter, projection, options} = target;
    // @ts-ignore
    model.find(filter, projection, options)
         .then((items: any) => {
            const {contentID, minClientVersion, maxClientVersion, path} = target;
            Content.updateTarget(contentID, minClientVersion, maxClientVersion, path, items);
          });
  });
};


var Worker: IWorkerModel = mongoose.model<IWorkerDocument, IWorkerModel>('Worker', WorkerSchema, 'worker');
export default Worker;