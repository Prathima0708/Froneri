import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {DiscoveryListValuesRepo} from 'src/repo/DiscoveryListValuesRepo';
import DiscoveryListValues from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryListValues';

export class DiscoveryListValuesService extends BaseApiService<
  DiscoveryListValues,
  DiscoveryListValuesRepo
> {
  private readonly discoveryListValuesRepository: DiscoveryListValuesRepo =
    new DiscoveryListValuesRepo();

  getRepo(): DiscoveryListValuesRepo {
    return this.discoveryListValuesRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.DISCOVERY_LIST_VALUES;
  }

  async getCountries() {
    return await this.getRepo().getCountries();
  }

  async getDropdownListValues(controlName: string) {
    return await this.getRepo().getDropdownListValues(controlName);
  }

  async getDiscoveryListByControlName(controlName: string) {
    return await this.getRepo().getDiscoveryListByControlName(controlName);
  }

  async getCountryCode(countryName: string) {
    return await this.getRepo().getCountryCode(countryName);
  }
}
