import ApiUtil from 'src/services/ApiUtil';
import {CustomersClaimsWorkflowClaimsDataService} from 'src/services/CustomersClaimsWorkflowClaimsDataService';
import {CustomersClaimsWorkflowHeaderService} from 'src/services/CustomersClaimsWorkflowHeaderService';
import {CustomersClaimsWorkflowSettleDataService} from 'src/services/CustomersClaimsWorkflowSettlementDataService';

import {CustomersService} from 'src/services/CustomersService';
import {MaterialHierarchyService} from 'src/services/MaterialHierarchyService';
import {MaterialsService} from 'src/services/MaterialsService';
import {SalesRepresentativesService} from 'src/services/SalesRepresentativesService';
import {ServiceRequestsCustomersService} from 'src/services/ServiceRequestsCustomersService';
import {TerritoriesHierarchyService} from 'src/services/TerritoriesHierarchyService';
import {TextsService} from 'src/services/TextsService';
import {TradeAssetsCustomersService} from 'src/services/TradeAssetsCustomersService';
import {END_POINTS} from 'src/utils/ApiEndpoints';
import {getDateLongString} from 'src/utils/CommonUtil';
import {toast} from 'src/utils/Util';

class ProductClaimController {
  // workflowHeader
  private customersClaimsWorkflowHeaderService: CustomersClaimsWorkflowHeaderService;
  private textsService: TextsService;
  // Claims Data
  private customersClaimsWorkflowClaimsDataService: CustomersClaimsWorkflowClaimsDataService;
  // Settlement Data
  private customersClaimsWorkflowSettleDataService: CustomersClaimsWorkflowSettleDataService;
  private materialService: MaterialsService;
  private territoriesHierarchyService: TerritoriesHierarchyService;
  private customersSerives: CustomersService;
  private salesRepresentativesService: SalesRepresentativesService;
  private serviceRequestCustomerService: ServiceRequestsCustomersService;
  private materialHierarchyService: MaterialHierarchyService;

  constructor() {
    this.materialService = new MaterialsService();
    this.textsService = new TextsService();
    this.territoriesHierarchyService = new TerritoriesHierarchyService();
    this.customersSerives = new CustomersService();
    this.materialHierarchyService = new MaterialHierarchyService();
    this.serviceRequestCustomerService = new ServiceRequestsCustomersService();
    this.customersClaimsWorkflowHeaderService =
      new CustomersClaimsWorkflowHeaderService();
    this.salesRepresentativesService = new SalesRepresentativesService();
    this.customersClaimsWorkflowClaimsDataService =
      new CustomersClaimsWorkflowClaimsDataService();
    this.customersClaimsWorkflowSettleDataService =
      new CustomersClaimsWorkflowSettleDataService();
  }
  async getProductClaimCustomerData(idServiceRequestCustomer: string) {
    return await this.customersClaimsWorkflowHeaderService.getProductClaimCustomerData(
      idServiceRequestCustomer,
    );
  }
  async getClaimsTypeDropdownData() {
    return await this.materialService.getClaimsTypeDropdownData();
  }
  async getPriorityDropdownData() {
    return await this.materialService.getPriorityDropdownData();
  }

