import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import SalesArea from 'src/storage/OfflineDBStorage/WmDB/models/SalesArea';

const ENTITY = OFFLINE_STORAGE.MODEL.SALES_AREA;

export class SalesAreaRepo extends BaseRepo<SalesArea> {
  /**
   * Function returns sales area dropdown values
   */
  async getSalesArea() {
    const collection = this.getCollection(ENTITY);
    const QUERY =
      "select sales_organization || ' ' || distribution_channel || ' ' || description as salesArea, " +
      "sales_organization || '-' || distribution_channel as salesAreaValue " +
      'from sales_area order by salesArea desc';

    const results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    if (results.length > 0) {
      return results;
    } else {
      return [];
    }
  }
}
