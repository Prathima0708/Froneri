import BaseApiService from './BaseApiService';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {CallPlaceRepo} from 'src/repo/CallPlacesRepo';
import CallPlaces from 'src/storage/OfflineDBStorage/WmDB/models/CallPlaces';

export class CallPlacesService extends BaseApiService<
  CallPlaces,
  CallPlaceRepo
> {
  private readonly callPlacesRepository: CallPlaceRepo = new CallPlaceRepo();

  getRepo(): CallPlaceRepo {
    return this.callPlacesRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.ACTIVITIES;
  }

  async findAndUpdateDescription(userInfo: any) {
    return await this.getRepo().findAndUpdateDescription(userInfo);
  }

  async getTransitCallPlace(searchText: string) {
    return await this.getRepo().getTransitCallPlace(searchText);
  }
}

export default new CallPlacesService();
