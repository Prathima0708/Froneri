import {CustomersService} from 'src/services/CustomersService';
import {DiscoveryService} from 'src/services/DiscoveryService';
import {EmployeesService} from 'src/services/EmployeesService';
import {RegionalDistributionCentersService} from 'src/services/RegionalDistributionCentersService';
import {ServiceRequestTypesService} from 'src/services/ServiceRequestTypesService';
import {ServiceRequestsCustomersJournalService} from 'src/services/ServiceRequestsCustomersJournalService';
import {ServiceRequestsCustomersService} from 'src/services/ServiceRequestsCustomersService';
import {TradeAssetsCustomersService} from 'src/services/TradeAssetsCustomersService';
import {TransShipmentPointsService} from 'src/services/TransShipmentPointsService';
import {PROSPECT_STATUS_TITLE} from 'src/utils/Constant';
import {PROSPECTS_TYPE, STATUS_TYPES} from 'src/utils/DbConst';

class ServiceWorkflowController {
  private serviceRequestTypesService: ServiceRequestTypesService;
  private employeesService: EmployeesService;
  private serviceRequestsCustomersService: ServiceRequestsCustomersService;
  private customersService: CustomersService;
  private discoveryService: DiscoveryService;
  private transShipmentPointsService: TransShipmentPointsService;
  private serviceRequestsCustomersJournalService: ServiceRequestsCustomersJournalService;
  private tradeAssetsCustomersService: TradeAssetsCustomersService;
  private regionalDistributionCentersService: RegionalDistributionCentersService;

  constructor() {
    this.serviceRequestTypesService = new ServiceRequestTypesService();
    this.employeesService = new EmployeesService();
    this.serviceRequestsCustomersService =
      new ServiceRequestsCustomersService();
    this.customersService = new CustomersService();
    this.discoveryService = new DiscoveryService();
    this.transShipmentPointsService = new TransShipmentPointsService();
    this.serviceRequestsCustomersJournalService =
      new ServiceRequestsCustomersJournalService();
    this.tradeAssetsCustomersService = new TradeAssetsCustomersService();
    this.regionalDistributionCentersService =
      new RegionalDistributionCentersService();
  }

  async getServiceRequestTypeDropdownData(
    searchText: string = '',
    idServiceRequestType: string = '',
  ) {
    return await this.serviceRequestTypesService.getServiceRequestTypeDropdownData(
      searchText,
      idServiceRequestType,
    );
  }

  async getResponsiblePersonAndCreatorList(searchText: string = '') {
    return await this.employeesService.getResponsiblePersonAndCreatorList(
      searchText,
    );
  }

  async getServiceWorkflowListing(
    start: number,
    limit: number,
    statusType: string,
    filterObj: any,
  ) {
    return await this.serviceRequestsCustomersService.getServiceWorkflowListing(
      start,
      limit,
      statusType,
      filterObj,
    );
  }

  async checkIsRemoteCustomerOrProspect(customerData: any) {
    let isRemote = false;

    if (
      customerData?.customerStatusCode &&
      customerData.customerStatusCode === STATUS_TYPES.CUSTOMER
    ) {
      isRemote = await this.customersService.checkIsRemoteCustomer(
        customerData.customerShipTo,
        customerData.salesOrganization,
        customerData.distributionChannel,
      );
    } else {
      isRemote = await this.discoveryService.checkIsRemoteProspect(
        customerData.customerShipTo,
      );
    }

    return isRemote;
  }

  async deleteServiceWorkflowData(customerData: any) {
    return await this.serviceRequestsCustomersService.deleteServiceWorkflowData(
      customerData.deleteServiceWorkflowData,
    );
  }

  async getServiceWorkflowDataOfCustomer(idServiceRequestCustomer: any) {
    return await this.serviceRequestsCustomersService.getServiceWorkflowDataOfCustomer(
      idServiceRequestCustomer,
    );
  }

  async getPlantDescriptionOfCustomer(pickingPlantNumber: any) {
    const plantNameData =
      await this.transShipmentPointsService.getPlantDescriptionOfCustomer(
        pickingPlantNumber,
      );

    if (plantNameData && plantNameData.length > 0) {
      return plantNameData;
    }

    return await this.regionalDistributionCentersService.getPlantDescriptionFromRDC(
      pickingPlantNumber,
    );
  }

  async getTraceGridDataOfCustomer(idServiceRequestCustomer: any) {
    return await this.serviceRequestsCustomersJournalService.getTraceGridDataOfCustomer(
      idServiceRequestCustomer,
    );
  }

  async getServiceWorkflowTradeAssets(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
    start: number,
    limit: number,
    searchText: string,
  ) {
    return await this.tradeAssetsCustomersService.getServiceWorkflowTradeAssets(
      customerShipTo,
      salesOrganization,
      distributionChannel,
      start,
      limit,
      searchText,
    );
  }

  async getClaimsLayoutDropdownData(idServiceRequestType: any) {
    return await this.serviceRequestTypesService.getClaimsLayoutDropdownData(
      idServiceRequestType,
    );
  }

  async updateSendReportStatus(idServiceRequestType: any) {
    return await this.serviceRequestsCustomersService.updateSendReportStatus(
      idServiceRequestType,
    );
  }
}

export default new ServiceWorkflowController();
