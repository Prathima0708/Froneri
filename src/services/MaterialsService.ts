import BaseApiService from './BaseApiService';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import Materials from 'src/storage/OfflineDBStorage/WmDB/models/Materials';
import {MaterialsRepo} from 'src/repo/MaterialsRepo';

export class MaterialsService extends BaseApiService<Materials, MaterialsRepo> {
  private readonly materialsRepo: MaterialsRepo = new MaterialsRepo();

  getRepo(): MaterialsRepo {
    return this.materialsRepo;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.MATERIALS;
  }

  async getTADescription(searchText: string, materialNumber: string = '') {
    return await this.getRepo().getTADescription(searchText, materialNumber);
  }
  async getSalesUnitTypeDropdownData() {
    return await this.getRepo().getSalesUnitTypeDropdownData();
  }
  async getMaterailNumberDropdownData(
    customerPickingPlantNumber: string,
    customerSalesOrganization: string,
    customerDistributionChannel: string,
    value: string,
  ) {
    return await this.getRepo().getMaterailNumberDropdownData(
      customerPickingPlantNumber,
      customerSalesOrganization,
      customerDistributionChannel,
      value,
    );
  }
  async getClaimsTypeDropdownData() {
    return await this.getRepo().getClaimsTypeDropdownData();
  }
  async getProductConditionDropdownData() {
    return await this.getRepo().getProductConditionDropdownData();
  }
  async getPriorityDropdownData() {
    return await this.getRepo().getPriorityDropdownData();
  }
}
