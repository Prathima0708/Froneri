import BaseApiService from './BaseApiService';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import CallCenters from 'src/storage/OfflineDBStorage/WmDB/models/CallCenters';
import {CallCentersRepo} from 'src/repo/CallCentersRepo';

export class CallCentersService extends BaseApiService<
  CallCenters,
  CallCentersRepo
> {
  private readonly CallCentersRepository: CallCentersRepo =
    new CallCentersRepo();

  getRepo(): CallCentersRepo {
    return this.CallCentersRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CALL_CENTERS;
  }

  async getMaterialInfoWebPageLink() {
    return await this.getRepo().getMaterialInfoWebPageLink();
  }
}
