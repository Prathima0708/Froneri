import BaseApiService from './BaseApiService';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {END_POINTS} from 'src/utils/ApiEndpoints';
import ApiUtil from './ApiUtil';
import SalesDealsCustomerShipToAggregated from 'src/storage/OfflineDBStorage/WmDB/models/SalesDealsCustomerShipToAggregated';
import {SalesDealsCustomerShipToAggregatedRepo} from 'src/repo/SalesDealsCustomerShipToAggregatedRepo';
import LanguagesService from './LanguagesService';

export class SalesDealsCustomerShipToAggregatedService extends BaseApiService<
  SalesDealsCustomerShipToAggregated,
  SalesDealsCustomerShipToAggregatedRepo
> {
  private readonly repo: SalesDealsCustomerShipToAggregatedRepo =
    new SalesDealsCustomerShipToAggregatedRepo();

  getRepo(): SalesDealsCustomerShipToAggregatedRepo {
    return this.repo;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.SALES_DEALS_CUSTOMER_SHIP_TO_AGGREGATED;
  }

  async getSalesDealsConditions() {
    return await this.getRepo().getSalesDealsConditions();
  }

  async getSalesDealsConditionsOnline() {
    const customerInfo: any = await this.getRepo().getCLCustomerInfo();
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const languagesData = await LanguagesService.getLanguagesData();
    const languageIndex = languagesData.find(
      (languageData: any) => languageData.language === employeeInfo[0].language,
    )?.indexLanguage;

    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';
    const salesOrganization = customerInfo.salesOrganization
      ? customerInfo.salesOrganization
      : '';
    const distributionChannel = customerInfo.distributionChannel
      ? customerInfo.distributionChannel
      : '';

    const PARAMETERS = `?maxcount=50&pageNumber=1&pageSize=20&customerNumber=${customerShipTo}&salesOrganization=${salesOrganization}&distributionChannel=${distributionChannel}&connecteduserLanguageIndex=${languageIndex}`;
    // const PARAMETERS = `?maxcount=50&pageNumber=1&pageSize=5&customerNumber=0020304368&salesOrganization=DE09&distributionChannel=02&connecteduserLanguageIndex=1`;
    const BASE_API_URL = await this.getDefaultApiUrl();
    const URL = BASE_API_URL + END_POINTS.CONDITIONS_SALESDEALS + PARAMETERS;

    console.log('Sales deals conditions URL :>> ', URL);

    const response = await ApiUtil.callGetApi(URL);

    return response.data;
  }
}
