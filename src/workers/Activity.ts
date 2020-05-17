import Worker from '../../../../../core/worker';
import WorkerModel from './../models/Worker';
import Activity from '../models/Activity';
import { join } from 'path';

/**
 * Get latest activity
 */
export const getLatest = new Worker(join(__dirname, 'scripts/latest-activity.sh'))
  // pass urls for which to get latest
  .preHook(async () => Activity.getGitHubURLs())
  // update activity with latest
  .onSuccess(async ({stdout}: any) => {
    const response: any = JSON.parse(stdout);
    const duplicate: any = {};

    // perform activity updates, push changes
    WorkerModel.updateAndPush('Activity', response.data, (activity) => {
      const { url, ...changeset } = activity;
      if (duplicate[url]) return Promise.resolve();
      duplicate[url] = true;
      return Activity.updateOne({ url: activity.url }, { $set: changeset }).exec();
    });
  });

export default {
  getLatest
};