import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import CustomersDifferentDeliveryAddress from 'src/storage/OfflineDBStorage/WmDB/models/CustomersDifferentDeliveryAddress';
import {OFFLINE_STORAGE} from 'src/storage/Storage';

const ENTITY = OFFLINE_STORAGE.MODEL.CUSTOMERS_DIFFERENT_DELIVERY_ADDRESS;

export class CustomersDifferentDeliveryAddressRepo extends BaseRepo<CustomersDifferentDeliveryAddress> {
  /**
   * Prepoluate Customer Basic info - Delivery Address data in PLP screen
   */
  async getPLPCustomerDeliveryAddressData() {
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
      'select name1_diff_addr as name1, ' +
      'name2_diff_addr as name2, ' +
      'name3_diff_addr as name3, name4_diff_addr as name4, ' +
      'house_number_diff_addr as houseNumber, address1_diff_addr as address1, street1_diff_addr as address2, ' +
      'street2_diff_addr as address3, ' +
      'postal_code_diff_addr as zipCode, ' +
      'city_diff_addr as city, ' +
      'postal_box_diff_addr as poBox, ' +
      'postal_code_box_diff_addr as postalCodePOBox, ' +
      'city_box_diff_addr as cityPOBox, ' +
      'country_diff_addr as country, ' +
      'mail_address_diff_addr as email, ' +
      'phone1_diff_addr as phoneNumber, ' +
      'phone2_diff_addr as mobileNumber, ' +
      'fax_diff_addr as fax ' +
      'from customers_different_delivery_address ' +
      `where customer_ship_to = '${customerShipTo}' and ` +
      `sales_organization = '${salesOrganization}' and ` +
      `distribution_channel = '${distributionChannel}' `;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }
}
