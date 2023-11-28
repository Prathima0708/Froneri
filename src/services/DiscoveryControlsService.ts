import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import DiscoveryControls from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryControls';
import {DiscoveryControlsRepo} from 'src/repo/DiscoveryControlsRepo';

export class DiscoveryControlsService extends BaseApiService<
  DiscoveryControls,
  DiscoveryControlsRepo
> {
  private readonly DiscoveryControlsRepository: DiscoveryControlsRepo =
    new DiscoveryControlsRepo();

  getRepo(): DiscoveryControlsRepo {
    return this.DiscoveryControlsRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.DISCOVERY_CONTROLS;
  }

  async getControlMandatoryValue(controlName: string) {
    return await this.getRepo().getControlMandatoryValue(controlName);
  }
}
