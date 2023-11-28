import BaseRepo from './BaseRepo';
import CallPlaces from 'src/storage/OfflineDBStorage/WmDB/models/CallPlaces';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import {ALLOCATION_TYPE} from 'src/utils/DbConst';

const ENTITY = OFFLINE_STORAGE.MODEL.CALL_PLACES;

export class CallPlaceRepo extends BaseRepo<CallPlaces> {
  /**
   * Update the description for the LoggedIn User
   * @returns
   */
  async findAndUpdateDescription(userInfo: any) {
    const collection = this.getCollection(ENTITY);

    const callPlaceNumber = userInfo?.value || '';
    const userName = userInfo?.name || '';

    let callsObj = await collection
      .query(Q.where('call_place_number', callPlaceNumber))
      .fetch();

    if (callsObj.length > 0) {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await callsObj[0].update((rec: any) => {
          rec.description = userName;
          console.log('description :>> ', rec.description);
        });
      });
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns the dropdown data of transit call place
   * @returns
   */
  async getTransitCallPlace(searchText: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const employeeInfo = await this.getLoggedInEmployeeInfo();

      const idCallCenter =
        employeeInfo.length > 0 ? employeeInfo[0].idCallCenter : '';

      const QUERY =
        'select call_place_number as callPlaceNumber, ' +
        "call_place_number || ' ' || description as callPlaceName " +
        'from call_places where id_call_center = ? and allocation_type = ? ';

      const QUERY_VALUES = [idCallCenter, ALLOCATION_TYPE.AUTOMATIC_ALLOCATION];

      let FILTER_QUERY = '';

      if (searchText && searchText.trim().length > 0) {
        FILTER_QUERY += ` and callPlaceName LIKE '%${searchText}%'`;
      }

      FILTER_QUERY += ' order by call_place_number LIMIT 10';

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY + FILTER_QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      }

      return [];
    } catch (error) {
      console.log('getTransitCallPlace error :>> ', error);
      return [];
    }
  }
}
