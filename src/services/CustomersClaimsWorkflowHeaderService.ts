import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import CustomersClaimsWorkflowHeader from 'src/storage/OfflineDBStorage/WmDB/models/CustomersClaimsWorkflowHeader';
import {CustomersClaimsWorkflowHeaderRepo} from 'src/repo/CustomersClaimsWorkflowHeaderRepo';

export class CustomersClaimsWorkflowHeaderService extends BaseApiService<
  CustomersClaimsWorkflowHeader,
  CustomersClaimsWorkflowHeaderRepo
> {
  private readonly customersClaimsWorkflowHeaderRepository: CustomersClaimsWorkflowHeaderRepo =
    new CustomersClaimsWorkflowHeaderRepo();

  getRepo(): CustomersClaimsWorkflowHeaderRepo {
    return this.customersClaimsWorkflowHeaderRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CUSTOMERS_CLAIMS_WORKFLOW_HEADER;
  }

  async deleteWorkflowHeaderData(idServiceRequestCustomer: string) {
    return await this.getRepo().deleteWorkflowHeaderData(
      idServiceRequestCustomer,
    );
  }

  async getDeliveryMistakeClaimsDataPopulation(
    serviceRequestCustomerId: string,
  ) {
    return await this.getRepo().getDeliveryMistakeClaimsDataPopulation(
      serviceRequestCustomerId,
    );
  }
  /********* Need to confirm that last function already created  *********/
  async insertCustomersClaimsWorkFlowHeader(
    idServiceRequestCustomer: string,
    customerShipTo: any,
    salesOrganisation: any,
    distributionChannel: any,
    orderNumber: any,
    completeDelivery: any,
  ) {
    return await this.getRepo().insertCustomersClaimsWorkFlowHeader(
      idServiceRequestCustomer,
      customerShipTo,
      salesOrganisation,
      distributionChannel,
      orderNumber,
      completeDelivery,
    );
  }

  async getProductClaimCustomerData(idServiceRequestCustomer: string) {
    return await this.getRepo().getProductClaimCustomerData(
      idServiceRequestCustomer,
    );
  }
  async createWorkFlowHeaderDetails(
    idServiceRequestCustomer: string,
    customerShipTo: string,
    salesOrganisation: string,
    distributionChannel: string,
  ) {
    return await this.getRepo().createWorkFlowHeaderDetails(
      idServiceRequestCustomer,
      customerShipTo,
      salesOrganisation,
      distributionChannel,
    );
  }
}
