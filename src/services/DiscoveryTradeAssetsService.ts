import BaseApiService from './BaseApiService';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import DiscoveryTradeAssets from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryTradeAssets';
import {DiscoveryTradeAssetsRepo} from 'src/repo/DiscoveryTradeAssetsRepo';

export class DiscoveryTradeAssetsService extends BaseApiService<
  DiscoveryTradeAssets,
  DiscoveryTradeAssetsRepo
> {
  private readonly discoveryTradeAssetsRepository: DiscoveryTradeAssetsRepo =
    new DiscoveryTradeAssetsRepo();

  getRepo(): DiscoveryTradeAssetsRepo {
    return this.discoveryTradeAssetsRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.DISCOVERY_TRADE_ASSETS;
  }

  async getTAListing() {
    return await this.getRepo().getTAListing();
  }

  async insertOrUpdateTaRequest(taRequestData: any) {
    return await this.getRepo().insertOrUpdateTaRequest(taRequestData);
  }

  async updateTradeAssetsDeleteStatus(agreementNumber: string) {
    return await this.getRepo().updateTradeAssetsDeleteStatus(agreementNumber);
  }

  async updateTaRequestFinalize(
    agreementNumber: string,
    tradeAssetsData: any,
    yambsStatus: string,
  ) {
    return await this.getRepo().updateTaRequestFinalize(
      agreementNumber,
      tradeAssetsData,
      yambsStatus,
    );
  }
}
