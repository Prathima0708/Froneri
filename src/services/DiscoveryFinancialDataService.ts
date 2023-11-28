import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import DiscoveryFinancialData from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryFinancialData';
import {DiscoveryFinancialDataRepo} from 'src/repo/DiscoveryFinancialDataRepo';

export class DiscoveryFinancialDataService extends BaseApiService<
  DiscoveryFinancialData,
  DiscoveryFinancialDataRepo
> {
  private readonly discoveryFinancialDataRepository: DiscoveryFinancialDataRepo =
    new DiscoveryFinancialDataRepo();

  getRepo(): DiscoveryFinancialDataRepo {
    return this.discoveryFinancialDataRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.DISCOVERY_FINANCIAL_DATA;
  }

  async saveOrUpdateDiscoveryFinancialData(
    previousCustomerShipTo: string,
    discoveryId: string,
    turnoverAndPaymentData: any,
    previousCustomerBasicInfoData: any,
  ) {
    return await this.getRepo().saveOrUpdateDiscoveryFinancialData(
      previousCustomerShipTo,
      discoveryId,
      turnoverAndPaymentData,
      previousCustomerBasicInfoData,
    );
  }

  async getProspectFinancialInfo() {
    return await this.getRepo().getProspectFinancialInfo();
  }

  async insertOrUpdateFinancialInfo(financialData: any) {
    return await this.getRepo().insertOrUpdateFinancialInfo(financialData);
  }
}
