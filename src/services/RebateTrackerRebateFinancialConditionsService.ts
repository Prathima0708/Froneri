import BaseApiService from './BaseApiService';
import RebateTrackerRebateFinancialConditions from 'src/storage/OfflineDBStorage/WmDB/models/RebateTrackerRebateFinancialConditions';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {RebateTrackerRebateFinancialConditionsRepo} from 'src/repo/RebateTrackerRebateFinancialConditionsRepo';
import {END_POINTS} from 'src/utils/ApiEndpoints';
import ApiUtil from './ApiUtil';

export class RebateTrackerRebateFinancialConditionsService extends BaseApiService<
  RebateTrackerRebateFinancialConditions,
  RebateTrackerRebateFinancialConditionsRepo
> {
  private readonly repo: RebateTrackerRebateFinancialConditionsRepo =
    new RebateTrackerRebateFinancialConditionsRepo();

  getRepo(): RebateTrackerRebateFinancialConditionsRepo {
    return this.repo;
  }

  getCollectionName() {
    return OFFLINE_STORAGE.MODEL.REBATETRACKER_REBATE_FINANCIAL_CONDITIONS;
  }

  async getContractsLevelOneData() {
    return await this.getRepo().getContractsLevelOneData();
  }

  async getContractsLevelTwoData(contractNumber: string) {
    return await this.getRepo().getContractsLevelTwoData(contractNumber);
  }

  async getAllContractsOnline() {
    const customerInfo: any = await this.getRepo().getCLCustomerInfo();
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';

    const PARAMETERS = `?maxcount=5&pageNumber=1&pageSize=5&customerNumber=${customerShipTo}`;
    // const PARAMETERS = `?maxcount=5&pageNumber=1&pageSize=5&customerNumber=0020305590`;
    const BASE_API_URL = await this.getDefaultApiUrl();
    const URL = BASE_API_URL + END_POINTS.CONDITIONS_CONTRACTS + PARAMETERS;
    console.log('URL', URL);
    const response = await ApiUtil.callGetApi(URL);

    return response;
  }
}
