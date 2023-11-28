import BaseRepo from './BaseRepo';
import CallCenters from 'src/storage/OfflineDBStorage/WmDB/models/CallCenters';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';

const ENTITY = OFFLINE_STORAGE.MODEL.CALL_CENTERS;

export class CallCentersRepo extends BaseRepo<CallCenters> {
  /**
   * Function returns the web page link for material information
   * @returns
   */
  async getMaterialInfoWebPageLink() {
    const collection = this.getCollection(ENTITY);

    const employeeInfo = await this.getLoggedInEmployeeInfo();

    const idCallCenter =
      employeeInfo.length > 0 ? employeeInfo[0].idCallCenter : '';

    const QUERY =
      'SELECT Link_To_Web_Product_Page ' +
      'FROM Call_Centers ' +
      `where ID_call_Center = ${idCallCenter}`;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }
}
