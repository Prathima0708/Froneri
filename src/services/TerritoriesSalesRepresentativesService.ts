import BaseApiService from './BaseApiService';
import TerritoriesSalesRepresentatives from 'src/storage/OfflineDBStorage/WmDB/models/TerritoriesSalesRepresentatives';
import {TerritoriesSalesRepresentativesRepo} from 'src/repo/TerritoriesSalesRepresentativesRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';

export class TerritoriesSalesRepresentativesService extends BaseApiService<
  TerritoriesSalesRepresentatives,
  TerritoriesSalesRepresentativesRepo
> {
  private readonly TerritoriesSalesRepresentativesRepository: TerritoriesSalesRepresentativesRepo =
    new TerritoriesSalesRepresentativesRepo();

  getRepo(): TerritoriesSalesRepresentativesRepo {
    return this.TerritoriesSalesRepresentativesRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.TERRITORIES_SALES_REPRESENTATIVES;
  }

  async findLoggedInEmployeeTerritoryInfo(employeeNo: string) {
    return await this.getRepo().findLoggedInEmployeeTerritoryInfo(employeeNo);
  }
}
