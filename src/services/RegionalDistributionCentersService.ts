import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {RegionalDistributionCentersRepo} from 'src/repo/RegionalDistributionCentersRepo';
import RegionalDistributionCenters from 'src/storage/OfflineDBStorage/WmDB/models/RegionalDistributionCenters';

export class RegionalDistributionCentersService extends BaseApiService<
  RegionalDistributionCenters,
  RegionalDistributionCentersRepo
> {
  private readonly regionalDistributionCentersRepository: RegionalDistributionCentersRepo =
    new RegionalDistributionCentersRepo();

  getRepo(): RegionalDistributionCentersRepo {
    return this.regionalDistributionCentersRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.REGIONAL_DISTRIBUTION_CENTERS;
  }

  async getDistributionCenter() {
    return await this.getRepo().getDistributionCenter();
  }
  async getRDCNumber() {
    return await this.getRepo().getRDCNumber();
  }
}

export default new RegionalDistributionCentersService();
