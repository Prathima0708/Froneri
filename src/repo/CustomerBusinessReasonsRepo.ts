import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import CustomerBusinessReasons from 'src/storage/OfflineDBStorage/WmDB/models/CustomerBusinessReasons';

const ENTITY = OFFLINE_STORAGE.MODEL.CUSTOMER_BUSINESS_REASONS;

export class CustomerBusinessReasonsRepo extends BaseRepo<CustomerBusinessReasons> {
  /**
   * Function returns Customers Business Reasons
   * @returns
   */
  async getCustomersBusinessReasons() {
    const CustomersBusinessReasonsRepoCollection = this.getCollection(ENTITY);

    let results = await CustomersBusinessReasonsRepoCollection.query(
      Q.unsafeSqlQuery(
        'select id_customer_business_reason as idCustomerBusinessReason, ' +
          'description_language_1 as description ' +
          'from customer_business_reasons ' +
          "where (Hide IS NULL OR Hide <> '1') AND indirect_prospect <> '1' " +
          'order by idCustomerBusinessReason',
      ),
    ).unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }
}
