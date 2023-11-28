import BaseApiService from './BaseApiService';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import Orders from 'src/storage/OfflineDBStorage/WmDB/models/Orders';
import {OrdersRepo} from 'src/repo/OrdersRepo';
import {END_POINTS} from 'src/utils/ApiEndpoints';
import ApiUtil from './ApiUtil';
import LanguagesService from './LanguagesService';
import {formatDate} from 'src/utils/CommonUtil';

export class OrdersService extends BaseApiService<Orders, OrdersRepo> {
  private readonly ordersRepo: OrdersRepo = new OrdersRepo();

  getRepo(): OrdersRepo {
    return this.ordersRepo;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.ORDERS;
  }

  async getLastOrder(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    return await this.getRepo().getLastOrder(
      customerShipTo,
      salesOrganization,
      distributionChannel,
    );
  }

  // TODO Need to check base url
  async getLastOrderOnline(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const languagesData = await LanguagesService.getLanguagesData();
    const languageIndex = languagesData.find(
      (languageData: any) => languageData.language === employeeInfo[0].language,
    )?.indexLanguage;
    const PARAMTERS = `?customerNumber=${customerShipTo}&salesOrganization=${salesOrganization}&distributionChannel=${distributionChannel}&connecteduserLanguageIndex=${languageIndex}`;
    // const PARAMTERS = `?customerNumber=0020305601&salesOrganization=DE09&distributionChannel=02&connecteduserLanguageIndex=1`;
    const BASE_API_URL = await this.getDefaultApiUrl();
    const URL = BASE_API_URL + END_POINTS.LATEST_ORDER + PARAMTERS;

    const response = await ApiUtil.callGetApi(URL);

    return response;
  }

  async getCustomerOrderHistory() {
    return await this.getRepo().getCustomerOrderHistory();
  }

  async getOrderHistoryOrderLinesInfo(idOrder: string) {
    return await this.getRepo().getOrderHistoryOrderLinesInfo(idOrder);
  }

  async getClaimsOrderLists(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    return await this.getRepo().getClaimsOrderLists(
      customerShipTo,
      salesOrganization,
      distributionChannel,
    );
  }
  async getClaimsOrderListLines(orderNumber: any) {
    return await this.getRepo().getClaimsOrderListLines(orderNumber);
  }

  async getCustomerOrderHistoryOnline(
    pageNumber: number,
    pageSize: number,
    searchOrderObj: any,
  ) {
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const languagesData = await LanguagesService.getLanguagesData();

    const languageIndex = languagesData.find(
      (languageData: any) => languageData.language === employeeInfo[0].language,
    )?.indexLanguage;

    const customerInfo: any = await this.getCLCustomerInfo();
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';
    const salesOrganization = customerInfo.salesOrganization
      ? customerInfo.salesOrganization
      : '';
    const distributionChannel = customerInfo.distributionChannel
      ? customerInfo.distributionChannel
      : '';

    const BASE_API_URL = await this.getDefaultApiUrl();
    let PARAMETERS = `?pageNumber=${pageNumber}&pageSize=${pageSize}&customerNumber=${customerShipTo}&salesOrganization=${salesOrganization}&distributionChannel=${distributionChannel}&connecteduserLanguageIndex=${languageIndex}`;

    if (searchOrderObj.orderedFrom != '' && searchOrderObj.orderedTo != '') {
      const orderedFrom = formatDate(searchOrderObj.orderedFrom);
      const orderedTo = formatDate(searchOrderObj.orderedTo);
      PARAMETERS += `&creationDateFrom=${orderedFrom}&creationDateTo=${orderedTo}`;
    }
    if (
      searchOrderObj.deliveryDateFrom != '' &&
      searchOrderObj.deliveryDateTo != ''
    ) {
      const deliveryDateFrom = formatDate(searchOrderObj.deliveryDateFrom);
      const deliveryDateTo = formatDate(searchOrderObj.deliveryDateTo);
      PARAMETERS += `&deliveryDateFrom=${deliveryDateFrom}&deliveryDateTo=${deliveryDateTo}`;
    }
    if (searchOrderObj.orderNumber != '') {
      PARAMETERS += `&orderNumber=${searchOrderObj.orderNumber}`;
    }
    if (searchOrderObj.purchaseOrderNumber != '') {
      PARAMETERS += `&purchaseOrderNumber=${searchOrderObj.purchaseOrderNumber}`;
    }
    if (searchOrderObj.tessInternalNumber != '') {
      PARAMETERS += `&tessInternalNumber=${searchOrderObj.tessInternalNumber}`;
    }
    if (searchOrderObj.orderType.length > 0) {
      const type =
        searchOrderObj.orderType[0].orderType +
        '|' +
        searchOrderObj.orderType[0].orderSubType;
      PARAMETERS += `&orderType=${type}`;
    }

    const URL = BASE_API_URL + END_POINTS.ORDER_HISTORY + PARAMETERS;
    console.log('URL', URL);
    const response = await ApiUtil.callGetApi(URL);

    return response;
  }

  async getCustomerLinesOnline(idOrder: string) {
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const languagesData = await LanguagesService.getLanguagesData();

    const languageIndex = languagesData.find(
      (languageData: any) => languageData.language === employeeInfo[0].language,
    )?.indexLanguage;

    const BASE_API_URL = await this.getDefaultApiUrl();
    let PARAMETERS = `?idOrder=${idOrder}&connecteduserLanguageIndex=${languageIndex}`;

    const URL = BASE_API_URL + END_POINTS.ORDER_LINES + PARAMETERS;
    console.log('URL', URL);
    const response = await ApiUtil.callGetApi(URL);

    return response;
  }
}
