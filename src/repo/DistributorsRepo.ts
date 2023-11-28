import BaseRepo from './BaseRepo';
import Distributors from 'src/storage/OfflineDBStorage/WmDB/models/Distributors';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';

const ENTITY = OFFLINE_STORAGE.MODEL.DISTRIBUTORS;

export class DistributorsRepo extends BaseRepo<Distributors> {
  /**
   * Function returns Distributors
   * @returns
   */
  async getDistributors() {
    const collection = this.getCollection(ENTITY);

    let results = await collection
      .query(
        Q.unsafeSqlQuery(
          'SELECT 0 AS idDistributors, ' +
            "'ALL' AS description " +
            'UNION ALL ' +
            'SELECT ID_Distributors AS idDistributors, ' +
            'Description_Language_1 AS description ' +
            'FROM Distributors ' +
            "WHERE Hide <> '1' " +
            'ORDER BY ID_Distributors',
        ),
      )
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns Customber attribute Distributors
   * @returns
   */
  async getCustomerAttributeDistributors() {
    const collection = this.getCollection(ENTITY);

    let results = await collection
      .query(
        Q.unsafeSqlQuery(
          'select id_distributors as idDistributors, ' +
            "coalesce(description_language_1, '') as description " +
            'from distributors ' +
            "where hide <> '1' " +
            'order by description',
        ),
      )
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }
}
