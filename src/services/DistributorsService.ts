import BaseApiService from './BaseApiService';

import Distributors from 'src/storage/OfflineDBStorage/WmDB/models/Distributors';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {DistributorsRepo} from 'src/repo/DistributorsRepo';

export class DistributorsService extends BaseApiService<
  Distributors,
  DistributorsRepo
> {
  private readonly DistributorsRepository: DistributorsRepo =
    new DistributorsRepo();

  getRepo(): DistributorsRepo {
    return this.DistributorsRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.DISTRIBUTORS;
  }

  async getDistributors() {
    return await this.getRepo().getDistributors();
  }

  async getCustomerAttributeDistributors() {
    return await this.getRepo().getCustomerAttributeDistributors();
  }
}
