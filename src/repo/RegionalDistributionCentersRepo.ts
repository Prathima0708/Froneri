import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import RegionalDistributionCenters from 'src/storage/OfflineDBStorage/WmDB/models/RegionalDistributionCenters';

const ENTITY = OFFLINE_STORAGE.MODEL.REGIONAL_DISTRIBUTION_CENTERS;

export class RegionalDistributionCentersRepo extends BaseRepo<RegionalDistributionCenters> {
  /**
   * Function returns distribution center dropdown data
   * @returns []
   */
  async getDistributionCenter() {
    try {
      const collection = this.getCollection(ENTITY);

      const QUERY =
        'select rdc_number as rdcNumber, ' +
        'description from regional_distribution_centers ' +
        "where plant_status = '1' order by rdcNumber";

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      }

      return [];
    } catch (error) {
      console.log('getDistributionCenter error :>> ', error);
      return [];
    }
  }
  /**
   * Function returns RDC Number  dropdown data
   * @returns []
   */
  async getRDCNumber() {
    try {
      const collection = this.getCollection(ENTITY);

      const QUERY = `select  
        rdc_number, 
        rdc_number + ' '+ name as description  
        from  
        regional_distribution_centers 
        where  
        plant_status='1'  
        order by  
        rdc_number `;

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      }

      return [];
    } catch (error) {
      console.log('getRDCNumber error :>> ', error);
      return [];
    }
  }
}
