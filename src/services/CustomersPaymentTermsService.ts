import BaseApiService from './BaseApiService';
import CustomersPaymentTerms from 'src/storage/OfflineDBStorage/WmDB/models/CustomersPaymentTerms';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {CustomersPaymentTermsRepo} from 'src/repo/CustomersPaymentTermsRepo';

export class CustomersPaymentTermsService extends BaseApiService<
  CustomersPaymentTerms,
  CustomersPaymentTermsRepo
> {
  private readonly CustomersPaymentTermsRepo: CustomersPaymentTermsRepo =
    new CustomersPaymentTermsRepo();

  getRepo(): CustomersPaymentTermsRepo {
    return this.CustomersPaymentTermsRepo;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CUSTOMERS_PAYMENT_TERMS;
  }

  async getCustomerPaymentTermDescription() {
    return await this.getRepo().getCustomerPaymentTermDescription();
  }

  async getFinancialInfoCustomerPaymentTermDescription() {
    return await this.getRepo().getFinancialInfoCustomerPaymentTermDescription();
  }
}
