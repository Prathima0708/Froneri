import BaseApiService from './BaseApiService';
import SalesRepresentatives from 'src/storage/OfflineDBStorage/WmDB/models/SalesRepresentatives';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {SalesRepresentativesRepo} from 'src/repo/SalesRepresentativesRepo';

export class SalesRepresentativesService extends BaseApiService<
  SalesRepresentatives,
  SalesRepresentativesRepo
> {
  private readonly salesRepreseRepository: SalesRepresentativesRepo =
    new SalesRepresentativesRepo();

  getRepo(): SalesRepresentativesRepo {
    return this.salesRepreseRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.SALES_REPRESENTATIVES;
  }

  async findLoggedInSalesRepInfo(emp_no: string) {
    return await this.getRepo().findLoggedInSalesRepInfo(emp_no);
  }

  async getDelegatedUserIdTerritory(emp_no: string) {
    return await this.getRepo().getDelegatedUserIdTerritory(emp_no);
  }

  async getPreviousCustomerEmployeeNumber(
    prevCustomerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    return await this.getRepo().getPreviousCustomerEmployeeNumber(
      prevCustomerShipTo,
      salesOrganization,
      distributionChannel,
    );
  }

  async getCanvasser(employeeNumber: string) {
    return await this.getRepo().getCanvasser(employeeNumber);
  }

  async getCanvasserSalesRep() {
    return await this.getRepo().getCanvasserSalesRep();
  }
  async getApprovedBy(value: string) {
    return await this.getRepo().getApprovedBy(value);
  }
}
