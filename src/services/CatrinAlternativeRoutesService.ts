import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import CatrinAlternativeRoutes from 'src/storage/OfflineDBStorage/WmDB/models/CatrinAlternativeRoutes';
import {CatrinAlternativeRoutesRepo} from 'src/repo/CatrinAlternativeRoutesRepo';

export class CatrinAlternativeRoutesService extends BaseApiService<
  CatrinAlternativeRoutes,
  CatrinAlternativeRoutesRepo
> {
  private readonly CatrinAlternativeRoutesRepository: CatrinAlternativeRoutesRepo =
    new CatrinAlternativeRoutesRepo();

  getRepo(): CatrinAlternativeRoutesRepo {
    return this.CatrinAlternativeRoutesRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CATRIN_ALTERNATIVE_ROUTES;
  }

  async getNextTenDeliveries() {
    return await this.getRepo().getNextTenDeliveries();
  }
}
