import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import DeliveriesDetailedLast10 from 'src/storage/OfflineDBStorage/WmDB/models/DeliveriesDetailedLast10';
import {DeliveriesDetailedLast10Repo} from 'src/repo/DeliveriesDetailedLast10Repo';
import ApiUtil from './ApiUtil';
import {END_POINTS} from 'src/utils/ApiEndpoints';
import LanguagesService from './LanguagesService';

export class DeliveriesDetailedLast10Service extends BaseApiService<
  DeliveriesDetailedLast10,
  DeliveriesDetailedLast10Repo
> {
  private readonly DeliveriesDetailedLast10Repository: DeliveriesDetailedLast10Repo =
    new DeliveriesDetailedLast10Repo();

  getRepo(): DeliveriesDetailedLast10Repo {
    return this.DeliveriesDetailedLast10Repository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.DELIVERIES_DETAILED_LAST_10;
  }

  async getLast10Deliveries() {
    return await this.getRepo().getLast10Deliveries();
  }

  async getLast10DeliveriesOnline() {
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

    const PARAMETERS = `?customerNumber=${customerShipTo}&salesOrganization=${salesOrganization}&distributionChannel=${distributionChannel}&connectedUserLanguageIndex=${languageIndex}&numberOfDeliveries=10`;
    // const PARAMETERS = `?customerNumber=0020304207&salesOrganization=DE09&distributionChannel=02&connectedUserLanguageIndex=1&numberOfDeliveries=10`;
    const BASE_API_URL = await this.getDefaultApiUrl();

    const URL = BASE_API_URL + END_POINTS.LAST_N_DELIVERIES + PARAMETERS;

    const response = await ApiUtil.callGetApi(URL);

    return response;
  }
}
