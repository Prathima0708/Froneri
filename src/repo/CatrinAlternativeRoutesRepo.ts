import BaseRepo from './BaseRepo';
import CatrinAlternativeRoutes from 'src/storage/OfflineDBStorage/WmDB/models/CatrinAlternativeRoutes';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';

const ENTITY = OFFLINE_STORAGE.MODEL.CATRIN_ALTERNATIVE_ROUTES;
export class CatrinAlternativeRoutesRepo extends BaseRepo<CatrinAlternativeRoutes> {
  /**
   * Function returns future deliveries of the customer
   * @returns
   */
  async getNextTenDeliveries() {
    const collection = this.getCollection(ENTITY);

    const customerInfo: any = await this.getCLCustomerInfo();

    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';

    const QUERY =
      "SELECT IFNULL(Delivery_Route_Monday, '') AS deliveryRouteMonday, " +
      "IFNULL(Delivery_Route_Tuesday, '') AS deliveryRouteTuesday, " +
      "IFNULL(Delivery_Route_Wednesday, '') AS deliveryRouteWednesday, " +
      "IFNULL(Delivery_Route_Thursday, '') AS deliveryRouteThursday, " +
      "IFNULL(Delivery_Route_Friday, '') AS deliveryRouteFriday, " +
      "IFNULL(Delivery_Route_Saturday, '') AS deliveryRouteSaturday, " +
      "IFNULL(Delivery_Route_Sunday, '') AS deliveryRouteSunday " +
      'FROM Catrin_Alternative_Routes ' +
      `WHERE Customer_Ship_To = "${customerShipTo}" LIMIT 10`;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }
}
