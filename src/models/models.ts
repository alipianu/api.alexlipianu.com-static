import Activity, { IActivityModel } from './Activity';
import Content, { IContentModel } from './Content';
import Worker, { IWorkerModel } from './Worker';

const module: Record<string, IWorkerModel | IContentModel | IActivityModel> = {
  Activity,
  Content,
  Worker
};

export default module;