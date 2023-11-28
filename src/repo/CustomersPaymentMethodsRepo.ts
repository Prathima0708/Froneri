import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import CustomersPaymentMethods from 'src/storage/OfflineDBStorage/WmDB/models/CustomersPaymentMethods';

const ENTITY = OFFLINE_STORAGE.MODEL.CUSTOMERS_PAYMENT_METHODS;

export class CustomersPaymentMethodsRepo extends BaseRepo<CustomersPaymentMethods> {
  /**
   * Function returns customer payment methods description
   * @returns []
   */
  async getCustomerPaymentMethodsDescription() {
    const collection = this.getCollection(ENTITY);

    let QUERY =
      'select payment_method as itemValue, ' +
      'payment_method || ' +
      "' - ' || coalesce(description_language_1, '') as description " +
      'from customers_payment_methods ' +
      "where discovery_relevant = '1' order by itemValue";

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns for SEPA check
   * @returns []
   */
  async checkSEPA() {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      let QUERY =
        'SELECT DFD.Discovery_Id from Customers_Payment_Methods CPM ' +
        'INNER JOIN Discovery_Financial_Data DFD ' +
        'ON DFD.Payment_Method = CPM.Payment_Method  ' +
        `WHERE Discovery_Id = '${discoveryId}' ` +
        "AND CPM.SEPA_Mandatory='1' ";

      let results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results && results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }
}
