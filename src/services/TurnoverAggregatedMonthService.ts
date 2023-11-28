import BaseApiService from './BaseApiService';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import TurnoverAggregatedMonth from 'src/storage/OfflineDBStorage/WmDB/models/TurnoverAggregatedMonth';
import {TurnoverAggregatedMonthRepo} from 'src/repo/TurnoverAggregatedMonthRepo';
import {END_POINTS} from 'src/utils/ApiEndpoints';
import ApiUtil from './ApiUtil';
import LanguagesService from './LanguagesService';

export class TurnoverAggregatedMonthService extends BaseApiService<
  TurnoverAggregatedMonth,
  TurnoverAggregatedMonthRepo
> {
  private readonly turnoverAggregatedMonthRepo: TurnoverAggregatedMonthRepo =
    new TurnoverAggregatedMonthRepo();

  getRepo(): TurnoverAggregatedMonthRepo {
    return this.turnoverAggregatedMonthRepo;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.TURNOVER_AGGREGATED_MONTH;
  }

  async getMonthlyTurnover() {
    return await this.getRepo().getMonthlyTurnover();
  }

  async getMonthlyTurnoverOnline() {
    const customerInfo: any = await this.getRepo().getCLCustomerInfo();
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const languagesData = await LanguagesService.getLanguagesData();
    const languageIndex = languagesData.find(
      (languageData: any) => languageData.language === employeeInfo[0].language,
    )?.indexLanguage;

    const PARAMETERS = `?customerNumber=${customerShipTo}&connectedUserLanguageIndex=${languageIndex}`;
    // const PARAMETERS = `?customerNumber=0020372410&connectedUserLanguageIndex=1`;
    const BASE_API_URL = await this.getDefaultApiUrl();

    const URL = BASE_API_URL + END_POINTS.MONTHLY + PARAMETERS;

    const response = await ApiUtil.callGetApi(URL);

    console.log('Monthly Turnover URL :>> ', URL);

    return response;
  }
}
