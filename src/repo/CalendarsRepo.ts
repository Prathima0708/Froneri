import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import Calendars from 'src/storage/OfflineDBStorage/WmDB/models/Calendars';

const ENTITY = OFFLINE_STORAGE.MODEL.CALENDARS;

export class CalendarsRepo extends BaseRepo<Calendars> {
  /**
   * Function returns season dropdown data
   * @returns []
   */
  async getSeasonData() {
    try {
      const collection = this.getCollection(ENTITY);

      const QUERY =
        'select calendar_id as calendarId, frequency, ' +
        "frequency || ' ' || 'Weeks' as descriptionFrequency, " +
        'season from calendars';

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      }

      return [];
    } catch (error) {
      console.log('getSeasonData error :>> ', error);
      return [];
    }
  }
}
