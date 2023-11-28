import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import ClaimsConfigurations from 'src/storage/OfflineDBStorage/WmDB/models/ClaimsConfigurations';

const ENTITY = OFFLINE_STORAGE.MODEL.CLAIMS_CONFIGURATIONS;

export class ClaimsConfigurationsRepo extends BaseRepo<ClaimsConfigurations> {
  /**
   * Function returns sales unit dropdown data
   * @returns
   */
  async getDeliveryClaimReason(claimsConfigCode: string) {
    try {
      const collection = this.getCollection(ENTITY);

      let QUERY =
        'select claim_code as claimCode,description_language_1 as description ' +
        'from claims_configurations ' +
        `where claims_config_code ='${claimsConfigCode}' `;
      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();
      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getDeliveryClaimReason error :>> ', error);
      return [];
    }
  }
}
