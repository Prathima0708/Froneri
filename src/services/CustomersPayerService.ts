import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import CustomersSoldTo from 'src/storage/OfflineDBStorage/WmDB/models/CustomersSoldTo';
import {CustomersSoldToRepo} from 'src/repo/CustomersSoldToRepo';
import CustomersPayer from 'src/storage/OfflineDBStorage/WmDB/models/CustomersPayer';
import {CustomersPayerRepo} from 'src/repo/CustomersPayerRepo';

export class CustomersPayerService extends BaseApiService<
  CustomersPayer,
  CustomersPayerRepo
> {
  private readonly CustomersPayerRepository: CustomersPayerRepo =
    new CustomersPayerRepo();

  getRepo(): CustomersPayerRepo {
    return this.CustomersPayerRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CUSTOMERS_PAYER;
  }

  async getCustomersPayerInfo() {
    return await this.getRepo().getCustomersPayerInfo();
  }

  async getCustomerPayersDetails() {
    return await this.getRepo().getCustomerPayersDetails();
  }
}
