import {ClaimsConfigurationsService} from 'src/services/ClaimsConfigurationsService';
import {CustomersClaimsWorkflowClaimsDataService} from 'src/services/CustomersClaimsWorkflowClaimsDataService';
import {CustomersClaimsWorkflowHeaderService} from 'src/services/CustomersClaimsWorkflowHeaderService';
import {CustomersClaimsWorkflowSettleDataService} from 'src/services/CustomersClaimsWorkflowSettlementDataService';
import {MaterialsService} from 'src/services/MaterialsService';
import {OrdersService} from 'src/services/OrdersService';
import {SalesRepresentativesService} from 'src/services/SalesRepresentativesService';

class DeliveryMistakeClaimsController {
  private ordersService: OrdersService;
  private materialService: MaterialsService;
  private salesRepresentativeService: SalesRepresentativesService;
  private claimsConfigurationService: ClaimsConfigurationsService;
  private customerClaimsWorkflowHeaderService: CustomersClaimsWorkflowHeaderService;
  private customerClaimsWorkflowClaimsDataService: CustomersClaimsWorkflowClaimsDataService;
  private customersClaimsWorkflowSettleDataService: CustomersClaimsWorkflowSettleDataService;

  constructor() {
    this.ordersService = new OrdersService();
    this.materialService = new MaterialsService();
    this.salesRepresentativeService = new SalesRepresentativesService();
    this.claimsConfigurationService = new ClaimsConfigurationsService();
    this.customerClaimsWorkflowHeaderService =
      new CustomersClaimsWorkflowHeaderService();
    this.customerClaimsWorkflowClaimsDataService =
      new CustomersClaimsWorkflowClaimsDataService();
    this.customersClaimsWorkflowSettleDataService =
      new CustomersClaimsWorkflowSettleDataService();
  }

  // get claims order list
  async getClaimsOrderLists(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    return await this.ordersService.getClaimsOrderLists(
      customerShipTo,
      salesOrganization,
      distributionChannel,
    );
  }

  // get material number data
  async getMaterailNumberDropdownData(
    customerPickingPlantNumber: string,
    customerSalesOrganization: string,
    customerDistributionChannel: string,
    value: string,
  ) {
    return await this.materialService.getMaterailNumberDropdownData(
      customerPickingPlantNumber,
      customerSalesOrganization,
      customerDistributionChannel,
      value,
    );
  }

  // get claims order list lines
  async getClaimsOrderListLines(orderNumber: any) {
    return await this.ordersService.getClaimsOrderListLines(orderNumber);
  }

  // get dropdown value of sales unit
  async getSalesUnitTypeDropdownData() {
    return await this.materialService.getSalesUnitTypeDropdownData();
  }

  // get approved by dropdown data
  async getApprovedBy(value: string) {
    return await this.salesRepresentativeService.getApprovedBy(value);
  }

  // get delivery claim reason
  async getDeliveryClaimReason(claimsConfigCode: string) {
    return await this.claimsConfigurationService.getDeliveryClaimReason(
      claimsConfigCode,
    );
  }

  // get delivery mistake claims data population
  async getDeliveryMistakeClaimsDataPopulation(
    serviceRequestCustomerId: string,
  ) {
    return await this.customerClaimsWorkflowHeaderService.getDeliveryMistakeClaimsDataPopulation(
      serviceRequestCustomerId,
    );
  }

  // get grid delivered product list
  async getGridUndeliveredProducts(idServiceRequestCustomer: any) {
    return await this.customerClaimsWorkflowClaimsDataService.getGridUndeliveredProducts(
      idServiceRequestCustomer,
    );
  }

  // get grid instead delivered product list
  async getGridInsteadDeliveredProducts(idServiceRequestCustomer: any) {
    return await this.customerClaimsWorkflowClaimsDataService.getGridInsteadDeliveredProducts(
      idServiceRequestCustomer,
    );
  }

  // get grid free products
  async getGridFreeProducts(idServiceRequestCustomer: any) {
    return await this.customersClaimsWorkflowSettleDataService.getGridFreeProducts(
      idServiceRequestCustomer,
    );
  }

  // delete workflow header data
  async deleteWorkflowHeaderData(idServiceRequestCustomer: string) {
    return await this.customerClaimsWorkflowHeaderService.deleteWorkflowHeaderData(
      idServiceRequestCustomer,
    );
  }

  // delete workflow claims data
  async deleteWorkflowClaimsData(idServiceRequestCustomer: string) {
    return await this.customerClaimsWorkflowClaimsDataService.deleteWorkflowClaimsData(
      idServiceRequestCustomer,
    );
  }

  // delete workflow settlement data
  async deleteWorkflowSettlementData(idServiceRequestCustomer: string) {
    return await this.customersClaimsWorkflowSettleDataService.deleteWorkflowSettlementData(
      idServiceRequestCustomer,
    );
  }

  // insert customer claims workflow header
  async insertCustomersClaimsWorkFlowHeader(
    idServiceRequestCustomer: string,
    customerShipTo: any,
    salesOrganization: any,
    distributionChannel: any,
    sapDocumentNumber: any,
    completeDelivery: any,
  ) {
    return await this.customerClaimsWorkflowHeaderService.insertCustomersClaimsWorkFlowHeader(
      idServiceRequestCustomer,
      customerShipTo,
      salesOrganization,
      distributionChannel,
      sapDocumentNumber,
      completeDelivery,
    );
  }

  // insert customer claims workflow claims data
  async insertCustomersClaimsWorkFlowClaimsData(claimDataObj: any) {
    await this.customerClaimsWorkflowClaimsDataService.insertCustomersClaimsWorkFlowClaimsData(
      claimDataObj,
    );
  }

  // insert customer claim workflow settlement data
  async insertCustomersClaimsWorkFlowSettlementData(claimDataObj: any) {
    return await this.customersClaimsWorkflowSettleDataService.insertCustomersClaimsWorkFlowSettlementData(
      claimDataObj,
    );
  }
}
export default new DeliveryMistakeClaimsController();
