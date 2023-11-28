import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import CustomersSoldTo from 'src/storage/OfflineDBStorage/WmDB/models/CustomersSoldTo';
import {CustomersSoldToRepo} from 'src/repo/CustomersSoldToRepo';

export class CustomersSoldToService extends BaseApiService<
  CustomersSoldTo,
  CustomersSoldToRepo
> {
  private readonly CustomersSoldToRepository: CustomersSoldToRepo =
    new CustomersSoldToRepo();

  getRepo(): CustomersSoldToRepo {
    return this.CustomersSoldToRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CUSTOMERS_BILL_TO;
  }

  async getCustomersSoldToInfo() {
    return await this.getRepo().getCustomersSoldToInfo();
  }
}
