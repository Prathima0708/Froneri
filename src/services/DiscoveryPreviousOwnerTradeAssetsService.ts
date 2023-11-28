import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import DiscoveryPreviousOwnerTradeAssets from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryPreviousOwnerTradeAssets';
import {DiscoveryPreviousOwnerTradeAssetsRepo} from 'src/repo/DiscoveryPreviousOwnerTradeAssetsRepo';
import {generateUniqueIdWithTime} from 'src/utils/CommonUtil';

export class DiscoveryPreviousOwnerTradeAssetsService extends BaseApiService<
  DiscoveryPreviousOwnerTradeAssets,
  DiscoveryPreviousOwnerTradeAssetsRepo
> {
  private readonly discoveryPreviousOwnerTradeAssetsRepository: DiscoveryPreviousOwnerTradeAssetsRepo =
    new DiscoveryPreviousOwnerTradeAssetsRepo();

  getRepo(): DiscoveryPreviousOwnerTradeAssetsRepo {
    return this.discoveryPreviousOwnerTradeAssetsRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.DISCOVERY_PREVIOUS_OWNER_TRADE_ASSETS;
  }

  async deletePreviousOwnerTradeAsset(discoveryId: string) {
    return await this.getRepo().deletePreviousOwnerTradeAsset(discoveryId);
  }

  async insertPreviousOwnerTradeAsset(
    previousCustomerShipTo: string,
    discoveryId: string,
    tradeAssetData: any,
  ) {
    return await this.getRepo().insertPreviousOwnerTradeAsset(
      previousCustomerShipTo,
      discoveryId,
      tradeAssetData,
    );
  }

  async getTaTakeoverOfProspect(
    salesOrganization: string,
    distributionChannel: string,
  ) {
    return await this.getRepo().getTaTakeoverOfProspect(
      salesOrganization,
      distributionChannel,
    );
  }

  async insertOrUpdateTaTakeover(
    allTaTakeoverData: any,
    previousCustomerDetailsData: any,
    agreementNumber: string,
  ) {
    try {
      const database = OFFLINE_STORAGE.getDB();
      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';
      const previousCustomerShipTo =
        previousCustomerDetailsData?.previousCustomerShipTo ?? '';
      const previousCustomerSalesOrganization =
        previousCustomerDetailsData?.previousCustomerSalesOrganization ?? '';
      const previousCustomerDistributionChannel =
        previousCustomerDetailsData?.previousCustomerDistributionChannel ?? '';

      await database.write(async () => {
        const preparedTaTakeover = await Promise.all(
          allTaTakeoverData.map(async (taTakeoverData: any, index: number) => {
            return this.getRepo().insertOrUpdateTaTakeover(
              taTakeoverData,
              discoveryId,
              agreementNumber,
              previousCustomerShipTo,
              previousCustomerSalesOrganization,
              previousCustomerDistributionChannel,
            );
          }),
        );

        await database.batch(preparedTaTakeover);
      });

      return true;
    } catch (error) {
      console.log('insertOrUpdateTaTakeover service error :>> ', error);
      return false;
    }
  }

  async checkPreviousCustomersTradeAssets() {
    return await this.getRepo().checkPreviousCustomersTradeAssets();
  }

  async checkPreviousCustomersTradeAssetsWithoutAgreement() {
    return await this.getRepo().checkPreviousCustomersTradeAssetsWithoutAgreement();
  }

  async getTaTakeoverData(agreementNumber: string) {
    return await this.getRepo().getTaTakeoverData(agreementNumber);
  }

  async updatePrevOwnerTradeAssetsStatus(agreementNumber: string) {
    return await this.getRepo().updatePrevOwnerTradeAssetsStatus(
      agreementNumber,
    );
  }

  async deletePrevOwnerTradeAssetsStatus(agreementNumber: string) {
    return await this.getRepo().deletePrevOwnerTradeAssetsStatus(
      agreementNumber,
    );
  }
  async finalizePreviousOwnerTradeAssets(
    tradeAssetId: string,
    agreementNumber: string,
  ) {
    return await this.getRepo().finalizePreviousOwnerTradeAssets(
      tradeAssetId,
      agreementNumber,
    );
  }
}
