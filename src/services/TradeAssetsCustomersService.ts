import BaseApiService from './BaseApiService';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import TradeAssetsCustomers from 'src/storage/OfflineDBStorage/WmDB/models/TradeAssetsCustomers';
import {TradeAssetsCustomersRepo} from 'src/repo/TradeAssetsCustomersRepo';
import LanguagesService from './LanguagesService';
import {END_POINTS} from 'src/utils/ApiEndpoints';
import ApiUtil from './ApiUtil';

export class TradeAssetsCustomersService extends BaseApiService<
  TradeAssetsCustomers,
  TradeAssetsCustomersRepo
> {
  private readonly TradeAssetsCustomersRepository: TradeAssetsCustomersRepo =
    new TradeAssetsCustomersRepo();

  getRepo(): TradeAssetsCustomersRepo {
    return this.TradeAssetsCustomersRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.TRADE_ASSETS_CUSTOMERS;
  }

  async getCustomerTradeAssets() {
    return await this.getRepo().getCustomerTradeAssets();
  }

  async getCustomerTradeAssetsOnline(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const languagesData = await LanguagesService.getLanguagesData();

    const languageIndex = languagesData.find(
      (languageData: any) => languageData.language === employeeInfo[0].language,
    )?.indexLanguage;

    const PARAMETERS = `?maxcount=10&pageNumber=1&pageSize=5&customerNumber=${customerShipTo}&salesOrganization=${salesOrganization}
    &distributionChannel=${distributionChannel}&connecteduserLanguageIndex=${languageIndex}`;
    const BASE_API_URL = await this.getDefaultApiUrl();
    const URL = BASE_API_URL + END_POINTS.TRADE_ASSETS + PARAMETERS;
    console.log('Trade Assets URL', URL);
    const response = await ApiUtil.callGetApi(URL);

    return response;
  }

  async getServiceWorkflowTradeAssets(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
    start: number,
    limit: number,
    searchText: string,
  ) {
    return await this.TradeAssetsCustomersRepository.getServiceWorkflowTradeAssets(
      customerShipTo,
      salesOrganization,
      distributionChannel,
      start,
      limit,
      searchText,
    );
  }

  async getTradeAssetNotTakenOverOnline(customerNumber: string) {
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const languagesData = await LanguagesService.getLanguagesData();

    const languageIndex = languagesData.find(
      (languageData: any) => languageData.language === employeeInfo[0].language,
    )?.indexLanguage;

    const PARAMETERS = `?pageNumber=1&pageSize=20&customerNumber=${customerNumber}&connecteduserLanguageIndex=${languageIndex}`;
    const BASE_API_URL = await this.getDefaultApiUrl();
    const URL =
      BASE_API_URL + END_POINTS.TRADE_ASSETS_NOT_TAKEN_OVER + PARAMETERS;
    const response = await ApiUtil.callGetApi(URL);

    return response;
  }

  async getTradeAssets(
    prevCustomerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    return await this.getRepo().getTradeAssets(
      prevCustomerShipTo,
      salesOrganization,
      distributionChannel,
    );
  }

  async getPreviousCustomerTAChargeOff() {
    return await this.getRepo().getPreviousCustomerTAChargeOff();
  }

  async getTaTakeoverOfPreviousCustomerInTaRequest(customerShipTo: string) {
    return await this.getRepo().getTaTakeoverOfPreviousCustomerInTaRequest(
      customerShipTo,
    );
  }
  async getServiceWorkflowOfflineTradeAssets(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
    idServiceRequestCustomer: string,
  ) {
    return await this.getRepo().getServiceWorkflowOfflineTradeAssets(
      customerShipTo,
      salesOrganization,
      distributionChannel,
      idServiceRequestCustomer,
    );
  }
  async getOnlineOrderlinesroducts(orderNumber: string) {
    const PARAMETERS = `?pageNumber=1&pageSize=25&orderNumber=${orderNumber}`;
    const BASE_API_URL = await this.getDefaultApiUrl();

    const URL =
      BASE_API_URL + END_POINTS.TRADE_ASSETS_ORDERLINE_PRODUCT + PARAMETERS;

    console.log('getOnlineOrderlinesroducts URL', URL);

    const response = await ApiUtil.callGetApi(URL);

    return response;
  }
  async getIcedTradeAssetsOnline(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
    idServiceRequestCustomer: string,
  ) {
    const PARAMETERS = `?pageNumber=1&pageSize=25&customerShipTo=${customerShipTo}&salesOrganization=${salesOrganization}&distributionChannel=${distributionChannel}`;
    const BASE_API_URL = await this.getDefaultApiUrl();

    const URL =
      BASE_API_URL + END_POINTS.TRADE_ASSETS_ICED_PRODUCT + PARAMETERS;
    console.log('getIcedTradeAssetsOnline URL', URL);
    const response = await ApiUtil.callGetApi(URL);

    return response;
  }
}
