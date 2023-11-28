import BaseRepo from './BaseRepo';
import OrdersAggregated from 'src/storage/OfflineDBStorage/WmDB/models/OrdersAggregated';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';

const ENTITY = OFFLINE_STORAGE.MODEL.ORDERS_AGGREGATED;

export class OrdersAggregatedRepo extends BaseRepo<OrdersAggregated> {
  /**
   * Function returns Turnover summary
   * @returns []
   */
  async getTurnoverSummary() {
    const collection = this.getCollection(ENTITY);
    const customerInfo: any = await this.getCLCustomerInfo();
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';

    const QUERY =
      "SELECT 'Order' AS category, " +
      '[Type] AS type, ' +
      '0 AS turnoverValue, ' +
      'Net_Amount AS netAmount, ' +
      'Gross_Amount AS grossAmount, ' +
      'Net_Weight AS netWeight ' +
      'FROM Orders_Aggregated ' +
      "WHERE [Type] IN ('D', 'F', 'G') " +
      `AND Customer_Ship_To = '${customerShipTo}' ` +
      'UNION ' +
      "SELECT 'Turnover' AS category, " +
      '[Type] AS type, ' +
      'SUM(Turnover_Value) AS turnoverValue, ' +
      '0 AS netAmount, ' +
      '0 AS grossAmount, ' +
      '0 AS netWeight ' +
      'FROM Turnover_Aggregated ' +
      "WHERE [Type] IN ('D', 'F') " +
      `AND Customer_Ship_To = '${customerShipTo}' ` +
      'GROUP BY [Type]';

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }
}
