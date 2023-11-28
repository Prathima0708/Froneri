import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import CustomersBillTo from 'src/storage/OfflineDBStorage/WmDB/models/CustomersBillTo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';

const ENTITY = OFFLINE_STORAGE.MODEL.CUSTOMERS_BILL_TO;

export class CustomersBillToRepo extends BaseRepo<CustomersBillTo> {
  /**
   * Function returns customers bill to info
   */
  async getCustomersBillToInfo() {
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
      'abs(customers_bill_to.customer_bill_to) as billTo, ' +
      'customers_bill_to.sales_organization || " " || customers_bill_to.distribution_channel as salesArea, ' +
      'coalesce(customers_bill_to.name1_bill_to, "") as name1, ' +
      'coalesce(customers_bill_to.name2_bill_to, "") as name2, ' +
      'coalesce(customers_bill_to.name3_bill_to, "") as name3, ' +
      'coalesce(customers_bill_to.address1_bill_to, "") || " " || coalesce(customers_bill_to.house_number_bill_to, "") as address, ' +
      'customers_bill_to.postal_code_bill_to || "  " || customers_bill_to.city_bill_to as postalCode, ' +
      'coalesce(customers_bill_to.phone1_bill_to, "") || "  " || coalesce(customers_bill_to.phone2_bill_to, "") as phone, ' +
      'coalesce(customers_bill_to.fax_bill_to, "") as fax, "" as email ' +
      'from customers_bill_to where ' +
      'customers_bill_to.customer_ship_to = "' +
      customerShipTo +
      '" and ' +
      'customers_bill_to.sales_organization = "' +
      salesOrganization +
      '" and ' +
      'customers_bill_to.distribution_channel = "' +
      distributionChannel +
      '"';

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }

  /**
   * Prepoluate Customer Basic info - BillTo data in PLP screen
   */
  async getPLPCustomerBillToData() {
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
    const collection = this.getCollection(ENTITY);
    const QUERY =
      'select customer_bill_to, name1_bill_to as name1, ' +
      'name2_bill_to as name2, name3_bill_to as name3, name4_bill_to as name4, ' +
      'house_number_bill_to as houseNumber, address1_bill_to as address1, ' +
      'street1_bill_to as address2, street2_bill_to as address3, ' +
      'street3_bill_to, postal_code_bill_to as zipCode, ' +
      'city_bill_to as city, postal_box_bill_to as poBox, ' +
      'postal_code_box_bill_to as postalCodePOBox ,city_box_bill_to as cityPOBox, ' +
      'country_bill_to as country, mail_address_bill_to as email, ' +
      'phone1_bill_to as phoneNumber, ' +
      'phone2_bill_to as mobileNumber, ' +
      'fax_bill_to as fax ' +
      'from customers_bill_to ' +
      `where customers_bill_to.customer_ship_to = '${customerShipTo}' ` +
      `and customers_bill_to.sales_organization = '${salesOrganization}' ` +
      `and customers_bill_to.distribution_channel = '${distributionChannel}' `;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }
}
