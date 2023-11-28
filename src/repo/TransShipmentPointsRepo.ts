import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import TransShipmentPoints from 'src/storage/OfflineDBStorage/WmDB/models/TransShipmentPoints';

const ENTITY = OFFLINE_STORAGE.MODEL.TRANS_SHIPMENT_POINTS;

export class TransShipmentPointsRepo extends BaseRepo<TransShipmentPoints> {
  /**
   * Function returns tsp level cut off time
   * @returns
   */
  async getTSPLevelCutOffTime(deliveryPlantNo: string) {
    const collection = this.getCollection(ENTITY);

    const QUERY =
      'select ' +
      'route_planning_cut_off_time as routePlanningCutOffTime, ' +
      'order_taking_cut_off_time as orderTakingCutOffTime ' +
      'from trans_shipment_points as tsp ' +
      'inner join regional_distribution_centers as rdc on TSP.RDC_Number = RDC.RDC_Number ' +
      'left join rdc_tsp_holiday_calendar as rthc on RDC.RDC_Number = RTHC.Plant_Number ' +
      `where tsp.plant_status='1' and tsp_number = "${deliveryPlantNo}"  `;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }

  /**
   * Function returns plant description of particular customer
   * @returns
   */
  async getPlantDescriptionOfCustomer(pickingPlantNumber: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const QUERY =
        'select name from trans_shipment_points where tsp_number = ?';

      const QUERY_VALUES = [pickingPlantNumber];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      }

      return [];
    } catch (error) {
      console.log('getPlantDescriptionOfCustomer error :>> ', error);
      return [];
    }
  }
}