  async getProductConditionDropdownData() {
    return await this.materialService.getProductConditionDropdownData();
  }
  async getSalesUnitTypeDropdownData() {
    return await this.materialService.getSalesUnitTypeDropdownData();
  }
  async getMaterailNumberDropdownData(
    customerPickingPlantNumber: string,
    customerSalesOrganization: string,
    customerDistributionChannel: string,
    value: string,
  ) {
    let ar = await this.materialService.getMaterailNumberDropdownData(
      customerPickingPlantNumber,
      customerSalesOrganization,
      customerDistributionChannel,
      value,
    );
    ar = await ar.map((item: any) => ({
      ...item,
      description: item?.description + '' ?? '',
      materialNumber: item?.materialNumber + '' ?? '',
    }));
    return ar;
  }
  async getMaterialProductGroup(
    materialHierarchyFromSapNode: string,
    materialHierarchyNode: string,
  ) {
    return await this.materialHierarchyService.getMaterialProductGroup(
      materialHierarchyFromSapNode,
      materialHierarchyNode,
    );
  }
  async getApprovedBy(value: string) {
    return await this.salesRepresentativesService.getApprovedBy(value);
  }
  async getClaimEnteredByData(idServiceRequestCustomer: string) {
    return await this.serviceRequestCustomerService.getClaimEnteredByData(
      idServiceRequestCustomer,
    );
  }
  async fetchCustomerDetail(
    customerShipTo: string,
    salesOrganisation: string,
    distributionChannel: string,
  ) {
    return await this.customersSerives.fetchCustomerDetail(
      customerShipTo,
      salesOrganisation,
      distributionChannel,
    );
  }
  async getSalesRepDetail(customerShipTo: string) {
    return await this.territoriesHierarchyService.getSalesRepDetail(
      customerShipTo,
    );
  }
  async getNetAmount(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
    materialNumber: string,
    quantity: string,
  ) {
    const isOnline = await ApiUtil.getAppDeviceOnlineStatus();
    if (!isOnline.status) {
      toast.info({
        message: isOnline.errMsg,
      });
      return {netamount: 0};
    } else {
      const PARAMETERS = `?pageNumber=1&pageSize=25&customerNumber=${customerShipTo}&salesOrganization=${salesOrganization}&distributionChannel=${distributionChannel}&materialNumber=${materialNumber}&quantity=${quantity}`;
      const BASE_API_URL = await this.materialService.getDefaultApiUrl();

      const URL = BASE_API_URL + END_POINTS.NET_AMOUNT + PARAMETERS;
      console.log('getNetAmount URL', URL);
      const response = await ApiUtil.callGetApi(URL);
      return response;
    }
    // const PARAMETERS = `?pageNumber=1&pageSize=25&customerShipTo=${customerShipTo}&salesOrganization=${salesOrganization}&distributionChannel=${distributionChannel}`;
  }
  async saveProductClaimData(
    idServiceRequestCustomer: string,
    productDetailData: any,
    productClaimData: any,
    customerShipTo: string,
    salesOrganisation: string,
    distributionChannel: string,
  ) {
    const deleteData = await this.deleteExistingData(idServiceRequestCustomer);
    if (!deleteData) {
      return false;
    }
    const createData = await this.createProductClaimData(
      idServiceRequestCustomer,
      productDetailData,
      productClaimData,
      customerShipTo,
      salesOrganisation,
      distributionChannel,
    );
    if (!createData) {
      return false;
    }
    return true;
  }
  async deleteExistingData(idServiceRequestCustomer: string) {
    const workflowHeader =
      await this.customersClaimsWorkflowHeaderService.deleteWorkflowHeaderData(
        idServiceRequestCustomer,
      );
    if (!workflowHeader) {
      console.log('workflowHeader');
      return false;
    }
    const ClaimData =
      await this.customersClaimsWorkflowClaimsDataService.deleteWorkflowClaimsData(
        idServiceRequestCustomer,
      );
    if (!ClaimData) {
      console.log('ClaimData');
      return false;
    }
    const SettlementData =
      await this.customersClaimsWorkflowSettleDataService.deleteWorkflowSettlementData(
        idServiceRequestCustomer,
      );
    if (!SettlementData) {
      console.log('SettlementData');
      return false;
    }
    return true;
  }
  async createProductClaimData(
    idServiceRequestCustomer: string,
    productDetailData: any,
    productClaimData: any,
    customerShipTo: string,
    salesOrganisation: string,
    distributionChannel: string,
  ) {
    const workflowHeader =
      await this.customersClaimsWorkflowHeaderService.createWorkFlowHeaderDetails(
        idServiceRequestCustomer,
        customerShipTo,
        salesOrganisation,
        distributionChannel,
      );
    if (!workflowHeader) {
      console.log('workflowHeader Create');
      return false;
    }

    let detailDataObject = {
      idServiceRequestCustomer: idServiceRequestCustomer,
      idCustomersClaimsWorkflowClaimsData: -1,
      materialNumber: productDetailData.materialNumber,
      batchCodeOrDeliveryDate: productDetailData.batchCode,
      bestBeforeDate: productDetailData.bestBeforDate,
      bestBeforeDateTime: productDetailData.bestBeforTime,
      quantityOfClaimedProducts: productDetailData.quantity,
      quantityOfClaimedProductsSalesUnits: productDetailData.salesUnit,
      reasonForClaim: productDetailData.claimType,
      conditionOfProduct: productDetailData.productCondition,
      descriptionClaimReason: productDetailData.claimDescription,
      claimedProductsAvailable: productDetailData.claimProductsAvl,
      foreignProductAvailable: 'foreignProductAvailable',
      feedbackRequestedFromCustomer: productDetailData.feedbackRequested,
      sentDatetime: null,
    };

    const ClaimData =
      await this.customersClaimsWorkflowClaimsDataService.createWorkFlowClaimsDetails(
        detailDataObject,
      );
    console.log('ClaimData Create', ClaimData);
    if (!ClaimData) {
      console.log('ClaimData Create failed', ClaimData);
      return false;
    }

    let claimDataObject = {
      idServiceRequestCustomer: idServiceRequestCustomer,
      idCustomersClaimsWorkflowSettlementData: -1,
      minorDamage: productClaimData.minorDamage,
      freeGoodNumber: productClaimData.freeGoodNumber,
      freeGoodQuantity: Number(productClaimData.freeGoodQuantity), //number
      freeGoodQuantitySalesUnits: productClaimData.freeGoodSalesUnit,
      freeGoodValue: Number(productClaimData.freeGoodValue), //number
      freeGoodApprover: productClaimData.approvedBy,
      claimId: productClaimData.claimNumber,
      priority: Number(productClaimData.priority), //number
      qualityTeamAnswerDate: productClaimData.dateOfAnswer,
      replyLetterToCustomer: productClaimData.replyLetter,
      productsDestroyed: productClaimData.alreadyDestroyed,
      customerDestructionInfoDate:
        productClaimData.notifiedProductDestructionDate,
      productPickupNecessary: productClaimData.pickupNecessary,
      productPickupDate: productClaimData.pickUpDate,
      sentDatetime: null,
    };
    const SettlementData =
      await this.customersClaimsWorkflowSettleDataService.createWorkFlowSettlementDetails(
        claimDataObject,
      );
    console.log('SettlementData Create', SettlementData);
    if (!SettlementData) {
      console.log('SettlementData Create failed', SettlementData);
      return false;
    }
    return true;
  }
  async getTextsValue() {
    return await this.textsService.getTextsValue('MSG_SEND_PHOTOS');
  }
}

export default new ProductClaimController();
