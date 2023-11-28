import BaseRepo from './BaseRepo';
import Languages from 'src/storage/OfflineDBStorage/WmDB/models/Languages';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';

const ENTITY = OFFLINE_STORAGE.MODEL.LANGUAGES;

export class LanguagesRepo extends BaseRepo<Languages> {
  /**
   * Function returns Languages data
   * @returns
   */
  async getLanguagesData() {
    const collection = this.getCollection(ENTITY);

    let results = await collection
      .query(Q.unsafeSqlQuery('select * from languages'))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }
}
