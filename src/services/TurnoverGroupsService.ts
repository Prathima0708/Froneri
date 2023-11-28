import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import TurnoverGroups from 'src/storage/OfflineDBStorage/WmDB/models/TurnoverGroups';
import {TurnoverGroupsRepo} from 'src/repo/TurnoverGroupsRepo';
import {END_POINTS} from 'src/utils/ApiEndpoints';
import ApiUtil from './ApiUtil';
import LanguagesService from './LanguagesService';

export class TurnoverGroupsService extends BaseApiService<
  TurnoverGroups,
  TurnoverGroupsRepo
> {
  private readonly TurnoverGroupsRepository: TurnoverGroupsRepo =
    new TurnoverGroupsRepo();

  getRepo(): TurnoverGroupsRepo {
    return this.TurnoverGroupsRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.TURNOVER_GROUPS;
  }

  async getProductGroup() {
    return await this.getRepo().getProductGroup();
  }

  async getTurnoverDetails(customerShipTo: string) {
    return await this.getRepo().getTurnoverDetails(customerShipTo);
  }

  async getTurnoverDetailsOnline(customerShipTo: string) {
    const PARAMETERS = `?customerNumber=${customerShipTo}`;
    // const PARAMETERS = `?customerNumber=0020372410`;
    const BASE_API_URL = await this.getDefaultApiUrl();
    const URL = BASE_API_URL + END_POINTS.TURNOVER_SUMMARY + PARAMETERS;

    const response = await ApiUtil.callGetApi(URL);

    return response;
  }

  async getTradeAssetsProfitability() {
    return await this.getRepo().getTradeAssetsProfitability();
  }

  async getTradeAssetsProfitabilityOnline() {
    const customerInfo: any = await this.getCLCustomerInfo();
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';

    const PARAMETERS = `?maxcount=1&pageNumber=1&pageSize=1&customerNumber=${customerShipTo}`;
    const BASE_API_URL = await this.getDefaultApiUrl();
    const URL =
      BASE_API_URL + END_POINTS.TRADE_ASSETS_PROFITABILITY + PARAMETERS;
    console.log('getTradeAssetsProfitabilityOnline', URL);
    const response = await ApiUtil.callGetApi(URL);

    return response;
  }

  async getAllTurnoverDetails() {
    return await this.getRepo().getAllTurnoverDetails();
  }

  async getAllTurnoverDetailsOnline() {
    const customerInfo: any = await this.getRepo().getCLCustomerInfo();
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const languagesData = await LanguagesService.getLanguagesData();
    const languageIndex = languagesData.find(
      (languageData: any) => languageData.language === employeeInfo[0].language,
    )?.indexLanguage;
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';

    const PARAMETERS = `?customerNumber=${customerShipTo}&connectedUserLanguageIndex=${languageIndex}`;
    // const PARAMETERS = `?customerNumber=0020372415&connectedUserLanguageIndex=1`;
    const BASE_API_URL = await this.getDefaultApiUrl();

    const URL = BASE_API_URL + END_POINTS.SALES_DATA + PARAMETERS;

    console.log('Turnover details URL :>> ', URL);

    const response = await ApiUtil.callGetApi(URL);

    return response;
  }

  async getTurnoverGroupDropdown() {
    return await this.getRepo().getTurnoverGroupDropdown();
  }
}
