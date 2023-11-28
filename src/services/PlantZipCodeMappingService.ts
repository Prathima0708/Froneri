import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import PlantZipCodeMapping from 'src/storage/OfflineDBStorage/WmDB/models/PlantZipCodeMapping';
import {PlantZipCodeMappingRepo} from 'src/repo/PlantZipCodeMappingRepo';

export class PlantZipCodeMappingService extends BaseApiService<
  PlantZipCodeMapping,
  PlantZipCodeMappingRepo
> {
  private readonly plantZipCodeMappingRepo: PlantZipCodeMappingRepo =
    new PlantZipCodeMappingRepo();

  getRepo(): PlantZipCodeMappingRepo {
    return this.plantZipCodeMappingRepo;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.PLANT_ZIP_CODE_MAPPING;
  }

  async getDistributionCenterFromPostalCode() {
    return await this.getRepo().getDistributionCenterFromPostalCode();
  }
}

export default new PlantZipCodeMappingService();
