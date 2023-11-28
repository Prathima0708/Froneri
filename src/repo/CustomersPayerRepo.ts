import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import CustomersPayer from 'src/storage/OfflineDBStorage/WmDB/models/CustomersPayer';
import {OFFLINE_STORAGE} from 'src/storage/Storage';

const ENTITY = OFFLINE_STORAGE.MODEL.CUSTOMERS_PAYER;

export class CustomersPayerRepo extends BaseRepo<CustomersPayer> {
  /**
   * Function returns customers payer info
   */
  async getCustomersPayerInfo() {
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
      'abs(customers_payer.customer_payer) as payer, ' +
      'customers_payer.sales_organization || " " || customers_payer.distribution_channel as salesArea, ' +
      'coalesce(customers_payer.name1_payer, "") as name1, ' +
      'coalesce(customers_payer.name2_payer, "") as name2, ' +
      'coalesce(customers_payer.name3_payer, "") as name3, ' +
      'coalesce(customers_payer.address1_payer, "") || " " || coalesce(customers_payer.house_number_payer, "") as address, ' +
      'customers_payer.postal_code_payer || "  " || customers_payer.city_payer as postalCode, ' +
      'coalesce(customers_payer.phone1_payer, "") || "  " || coalesce(customers_payer.phone2_payer,"") as phone, ' +
      'coalesce(customers_payer.fax_payer, "") as fax, "" as email from customers_payer where ' +
      `customers_payer.customer_ship_to = "${customerShipTo}" and ` +
      `customers_payer.sales_organization = "${salesOrganization}" and ` +
      `customers_payer.distribution_channel = "${distributionChannel}"`;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }

  /**
   * Function returns customer payers details
   * @returns
   */
  async getCustomerPayersDetails() {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();

      const customerShipTo = prospectData?.customerShipTo
        ? prospectData.customerShipTo
        : '';

      const salesOrganization = prospectData?.salesOrganization
        ? prospectData.salesOrganization
        : '';

      const distributionChannel = prospectData?.distributionChannel
        ? prospectData.distributionChannel
        : '';

      let results = await collection
        .query(
          Q.unsafeSqlQuery(
            'SELECT Customer_Payer as customerPayer, ' +
              'coalesce(Name1_Payer, "") AS Name1, ' +
              'coalesce(Name2_Payer, "") AS Name2, ' +
              'coalesce(Name3_Payer, "") AS Name3 ' +
              'FROM  Customers_Payer ' +
              `WHERE  Customers_Payer.Customer_Ship_To = '${customerShipTo}' AND  ` +
              `Customers_Payer.Sales_Organization = '${salesOrganization}' AND ` +
              `Customers_Payer.Distribution_Channel = '${distributionChannel}' `,
          ),
        )
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getCustomerPayersDetails error :>> ', error);
      return [];
    }
  }
}
