import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import Authorizations from 'src/storage/OfflineDBStorage/WmDB/models/Authorizations';

const ENTITY = OFFLINE_STORAGE.MODEL.AUTHORIZATIONS;

export class AuthorizationsRepo extends BaseRepo<Authorizations> {
  /**
   * Function returns update access for the user
   * @returns
   */
  async getDeleteAccess() {
    const collection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';

    const QUERY =
      'select granted_access as typeAccess,' +
      'tool from [authorizations] where ' +
      "employee_number = ? and tool = 'Physical_Deletion_Of_Prospects'";

    const QUERY_VALUES = [employeeNo];

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }
}
