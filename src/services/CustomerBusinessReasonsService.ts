import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import CustomerBusinessReasons from 'src/storage/OfflineDBStorage/WmDB/models/CustomerBusinessReasons';
import {CustomerBusinessReasonsRepo} from 'src/repo/CustomerBusinessReasonsRepo';

export class CustomerBusinessReasonsService extends BaseApiService<
  CustomerBusinessReasons,
  CustomerBusinessReasonsRepo
> {
  private CustomerBusinessReasonsRepository: CustomerBusinessReasonsRepo =
    new CustomerBusinessReasonsRepo();

  getRepo(): CustomerBusinessReasonsRepo {
    return this.CustomerBusinessReasonsRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CUSTOMER_BUSINESS_REASONS;
  }

  async getCustomersBusinessReasons() {
    return await this.getRepo().getCustomersBusinessReasons();
  }
}
