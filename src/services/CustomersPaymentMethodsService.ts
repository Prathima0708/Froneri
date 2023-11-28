import BaseApiService from './BaseApiService';
import CustomersPaymentMethods from 'src/storage/OfflineDBStorage/WmDB/models/CustomersPaymentMethods';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {CustomersPaymentMethodsRepo} from 'src/repo/CustomersPaymentMethodsRepo';

export class CustomersPaymentMethodsService extends BaseApiService<
  CustomersPaymentMethods,
  CustomersPaymentMethodsRepo
> {
  private readonly CustomersPaymentMethodsRepo: CustomersPaymentMethodsRepo =
    new CustomersPaymentMethodsRepo();

  getRepo(): CustomersPaymentMethodsRepo {
    return this.CustomersPaymentMethodsRepo;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CUSTOMERS_PAYMENT_METHODS;
  }

  async getCustomerPaymentMethodsDescription() {
    return await this.getRepo().getCustomerPaymentMethodsDescription();
  }

  async checkSEPA() {
    return await this.getRepo().checkSEPA();
  }
}
