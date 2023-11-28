import ApiUtil from 'src/services/ApiUtil';
import {CustomersClaimsWorkflowClaimsDataService} from 'src/services/CustomersClaimsWorkflowClaimsDataService';
import {CustomersClaimsWorkflowHeaderService} from 'src/services/CustomersClaimsWorkflowHeaderService';
import {CustomersClaimsWorkflowSettleDataService} from 'src/services/CustomersClaimsWorkflowSettlementDataService';
import {CustomersService} from 'src/services/CustomersService';
import {MaterialHierarchyService} from 'src/services/MaterialHierarchyService';
import {MaterialsService} from 'src/services/MaterialsService';
import {RegionalDistributionCentersService} from 'src/services/RegionalDistributionCentersService';
import {SalesRepresentativesService} from 'src/services/SalesRepresentativesService';
import {ServiceRequestsCustomersService} from 'src/services/ServiceRequestsCustomersService';
import {TerritoriesHierarchyService} from 'src/services/TerritoriesHierarchyService';
import {TradeAssetsCustomersService} from 'src/services/TradeAssetsCustomersService';
import {END_POINTS} from 'src/utils/ApiEndpoints';
import {CLAIMS_MATERIAL_TYPES} from 'src/utils/DbConst';
import {toast} from 'src/utils/Util';

async function padStringWithZeros(inputString: string = '') {
  const targetLength = 18;
  const currentLength = (inputString + '').length;

  if (currentLength >= targetLength) {
    return inputString;
  }

  const numberOfZerosToAdd = targetLength - currentLength;
  const paddedString = await ('0'.repeat(numberOfZerosToAdd) + inputString);
  console.log(paddedString, 'inpt', numberOfZerosToAdd, inputString);
  return paddedString;
}
class TAProductDetailController {
  private customersClaimsWorkflowHeaderService: CustomersClaimsWorkflowHeaderService;
  private customersClaimsWorkflowSettleDataService: CustomersClaimsWorkflowSettleDataService;
  private serviceRequestsCustomersService: ServiceRequestsCustomersService;
  private customersClaimsWorkflowClaimsDataService: CustomersClaimsWorkflowClaimsDataService;
  private tradeAssetsCustomersService: TradeAssetsCustomersService;
  private materialService: MaterialsService;
  private materialHierarchyService: MaterialHierarchyService;
  private regionalDistributionCentersService: RegionalDistributionCentersService;
  private salesRepresentativesService: SalesRepresentativesService;
  private territoriesHierarchyService: TerritoriesHierarchyService;
  private customersSerives: CustomersService;

  constructor() {
    this.serviceRequestsCustomersService =
      new ServiceRequestsCustomersService();
    this.tradeAssetsCustomersService = new TradeAssetsCustomersService();
    this.materialService = new MaterialsService();
    this.customersClaimsWorkflowClaimsDataService =
      new CustomersClaimsWorkflowClaimsDataService();
    this.materialHierarchyService = new MaterialHierarchyService();
    this.regionalDistributionCentersService =
      new RegionalDistributionCentersService();
    this.salesRepresentativesService = new SalesRepresentativesService();
    this.customersClaimsWorkflowHeaderService =
      new CustomersClaimsWorkflowHeaderService();
    this.customersClaimsWorkflowSettleDataService =
      new CustomersClaimsWorkflowSettleDataService();
    this.territoriesHierarchyService = new TerritoriesHierarchyService();
    this.customersSerives = new CustomersService();
  }

