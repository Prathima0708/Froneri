import {SalesAreaRepo} from 'src/repo/SalesAreaRepo';
import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import SalesArea from 'src/storage/OfflineDBStorage/WmDB/models/SalesArea';

export class SalesAreaService extends BaseApiService<SalesArea, SalesAreaRepo> {
  private readonly salesAreaRepository: SalesAreaRepo = new SalesAreaRepo();

  getRepo(): SalesAreaRepo {
    return this.salesAreaRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.SALES_AREA;
  }

  async getSalesArea() {
    return await this.getRepo().getSalesArea();
  }
}
