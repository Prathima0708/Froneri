import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import CustomersAbcClassifications from 'src/storage/OfflineDBStorage/WmDB/models/CustomersAbcClassifications';
import {CustomersAbcClassificationsRepo} from 'src/repo/CustomersAbcClassificationsRepo';

export class CustomersAbcClassificationsService extends BaseApiService<
  CustomersAbcClassifications,
  CustomersAbcClassificationsRepo
> {
  private readonly CustomersAbcClassificationsRepository: CustomersAbcClassificationsRepo =
    new CustomersAbcClassificationsRepo();

  getRepo(): CustomersAbcClassificationsRepo {
    return this.CustomersAbcClassificationsRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CUSTOMERS_INDUSTRY_CODES;
  }

  async getCustomersAbcClassification() {
    return await this.getRepo().getCustomersAbcClassification();
  }
}