  async checkWorkflowExists(idServiceRequestCustomer: any) {
    return await this.serviceRequestsCustomersService.checkWorkflowExists(
      idServiceRequestCustomer + '',
    );
  }
  async getPDClaimSettlementData(idServiceRequestCustomer: any) {
    return await this.customersClaimsWorkflowSettleDataService.getPDClaimSettlementData(
      idServiceRequestCustomer,
    );
  }
  // to get the online trade assets
  async getOnlineTradeAssets(
    pageNumber: number,
    pageSize: number,
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    const isOnline = await ApiUtil.getAppDeviceOnlineStatus();
    if (!isOnline.status) {
      toast.info({
        message: isOnline.errMsg,
      });
      return [];
    } else {
      return await this.tradeAssetsCustomersService.getCustomerTradeAssetsOnline(
        customerShipTo,
        salesOrganization,
        distributionChannel,
      );
    }
  }
  // to get the online iced trade assets
  async getIcedTradeAssetsOnline(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
    idServiceRequestCustomer: string,
  ) {
    const isOnline = await ApiUtil.getAppDeviceOnlineStatus();
    if (!isOnline.status) {
      toast.info({
        message: isOnline.errMsg,
      });
      return [];
    } else {
      return await this.tradeAssetsCustomersService.getIcedTradeAssetsOnline(
        customerShipTo,
        salesOrganization,
        distributionChannel,
        idServiceRequestCustomer,
      );
    }
  }
  // to get the online orderline trade assets
  async getOnlineOrderlinesProducts(orderNumber: string) {
    const isOnline = await ApiUtil.getAppDeviceOnlineStatus();
    if (!isOnline.status) {
      toast.info({
        message: isOnline.errMsg,
      });
      return [];
    } else {
      return await this.tradeAssetsCustomersService.getOnlineOrderlinesroducts(
        orderNumber,
      );
    }
  }
  // to get the offline trade assets
  async getServiceWorkflowOfflineTradeAssets(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
    idServiceRequestCustomer: string,
  ) {
    return await this.tradeAssetsCustomersService.getServiceWorkflowOfflineTradeAssets(
      customerShipTo,
      salesOrganization,
      distributionChannel,
      idServiceRequestCustomer,
    );
  }
  async getOfflineIcedProducts(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
    idServiceRequestCustomer: string,
  ) {
    return await this.customersClaimsWorkflowClaimsDataService.getOfflineIcedProducts(
      customerShipTo,
      salesOrganization,
      distributionChannel,
      idServiceRequestCustomer,
    );
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
    return await this.materialService.getMaterailNumberDropdownData(
      customerPickingPlantNumber,
      customerSalesOrganization,
      customerDistributionChannel,
      value,
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
  async getMaterialProductGroup(
    materialHierarchyFromSapNode: string,
    materialHierarchyNode: string,
  ) {
    return await this.materialHierarchyService.getMaterialProductGroup(
      materialHierarchyFromSapNode,
      materialHierarchyNode,
    );
  }
  async getRDCNumber() {
    return await this.regionalDistributionCentersService.getRDCNumber();
  }
  async getApprovedBy(value: string) {
    return await this.salesRepresentativesService.getApprovedBy(value);
  }
  async saveProductClaimData(
    idServiceRequestCustomer: string,
    customerShipTo: string,
    salesOrganisation: string,
    distributionChannel: string,
    settlementData: any,
    tradeAssetList: any,
    icedProductListData: any,
    otherProductListData: any,
  ) {
    const deleteData = await this.deleteExistingData(idServiceRequestCustomer);
    if (!deleteData) {
      return false;
    }
    console.log(deleteData, 'deleteData');

    const createData = await this.createProductClaimData(
      idServiceRequestCustomer,
      customerShipTo,
      salesOrganisation,
      distributionChannel,
      settlementData,
      tradeAssetList,
      icedProductListData,
      otherProductListData,
    );
    if (!createData) {
      return false;
    }
    console.log(createData, 'createData');
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
    customerShipTo: string,
    salesOrganisation: string,
    distributionChannel: string,
    settlementData: any,
    tradeAssetList: any,
    icedProductListData: any,
    otherProductListData: any,
  ) {
    const workflowHeader =
      await this.customersClaimsWorkflowHeaderService.createWorkFlowHeaderDetails(
        idServiceRequestCustomer,
        customerShipTo,
        salesOrganisation,
        distributionChannel,
      );
    if (!workflowHeader) {
      console.log('workflowHeader Create error');
      return false;
    }

    // trade assets
    if (tradeAssetList && tradeAssetList.length > 0) {
      let flag = true;
      await tradeAssetList.forEach(async (element: any) => {
        if (element.selection) {
          let materialNo =
            (await padStringWithZeros(element?.materialNumber)) + '';
          const TradeAssetDataObj = {
            idServiceRequestCustomer: idServiceRequestCustomer + '',
            idCustomersClaimsWorkflowClaimsData: '1',
            materialNumber: materialNo + '',
            quantityOfClaimedProducts: '',
            quantityOfClaimedProductsSalesUnits: '',
            claimSettlementProductType: CLAIMS_MATERIAL_TYPES.TA_MATERIALS,
            equipmentNumber: element.equipmentNumber,
            netAmount: '0',
            sentDatetime: null,
          };

          const TradeAssetData =
            await this.customersClaimsWorkflowClaimsDataService.createWorkFlowClaimsDetailsPDByTA(
              TradeAssetDataObj,
            );
          // console.log(TradeAssetData, productGroup, 'TradeAssetDataObj');
          if (!TradeAssetData) {
            flag = false;
            console.log('tradeAsset Create failed', TradeAssetData);
            return false;
          }
        }
      });

      if (!flag) {
        console.log('tradeAssetRes Create error');
        return !flag;
      }
    }

    // icedProducts
    if (icedProductListData && icedProductListData.length > 0) {
      let flag = true;
      await icedProductListData.forEach(async (element: any) => {
        if (element.quantity && element.quantity > 0) {
          let materialNo =
            (await padStringWithZeros(element?.materialNumber)) + '';
          const icedProductListDataObj = {
            idServiceRequestCustomer: idServiceRequestCustomer + '',
            idCustomersClaimsWorkflowClaimsData: '1',
            materialNumber: materialNo + '',
            quantityOfClaimedProducts: element?.quantity ?? '',
            quantityOfClaimedProductsSalesUnits: element?.salesUnit ?? '',
            claimSettlementProductType: CLAIMS_MATERIAL_TYPES.ICE_PRODUCTS,
            equipmentNumber: null,
            netAmount: element?.price ?? '' + '',
            sentDatetime: null,
          };

          const icedProductListData =
            await this.customersClaimsWorkflowClaimsDataService.createWorkFlowClaimsDetailsPDByTA(
              icedProductListDataObj,
            );
          // console.log(icedProductListData, productGroup, 'icedProductListDataObj');
          if (!icedProductListData) {
            flag = false;
            console.log('tradeAsset Create failed', icedProductListData);
            return false;
          }
        }
      });

      if (!flag) {
        console.log('tradeAssetRes Create error');
        return !flag;
      }
    }

    // other products
    if (otherProductListData && otherProductListData.length > 0) {
      let flag = true;
      await otherProductListData.forEach(async (element: any) => {
        if (element.quantity && element.quantity > 0) {
          let materialNo =
            (await padStringWithZeros(element?.materialNumber)) + '';
          const otherProductListDataObj = {
            idServiceRequestCustomer: idServiceRequestCustomer + '',
            idCustomersClaimsWorkflowClaimsData: '1',
            materialNumber: materialNo,
            quantityOfClaimedProducts: element?.quantity ?? '',
            quantityOfClaimedProductsSalesUnits: element?.salesUnit ?? '',
            claimSettlementProductType: CLAIMS_MATERIAL_TYPES.BLOCKED_PRODUCTS,
            netAmount: element?.price ?? '' + '',
            sentDatetime: null,
          };

          const otherProductListData =
            await this.customersClaimsWorkflowClaimsDataService.createWorkFlowClaimsDetailsBlockedProducts(
              otherProductListDataObj,
            );
          console.log(
            otherProductListData,
            otherProductListDataObj,
            'TradeAssetDataObj',
          );
          if (!otherProductListData) {
            flag = false;
            console.log(
              'otherProductListData Create failed',
              otherProductListData,
            );
            return false;
          }
        }
      });

      if (!flag) {
        console.log('tradeAssetRes Create error');
        return !flag;
      }
    }

    const settlementDataObj = {
      idServiceRequestCustomer: idServiceRequestCustomer,
      idCustomersClaimsWorkflowSettlementData: '1',

      settlementDoneBy: settlementData?.settlementDoneBy ?? '',
      freeGoodApprover: settlementData?.approvedBy ?? '',
      rdcNumber: settlementData?.rdc + '',
      taReportRequestDate: settlementData?.requestDateTechnical ?? '',
      taServiceTechnicianRequestDate: settlementData?.requestDateTA ?? '',
      netValueOfProductDestroyed: settlementData?.totalNetValue ?? '' + '',
      refundPercentage: settlementData?.refund ?? '',
      defectStatus: settlementData?.defectStatus ?? '',
      settlementStatus: settlementData?.settlementDone ?? '',
      notes: settlementData?.notes ?? '',
      sentDatetime: null,
    };

    const SettlementData =
      await this.customersClaimsWorkflowSettleDataService.createPDByTASettlementDetails(
        settlementDataObj,
      );
    if (!SettlementData) {
      console.log('Settlement Data Create failed', SettlementData);
      return false;
    }

    return true;
  }
  async getClaimEnteredByData(idServiceRequestCustomer: string) {
    return await this.serviceRequestsCustomersService.getClaimEnteredByData(
      idServiceRequestCustomer,
    );
  }
  async getGridBlockedroducts(idServiceRequestCustomer: string) {
    return await this.customersClaimsWorkflowClaimsDataService.getGridBlockedroducts(
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
}

export default new TAProductDetailController();
