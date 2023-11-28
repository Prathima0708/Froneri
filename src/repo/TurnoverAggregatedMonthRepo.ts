import BaseRepo from './BaseRepo';
import TurnoverAggregatedMonth from 'src/storage/OfflineDBStorage/WmDB/models/TurnoverAggregatedMonth';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';

const ENTITY = OFFLINE_STORAGE.MODEL.TURNOVER_AGGREGATED_MONTH;

export class TurnoverAggregatedMonthRepo extends BaseRepo<TurnoverAggregatedMonth> {
  /**
   * Function returns Monthly Turnover
   * @returns []
   */
  async getMonthlyTurnover() {
    const collection = this.getCollection(ENTITY);
    const customerInfo: any = await this.getCLCustomerInfo();
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';

    const QUERY =
      'SELECT Turnover_Groups.Description_Language_1 AS turnoverGroupDescription, ' +
      '[Month], ' +
      '[Type], ' +
      'SUM(Turnover_Value) AS turnoverValue, ' +
      'SUM(Weight_Value) AS weightValue ' +
      'FROM Turnover_Aggregated_Month ' +
      'LEFT JOIN Turnover_Groups ON Turnover_Aggregated_Month.Id_Turnover_Group = Turnover_Groups.Id_Turnover_Group ' +
      `WHERE Customer_Ship_To = '${customerShipTo}' ` +
      "AND [Type] IN ('A', 'B') " +
      'GROUP BY turnoverGroupDescription, [Month], [Type]';

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }
}
