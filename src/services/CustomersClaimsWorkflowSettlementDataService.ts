import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {CustomersClaimsWorkflowSettlementDataRepo} from 'src/repo/CustomersClaimsWorkflowSettlementDataRepo';
import CustomersClaimsWorkflowSettlementData from 'src/storage/OfflineDBStorage/WmDB/models/CustomersClaimsWorkflowSettlementData';

export class CustomersClaimsWorkflowSettleDataService extends BaseApiService<
  CustomersClaimsWorkflowSettlementData,
  CustomersClaimsWorkflowSettlementDataRepo
> {
  private readonly customersClaimsWorkflowSettlementDataRepository: CustomersClaimsWorkflowSettlementDataRepo =
    new CustomersClaimsWorkflowSettlementDataRepo();

  getRepo(): CustomersClaimsWorkflowSettlementDataRepo {
    return this.customersClaimsWorkflowSettlementDataRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CUSTOMERS_CLAIMS_WORKFLOW_SETTLEMENT_DATA;
  }

  async deleteWorkflowSettlementData(idServiceRequestCustomer: string) {
    return await this.getRepo().deleteWorkflowSettlementData(
      idServiceRequestCustomer,
    );
  }

  async getGridFreeProducts(idServiceRequestCustomer: any) {
    return this.getRepo().getGridFreeProducts(idServiceRequestCustomer);
  }

  async createWorkFlowSettlementDetails(settlementData: any) {
    return await this.getRepo().createWorkFlowSettlementDetails(settlementData);
  }

  async insertCustomersClaimsWorkFlowSettlementData(claimDataObj: any) {
    return await this.getRepo().insertCustomersClaimsWorkFlowSettlementData(
      claimDataObj,
    );
  }
  async createPDByTASettlementDetails(settlementData: any) {
    return await this.getRepo().createPDByTASettlementDetails(settlementData);
  }
  async getPDClaimSettlementData(idServiceRequestCustomer: any) {
    return await this.getRepo().getPDClaimSettlementData(
      idServiceRequestCustomer,
    );
  }
}
