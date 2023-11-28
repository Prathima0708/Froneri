import BaseApiService from './BaseApiService';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import MaterialHierarchy from 'src/storage/OfflineDBStorage/WmDB/models/MaterialHierarchy';
import {MaterialHierarchyRepo} from 'src/repo/MaterialHierarchyRepo';

export class MaterialHierarchyService extends BaseApiService<
  MaterialHierarchy,
  MaterialHierarchyRepo
> {
  private readonly MaterialHierarchyRepo: MaterialHierarchyRepo =
    new MaterialHierarchyRepo();

  getRepo(): MaterialHierarchyRepo {
    return this.MaterialHierarchyRepo;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.MATERIAL_HIERARCHY;
  }

  async getMaterialHierarchy(
    filterObj: {
      materialHierarchy?: string;
      materialNumber?: string;
      materialDescription?: string;
    } = {},
  ) {
    return await this.getRepo().getMaterialHierarchy(filterObj);
  }
  async getMaterialProductGroup(
    materialHierarchyFromSapNode: string,
    materialHierarchyNode: string,
  ) {
    return await this.getRepo().getMaterialProductGroup(
      materialHierarchyFromSapNode,
      materialHierarchyNode,
    );
  }
}
