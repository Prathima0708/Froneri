import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import DiscoveryRca from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryRca';
import {DiscoveryRcaRepo} from 'src/repo/DiscoveryRcaRepo';

export class DiscoveryRcaService extends BaseApiService<
  DiscoveryRca,
  DiscoveryRcaRepo
> {
  private readonly DiscoveryRcaRepository: DiscoveryRcaRepo =
    new DiscoveryRcaRepo();

  getRepo(): DiscoveryRcaRepo {
    return this.DiscoveryRcaRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.DISCOVERY_RCA;
  }

  async saveCreateProspectDiscoveryRcaInfo(
    discoveryId: string,
    previousCustomerCallsAndDeliveryInfo: any,
    previousCustomerAlternativeDeliveryInfo: any,
  ) {
    return await this.getRepo().saveCreateProspectDiscoveryRcaInfo(
      discoveryId,
      previousCustomerCallsAndDeliveryInfo,
      previousCustomerAlternativeDeliveryInfo,
    );
  }

  async getOpeningHours() {
    return await this.getRepo().getOpeningHours();
  }

  async getVisitingHours() {
    return await this.getRepo().getVisitingHours();
  }

  async getProspectRCAData() {
    return await this.getRepo().getProspectRCAData();
  }

  async getDeliveryComment() {
    return await this.getRepo().getDeliveryComment();
  }

  async insertOrUpdateProspectRCAData(data: any) {
    return await this.getRepo().insertOrUpdateProspectRCAData(data);
  }
}
