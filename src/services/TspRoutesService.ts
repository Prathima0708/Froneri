import BaseApiService from './BaseApiService';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {TspRoutesRepo} from 'src/repo/TspRoutesRepo';
import TspRoutes from 'src/storage/OfflineDBStorage/WmDB/models/TspRoutes';

export class TspRoutesService extends BaseApiService<TspRoutes, TspRoutesRepo> {
  private readonly tspRoutesRepo: TspRoutesRepo = new TspRoutesRepo();

  getRepo(): TspRoutesRepo {
    return this.tspRoutesRepo;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.TSP_ROUTES;
  }

  async getCutOffTimeInfo(route: string) {
    return await this.getRepo().getCutOffTimeInfo(route);
  }
}
