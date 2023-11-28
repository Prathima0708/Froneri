import BaseApiService from './BaseApiService';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import ClaimsConfigurations from 'src/storage/OfflineDBStorage/WmDB/models/ClaimsConfigurations';
import {ClaimsConfigurationsRepo} from 'src/repo/ClaimsConfigurationsRepo';

export class ClaimsConfigurationsService extends BaseApiService<
  ClaimsConfigurations,
  ClaimsConfigurationsRepo
> {
  private readonly claimsConfigurationsRepo: ClaimsConfigurationsRepo =
    new ClaimsConfigurationsRepo();

  getRepo(): ClaimsConfigurationsRepo {
    return this.claimsConfigurationsRepo;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CLAIMS_CONFIGURATIONS;
  }

  async getDeliveryClaimReason(claimsConfigCode: string) {
    return await this.getRepo().getDeliveryClaimReason(claimsConfigCode);
  }
}
