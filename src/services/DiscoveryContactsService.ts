import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import DiscoveryContacts from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryContacts';
import {DiscoveryContactsRepo} from 'src/repo/DiscoveryContactsRepo';
import {IContactInfo} from 'src/views/private/ProspectLanding/PLContacts/PLContacts';

export class DiscoveryContactsService extends BaseApiService<
  DiscoveryContacts,
  DiscoveryContactsRepo
> {
  private readonly DiscoveryContactsRepository: DiscoveryContactsRepo =
    new DiscoveryContactsRepo();

  getRepo(): DiscoveryContactsRepo {
    return this.DiscoveryContactsRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.DISCOVERY_CONTACTS;
  }

  async saveCreateProspectDiscoveryContactsInfo(
    discoveryId: string,
    previousCustomerBasicInfo: any,
  ) {
    return await this.getRepo().saveCreateProspectDiscoveryContactsInfo(
      discoveryId,

      previousCustomerBasicInfo,
    );
  }

  async createOrUpdateProspectDiscoveryContactsInfo(data: any) {
    return await this.getRepo().createOrUpdateProspectDiscoveryContactsInfo(
      data,
    );
  }

  async getContactsData() {
    return await this.getRepo().getContactsData();
  }

  async updateOrInsertDiscoveryContacts(
    contacts1obj: IContactInfo,
    contacts2obj: IContactInfo,
  ) {
    return await this.getRepo().updateOrInsertDiscoveryContacts(
      contacts1obj,
      contacts2obj,
    );
  }
}
