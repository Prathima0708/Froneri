import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import TerritoriesHierarchy from 'src/storage/OfflineDBStorage/WmDB/models/TerritoriesHierarchy';
import {TerritoriesHierarchyRepo} from 'src/repo/TerritoriesHierarchyRepo';

export class TerritoriesHierarchyService extends BaseApiService<
  TerritoriesHierarchy,
  TerritoriesHierarchyRepo
> {
  private readonly TerritoriesHierarchyRepository: TerritoriesHierarchyRepo =
    new TerritoriesHierarchyRepo();

  getRepo(): TerritoriesHierarchyRepo {
    return this.TerritoriesHierarchyRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.TERRITORIES_HIERARCHY;
  }

  async getConnectedUserAllTerritories(connectedUserIdTerriroty: string) {
    return await this.getRepo().getConnectedUserAllTerritories(
      connectedUserIdTerriroty,
    );
  }
  async getSalesRepDetail(customerShipTo: string) {
    return await this.getRepo().getSalesRepDetail(customerShipTo);
  }
}
