import BaseApiService from './BaseApiService';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import CustomersClaimsWorkflowClaimsData from 'src/storage/OfflineDBStorage/WmDB/models/CustomersClaimsWorkflowClaimsData';
import {CustomersClaimsWorkflowClaimsDataRepo} from 'src/repo/CustomersClaimsWorkflowClaimsDataRepo';

export class CustomersClaimsWorkflowClaimsDataService extends BaseApiService<
  CustomersClaimsWorkflowClaimsData,
  CustomersClaimsWorkflowClaimsDataRepo
> {
  private readonly customersClaimsWorkflowClaimsRepository: CustomersClaimsWorkflowClaimsDataRepo =
    new CustomersClaimsWorkflowClaimsDataRepo();

  getRepo(): CustomersClaimsWorkflowClaimsDataRepo {
    return this.customersClaimsWorkflowClaimsRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CUSTOMERS_CLAIMS_WORKFLOW_CLAIMS_DATA;
  }

  async deleteWorkflowClaimsData(idServiceRequestCustomer: string) {
    return await this.getRepo().deleteWorkflowClaimsData(
      idServiceRequestCustomer,
    );
  }
  async getOfflineIcedProducts(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
    idServiceRequestCustomer: string,
  ) {
    return await this.getRepo().fetchIcedProducts(
      customerShipTo,
      salesOrganization,
      distributionChannel,
      idServiceRequestCustomer,
    );
  }

  async getGridUndeliveredProducts(idServiceRequestCustomer: any) {
    return this.getRepo().getGridUndeliveredProducts(idServiceRequestCustomer);
  }

  async getGridInsteadDeliveredProducts(idServiceRequestCustomer: any) {
    return await this.getRepo().getGridInsteadDeliveredProducts(
      idServiceRequestCustomer,
    );
  }

  async insertCustomersClaimsWorkFlowClaimsData(claimDataObj: any) {
    return await this.getRepo().insertCustomersClaimsWorkFlowClaimsData(
      claimDataObj,
    );
  }

  async createWorkFlowClaimsDetails(claimDataObject: any) {
    return await this.getRepo().createWorkFlowClaimsDetails(claimDataObject);
  }
  async createWorkFlowClaimsDetailsPDByTA(claimDataObject: any) {
    return await this.getRepo().createWorkFlowClaimsDetailsPDByTA(
      claimDataObject,
    );
  }
  async createWorkFlowClaimsDetailsBlockedProducts(claimDataObject: any) {
    return await this.getRepo().createWorkFlowClaimsDetailsBlockedProducts(
      claimDataObject,
    );
  }
  async getGridBlockedroducts(idServiceRequestCustomer: any) {
    return await this.getRepo().getGridBlockedroducts(idServiceRequestCustomer);
  }
}
