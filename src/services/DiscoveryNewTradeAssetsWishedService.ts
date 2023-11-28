import BaseApiService from './BaseApiService';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import DiscoveryNewTradeAssetsWished from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryNewTradeAssetsWished';
import {DiscoveryNewTradeAssetsWishedRepo} from 'src/repo/DiscoveryNewTradeAssetsWishedRepo';
import {Q} from '@nozbe/watermelondb';

export class DiscoveryNewTradeAssetsWishedService extends BaseApiService<
  DiscoveryNewTradeAssetsWished,
  DiscoveryNewTradeAssetsWishedRepo
> {
  private readonly discoveryNewTradeAssetsWishedRepository: DiscoveryNewTradeAssetsWishedRepo =
    new DiscoveryNewTradeAssetsWishedRepo();

  getRepo(): DiscoveryNewTradeAssetsWishedRepo {
    return this.discoveryNewTradeAssetsWishedRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.DISCOVERY_NEW_TRADE_ASSETS_WISHED;
  }

  async insertOrUpdateTaWish(allTaWishData: any, agreementNumber: string) {
    try {
      const database = OFFLINE_STORAGE.getDB();
      const prospectData = await this.getPLProspectInfo();

      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const collection = this.getRepo().getCollection(this.getCollectionName());

      const existingTaWishData = await collection
        .query(
          Q.where('discovery_id', discoveryId),
          Q.where('ta_loan_agreement_number', agreementNumber),
        )
        .fetch();

      console.log('existingTaWishData length :>> ', existingTaWishData.length);

      if (existingTaWishData.length > 0) {
        await database.write(async () => {
          const preparedDeleteBatch = await Promise.all(
            existingTaWishData.map(async (taWishData: any) =>
              taWishData.destroyPermanently(),
            ),
          );

          await database.batch(preparedDeleteBatch);
        });
      }

      await database.write(async () => {
        const preparedTaWish = await Promise.all(
          allTaWishData.map(async (taWishData: any, index: number) =>
            this.getRepo().insertOrUpdateTaWish(
              taWishData,
              discoveryId,
              agreementNumber,
              index,
            ),
          ),
        );

        await database.batch(preparedTaWish);
      });

      return true;
    } catch (error) {
      console.log('insertOrUpdateTaWish service error :>> ', error);
      return false;
    }
  }

  async checkDiscoveryNewTradeAssetsAgreement() {
    return await this.getRepo().checkDiscoveryNewTradeAssetsAgreement();
  }

  async getTaWishData(agreementNumber: string) {
    return await this.getRepo().getTaWishData(agreementNumber);
  }
}
