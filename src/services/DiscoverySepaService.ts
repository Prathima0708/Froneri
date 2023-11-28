import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import DiscoverySepa from 'src/storage/OfflineDBStorage/WmDB/models/DiscoverySepa';
import {DiscoverySepaRepo} from 'src/repo/DiscoverySepaRepo';

export class DiscoverySepaService extends BaseApiService<
  DiscoverySepa,
  DiscoverySepaRepo
> {
  private readonly discoverySepaRepository: DiscoverySepaRepo =
    new DiscoverySepaRepo();

  getRepo(): DiscoverySepaRepo {
    return this.discoverySepaRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.DISCOVERY_SEPA;
  }

  async checkSepaAgreement(discoveryId: string) {
    return await this.getRepo().checkSepaAgreement(discoveryId);
  }

  async isSepaAgreementExists() {
    return await this.getRepo().isSepaAgreementExists();
  }

  async createOrUpdateProspectSepaInfo(prospectData: any) {
    return await this.getRepo().createOrUpdateProspectSepaInfo(prospectData);
  }

  async deleteSepaAgreement() {
    return await this.getRepo().deleteSepaAgreement();
  }

  async checkSEPAAgreements() {
    return await this.getRepo().checkSEPAAgreements();
  }
}
