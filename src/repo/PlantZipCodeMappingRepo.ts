import BaseRepo from './BaseRepo';
import PlantZipCodeMapping from 'src/storage/OfflineDBStorage/WmDB/models/PlantZipCodeMapping';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';

const ENTITY = OFFLINE_STORAGE.MODEL.PLANT_ZIP_CODE_MAPPING;

export class PlantZipCodeMappingRepo extends BaseRepo<PlantZipCodeMapping> {
  /**
   * Function returns distribution center of the prospect by postal code
   * @returns
   */
  async getDistributionCenterFromPostalCode() {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const QUERY =
        'select plant_number as plantNumber from plant_zip_code_mapping ' +
        'where zip_code = (select postal_code from prospects ' +
        'where discovery_id = ?)';

      const QUERY_VALUES = [discoveryId];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getDistributionCenterFromPostalCode error :>> ', error);
      return [];
    }
  }
}
