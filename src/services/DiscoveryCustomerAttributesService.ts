import BaseApiService from './BaseApiService';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import DiscoveryCustomerAttributes from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryCustomerAttributes';
import {DiscoveryCustomerAttributesRepo} from 'src/repo/DiscoveryCustomerAttributesRepo';

export class DiscoveryCustomerAttributesService extends BaseApiService<
  DiscoveryCustomerAttributes,
  DiscoveryCustomerAttributesRepo
> {
  private readonly DiscoveryCustomerAttributesRepository: DiscoveryCustomerAttributesRepo =
    new DiscoveryCustomerAttributesRepo();

  getRepo(): DiscoveryCustomerAttributesRepo {
    return this.DiscoveryCustomerAttributesRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.DISCOVERY_CUSTOMER_ATTRIBUTES;
  }

  async saveCreateProspectDiscoveryCustomerAttributeInfo(
    previousCustomerShipTo: string,
    discoveryId: string,
    prospectCanvasser: any,
    previousCustomerBasicInfoData: any,
  ) {
    return await this.getRepo().saveCreateProspectDiscoveryCustomerAttributeInfo(
      previousCustomerShipTo,
      discoveryId,
      prospectCanvasser,
      previousCustomerBasicInfoData,
    );
  }

  async getProspectCustomerAttributeInfo() {
    return await this.getRepo().getProspectCustomerAttributeInfo();
  }

  async insertOrUpdateCustomerAttributeInfo(customerAttributeData: any) {
    return await this.getRepo().insertOrUpdateCustomerAttributeInfo(
      customerAttributeData,
    );
  }
}
