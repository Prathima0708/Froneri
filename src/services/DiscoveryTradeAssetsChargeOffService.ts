import BaseApiService from './BaseApiService';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import DiscoveryTradeAssetsChargeOff from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryTradeAssetsChargeOff';
import {DiscoveryTradeAssetsChargeOffRepo} from 'src/repo/DiscoveryTradeAssetsChargeOffRepo';

export class DiscoveryTradeAssetsChargeOffService extends BaseApiService<
  DiscoveryTradeAssetsChargeOff,
  DiscoveryTradeAssetsChargeOffRepo
> {
  private readonly discoveryTradeAssetsChargeOffRepository: DiscoveryTradeAssetsChargeOffRepo =
    new DiscoveryTradeAssetsChargeOffRepo();

  getRepo(): DiscoveryTradeAssetsChargeOffRepo {
    return this.discoveryTradeAssetsChargeOffRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.DISCOVERY_TRADE_ASSETS_CHARGE_OFF;
  }

  async insertOrUpdateTaChargeOffData(
    taChargeOffData: any,
    agreementNumber: string,
  ) {
    try {
      const prospectData = await this.getPLProspectInfo();

      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      for (const chargeOffData of taChargeOffData) {
        const isTaChargeOffSaved =
          await this.getRepo().insertOrUpdateTaChargeOffData(
            chargeOffData,
            discoveryId,
            agreementNumber,
          );

        if (!isTaChargeOffSaved) {
          return false;
        }
      }
      return true;
    } catch (error) {
      console.log('insertOrUpdateTaChargeOffData service error :>> ', error);
      return false;
    }
  }

  async deleteDiscoveryTradeAssetsChargeOff(agreementNumber: string) {
    return await this.getRepo().deleteDiscoveryTradeAssetsChargeOff(
      agreementNumber,
    );
  }
}
