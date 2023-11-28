import BaseApiService from './BaseApiService';
import ServiceRequestsCustomers from 'src/storage/OfflineDBStorage/WmDB/models/ServiceRequestsCustomers';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {ServiceRequestsCustomersRepo} from 'src/repo/ServiceRequestsCustomersRepo';
import {END_POINTS} from 'src/utils/ApiEndpoints';
import ApiUtil from './ApiUtil';

export class ServiceRequestsCustomersService extends BaseApiService<
  ServiceRequestsCustomers,
  ServiceRequestsCustomersRepo
> {
  private readonly repo: ServiceRequestsCustomersRepo =
    new ServiceRequestsCustomersRepo();

  getRepo(): ServiceRequestsCustomersRepo {
    return this.repo;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.SERVICE_REQUESTS_CUSTOMERS;
  }

  async getWorkflowOfCustomersAssignedToConnectedUser() {
    return await this.getRepo().getWorkflowOfCustomersAssignedToConnectedUser();
  }

  async getWorkflowOfProspectsAssignedToConnectedUser() {
    return await this.getRepo().getWorkflowOfProspectsAssignedToConnectedUser();
  }

  async getWorkflowOfCountFromLocalInCaseOfFSR() {
    return await this.getRepo().getWorkflowOfCountFromLocalInCaseOfFSR();
  }

  async getWorkflowOfCustomerCreatedByConnectedUser() {
    return await this.getRepo().getWorkflowOfCustomerCreatedByConnectedUser();
  }

  async getWorkflowOfProspectsCreatedByConnectedUser() {
    return await this.getRepo().getWorkflowOfProspectsCreatedByConnectedUser();
  }

  async getOpenWorkflowOfCountFromLocalInCaseOfFSR() {
    return await this.getRepo().getOpenWorkflowOfCountFromLocalInCaseOfFSR();
  }

  async getOpenRequestAssignedToMeCount() {
    const workflowOfCustomersData =
      await this.getWorkflowOfCustomersAssignedToConnectedUser();
    const workflowOfProspectsData =
      await this.getWorkflowOfProspectsAssignedToConnectedUser();
    const workflowofCountFromLocalInCaseOfFSRData =
      await this.getWorkflowOfCountFromLocalInCaseOfFSR();

    const mergedData = [
      ...workflowOfCustomersData,
      ...workflowOfProspectsData,
      ...workflowofCountFromLocalInCaseOfFSRData,
    ];

    // Removing duplicates with unique id_service_request_customer;
    const filteredDataObj = mergedData.reduce((acc, curr) => {
      if (!acc[curr.id_service_request_customer]) {
        acc[curr.id_service_request_customer] = curr;
      }
      return acc;
    }, {});

    const filteredOpenRequestAssignedToMeData = Object.values(filteredDataObj);

    return filteredOpenRequestAssignedToMeData.length;
  }

  async getOpenRequestCreatedByMeCount() {
    const workflowOfCustomersData =
      await this.getWorkflowOfCustomerCreatedByConnectedUser();
    const workflowOfProspectsData =
      await this.getWorkflowOfProspectsCreatedByConnectedUser();
    const openWorkflowofCountFromLocalInCaseOfFSRData =
      await this.getOpenWorkflowOfCountFromLocalInCaseOfFSR();

    const mergedData = [
      ...workflowOfCustomersData,
      ...workflowOfProspectsData,
      ...openWorkflowofCountFromLocalInCaseOfFSRData,
    ];

    // Removing duplicates with unique id_service_request_customer;
    const filteredDataObj = mergedData.reduce((acc, curr) => {
      if (!acc[curr.id_service_request_customer]) {
        acc[curr.id_service_request_customer] = curr;
      }
      return acc;
    }, {});

    const filteredOpenRequestAssignedToMeData = Object.values(filteredDataObj);

    return filteredOpenRequestAssignedToMeData.length;
  }

  async getOpenServiceWorkflowCount(customerShipTo: string) {
    return await this.getRepo().getOpenWorkflowOfCustomerFromLocal(
      customerShipTo,
    );
  }

  async getOpenWorkflowOfCustomerFromOnline(customerShipTo: string) {
    const PARAMETERS = `?customernumber=${customerShipTo}&status=0`;
    // const PARAMETERS = `?customernumber=0020304394&status=0`;
    const BASE_API_URL = await this.getDefaultApiUrl();
    const URL =
      BASE_API_URL + END_POINTS.OPEN_SERVICE_REQUEST_COUNT + PARAMETERS;

    const response = await ApiUtil.callGetApi(URL);

    return response.serviceRequestCount;
  }

  async insertTaRequestServiceData(
    tradeAssetId: string,
    previousCustomerShipTo: string,
  ) {
    return await this.getRepo().insertTaRequestServiceData(
      tradeAssetId,
      previousCustomerShipTo,
    );
  }

  async updateTaRequestServiceData(tradeAssetId: string, description: string) {
    return await this.getRepo().updateTaRequestServiceData(
      tradeAssetId,
      description,
    );
  }

  async getServiceRequestForFinalize(tradeAssetId: string) {
    return await this.getRepo().getServiceRequestForFinalize(tradeAssetId);
  }

  async getServiceWorkflowListing(
    start: number,
    limit: number,
    statusType: string,
    filterObj: any,
  ) {
    return await this.getRepo().getServiceWorkflowListing(
      start,
      limit,
      statusType,
      filterObj,
    );
  }

  async deleteServiceWorkflowData(idServiceRequestCustomer: string) {
    return await this.getRepo().deleteServiceWorkflowData(
      idServiceRequestCustomer,
    );
  }

  async getServiceWorkflowListingOfCustomer(
    start: number,
    limit: number,
    statusType: string,
    filterObj: any,
  ) {
    return await this.getRepo().getServiceWorkflowListingOfCustomer(
      start,
      limit,
      statusType,
      filterObj,
    );
  }

  async updateSendReportStatus(idServiceRequestCustomer: string) {
    return await this.getRepo().updateSendReportStatus(
      idServiceRequestCustomer,
    );
  }

  async insertOrUpdateServiceRequestsCustomersData(
    serviceRequestsCustomersData: any,
  ) {
    return await this.getRepo().insertOrUpdateServiceRequestsCustomersData(
      serviceRequestsCustomersData,
    );
  }

  async getServiceWorkflowDataOfCustomer(idServiceRequestCustomer: any) {
    return await this.getRepo().getServiceWorkflowDataOfCustomer(
      idServiceRequestCustomer,
    );
  }
  async checkWorkflowExists(idServiceRequestCustomer: any) {
    return await this.getRepo().checkWorkflowExists(idServiceRequestCustomer);
  }
  async getClaimEnteredByData(idServiceRequestCustomer: any) {
    return await this.getRepo().getClaimEnteredByData(idServiceRequestCustomer);
  }
  async getOnlineTradeAssets(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    const PARAMETERS = `?pageNumber=1&pageSize=25&customerNumber=${customerShipTo}&salesOrganization=${salesOrganization}&distributionChannel=${distributionChannel}`;

    const BASE_API_URL = await this.getDefaultApiUrl();
    const URL =
      BASE_API_URL + END_POINTS.TRADE_ASSETS_PRODUCT_DESTROYED + PARAMETERS;

    console.log('getOnlineTradeAssets :>>,', URL);

    const response = await ApiUtil.callGetApi(URL);
    console.log(response, 'apiresponse');
    return response;
  }
}
