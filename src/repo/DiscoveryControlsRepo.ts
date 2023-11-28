import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import DiscoveryControls from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryControls';
import {OFFLINE_STORAGE} from 'src/storage/Storage';

const ENTITY = OFFLINE_STORAGE.MODEL.DISCOVERY_CONTROLS;

export class DiscoveryControlsRepo extends BaseRepo<DiscoveryControls> {
  /**
   * Function returns mandatory field config of discovery controls table
   * @returns string
   */
  async getControlMandatoryValue(controlName: string) {
    const collection = this.getCollection(ENTITY);

    let QUERY =
      'select * from discovery_controls where android_control_name = ?  ';

    const VALUES = [controlName];

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY, VALUES))
      .unsafeFetchRaw();

    if (results.length > 0) {
      return results[0].mandatory_acs;
    } else {
      return 0;
    }
  }
}
