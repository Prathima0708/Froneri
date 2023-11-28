import BaseRepo from './BaseRepo';
import CustomerHierarchiesShipTo from 'src/storage/OfflineDBStorage/WmDB/models/CustomerHierarchiesShipTo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';

const ENTITY = OFFLINE_STORAGE.MODEL.CUSTOMER_HIERARCHIES_SHIP_TO;
export class CustomerHierarchiesShipToRepo extends BaseRepo<CustomerHierarchiesShipTo> {
  /**
   * Function returns Customer Hierarchies Ship To
   * @returns
   */
  async getCustomerHierarchiesShipTo(value: string) {
    const collection = this.getCollection(ENTITY);

    let BASE_QUERY =
      'SELECT DISTINCT Customer_Hier_L6 as customerHierL6, ' +
      'Name_Hier_L6 as nameHierL6, ' +
      "Name_Hier_L6 || ' ' || Customer_Hier_L6 AS details " +
      'FROM Customer_Hierarchies_Ship_To ';

    if (value.length > 0) {
      BASE_QUERY =
        BASE_QUERY +
        ` WHERE Name_Hier_L6 LIKE '%${value}%' or Customer_Hier_L6 LIKE '%${value}%' `;
    }

    BASE_QUERY = BASE_QUERY + ' ORDER BY details  LIMIT 10';

    let results = await collection
      .query(Q.unsafeSqlQuery(BASE_QUERY))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  async getCustomerHierarchiesForSelectedCustomers() {
    const collection = this.getCollection(ENTITY);
    const customerInfo: any = await this.getCLCustomerInfo();

    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';
    const salesOrganization = customerInfo.salesOrganization
      ? customerInfo.salesOrganization
      : '';
    const distributionChannel = customerInfo.distributionChannel
      ? customerInfo.distributionChannel
      : '';

    let BASE_QUERY =
      'select * from customer_hierarchies_ship_to ' +
      `where customer_ship_to="${customerShipTo}" ` +
      `and sales_organization="${salesOrganization}" ` +
      `and distribution_channel="${distributionChannel}"`;

    let results = await collection
      .query(Q.unsafeSqlQuery(BASE_QUERY))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns Customer Hierarchies Data
   * @returns
   */
  async getCustomerHierarchies(
    salesOrganization: string,
    distributionChannel: string,
    searchText?: string,
  ) {
    const collection = this.getCollection(ENTITY);

    const QUERY =
      'SELECT * from ( SELECT  DISTINCT ' +
      "Name_Hier_L6 || ' ' || Customer_Hier_L6 as l6HierarchyLabel, Name_Hier_L6 || ' ' || Customer_Hier_L6 as l6HierarchyValue " +
      'FROM  Customer_Hierarchies_Ship_To AS Hierarchies ' +
      'WHERE  Hierarchies.Customer_Hier_L1 IS NOT NULL ' +
      'AND Hierarchies.Customer_Hier_L2 IS NOT NULL ' +
      'AND Hierarchies.Customer_Hier_L3 IS NOT NULL ' +
      'AND Hierarchies.Customer_Hier_L4 IS NOT NULL ' +
      'AND Hierarchies.Customer_Hier_L5 IS NOT NULL ' +
      'AND Hierarchies.Customer_Hier_L6 IS NOT NULL ' +
      `AND Hierarchies.Sales_Organization = '${salesOrganization}' ` +
      `AND Hierarchies.Distribution_Channel = '${distributionChannel}' ` +
      'GROUP BY Customer_Hier_L3, Customer_Hier_L4, ' +
      'Customer_Hier_L5, Customer_Hier_L6, Name_Hier_L3, ' +
      'Name_Hier_L4, Name_Hier_L5, Name_Hier_L6 ' +
      "ORDER BY Hierarchies.Name_Hier_L6 || ' ' || Hierarchies.Customer_Hier_L6)";

    let FILTER_QUERY = '';

    if (searchText && searchText.trim().length > 0) {
      FILTER_QUERY += ` WHERE l6HierarchyLabel LIKE '%${searchText}%'`;
    }

    FILTER_QUERY = FILTER_QUERY + ' LIMIT 10';

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY + FILTER_QUERY))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }
}
