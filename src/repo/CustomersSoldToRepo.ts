import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import CustomersSoldTo from 'src/storage/OfflineDBStorage/WmDB/models/CustomersSoldTo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';

const ENTITY = OFFLINE_STORAGE.MODEL.CUSTOMERS_SOLD_TO;

export class CustomersSoldToRepo extends BaseRepo<CustomersSoldTo> {
  /**
   * Function returns customers sold to info
   */
  async getCustomersSoldToInfo() {
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
    const QUERY =
      'select ' +
      'abs(customers_sold_to.customer_sold_to) as soldTo, ' +
      'customers_sold_to.sales_organization || " " || customers_sold_to.distribution_channel as salesArea, ' +
      'coalesce(customers_sold_to.name1_sold_to, "") as name1, ' +
      'coalesce(customers_sold_to.name2_sold_to, "") as name2, ' +
      'coalesce(customers_sold_to.name3_sold_to, "") as name3, ' +
      'coalesce(customers_sold_to.address1_sold_to, "") || " " || coalesce(customers_sold_to.house_number_sold_to, "") as address, ' +
      'customers_sold_to.postal_code_sold_to || "  " || customers_sold_to.city_sold_to as postalCode, ' +
      'coalesce(customers_sold_to.phone1_sold_to, "") || "  " || coalesce(customers_sold_to.phone2_sold_to, "") as phone, ' +
      'coalesce(customers_sold_to.fax_sold_to, "") as fax, "" as email from customers_sold_to where ' +
      `customers_sold_to.customer_ship_to = "${customerShipTo}" and ` +
      `customers_sold_to.sales_organization = "${salesOrganization}" and ` +
      `customers_sold_to.distribution_channel = "${distributionChannel}"`;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }
}
