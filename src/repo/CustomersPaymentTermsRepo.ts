import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import CustomersPaymentTerms from 'src/storage/OfflineDBStorage/WmDB/models/CustomersPaymentTerms';
import {OFFLINE_STORAGE} from 'src/storage/Storage';

const ENTITY = OFFLINE_STORAGE.MODEL.CUSTOMERS_PAYMENT_TERMS;

export class CustomersPaymentTermsRepo extends BaseRepo<CustomersPaymentTerms> {
  /**
   * Function returns customer payment term description
   * @returns []
   */
  async getCustomerPaymentTermDescription() {
    const collection = this.getCollection(ENTITY);
    const customerInfo: any = await this.getCLCustomerInfo();
    const paymentTerm = customerInfo.paymentTerm
      ? customerInfo.paymentTerm
      : '';

    let QUERY =
      'select customers_payment_terms.payment_term as paymentTerm, ' +
      'coalesce (customers_payment_terms.description_language_1,"") as descriptionLanguage, ' +
      'customers_payment_terms.payment_term_alert as paymentTermAlert, customers_payment_terms.hide from customers_payment_terms ' +
      `where customers_payment_terms.payment_term = "${paymentTerm}"`;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  async getFinancialInfoCustomerPaymentTermDescription() {
    const collection = this.getCollection(ENTITY);

    const QUERY =
      'select payment_term as itemValue, ' +
      "coalesce(payment_term, '') || ' - ' || coalesce(description_language_1, '') as description, " +
      'payment_term_alert as paymentTermAlert, hide from ' +
      'customers_payment_terms order by itemValue';

    const results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }
}
