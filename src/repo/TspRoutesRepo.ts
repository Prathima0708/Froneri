import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import TspRoutes from 'src/storage/OfflineDBStorage/WmDB/models/TspRoutes';

const ENTITY = OFFLINE_STORAGE.MODEL.TSP_ROUTES;

export class TspRoutesRepo extends BaseRepo<TspRoutes> {
  /**
   * Function returns delivery lead time
   * @returns
   */
  async getCutOffTimeInfo(route: string) {
    const collection = this.getCollection(ENTITY);

    const QUERY =
      'select  ' +
      'order_taking_cut_off_time as orderTakingCutOffTime, ' +
      'route_planning_cut_off_time as routePlanningCutOffTime, ' +
      'delivery_lead_time as deliveryLeadTime from ' +
      `tsp_routes where route = "${route}" `;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }
}
