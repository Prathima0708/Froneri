import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import DiscoveryNewTradeAssetsWished from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryNewTradeAssetsWished';
import {Q} from '@nozbe/watermelondb';
const ENTITY = OFFLINE_STORAGE.MODEL.DISCOVERY_NEW_TRADE_ASSETS_WISHED;

export class DiscoveryNewTradeAssetsWishedRepo extends BaseRepo<DiscoveryNewTradeAssetsWished> {
  /**
   * Function returns prepared taWishData object to insert in db
   * @returns
   */
  async insertOrUpdateTaWish(
    taWishData: any,
    discoveryId: string,
    agreementNumber: string,
    index: number,
  ) {
    try {
      const collection = this.getCollection(ENTITY);

      const taDescription = taWishData?.taDescription ?? '';
      const materialNumber = taWishData?.materialNumber ?? '';
      const quantity = taWishData?.quantity ? Number(taWishData?.quantity) : 0;
      const expectedTurnover = taWishData?.expectedTurnover
        ? Number(taWishData?.expectedTurnover)
        : 0;
      const design = taWishData?.design ?? '';
      const priceTag = taWishData?.price ? Number(taWishData?.price) : 0;
      const sequence = index + 1;

      // Creating new ta wish data
      return collection.prepareCreate((rec: any) => {
        rec.discoveryId = discoveryId;
        rec.taLoanAgreementNumber = agreementNumber;
        rec.taDescription = taDescription;
        rec.materialNumber = materialNumber;
        rec.quantity = quantity;
        rec.expectedTurnover = expectedTurnover;
        rec.design = design;
        rec.priceTag = priceTag;
        rec.sentDatetime = null;
        rec.sequence = sequence;
      });
    } catch (error) {
      console.log('insertOrUpdateTaWish error :>> ', error);
      return {};
    }
  }

  /**
   * Function returns TA listing data for the particular prospect
   * @returns
   */
  async checkDiscoveryNewTradeAssetsAgreement() {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const QUERY =
        'SELECT DNTAW.TA_Loan_Agreement_Number, ' +
        'DTA.YAMBS_Status ' +
        'FROM Discovery_New_Trade_Assets_Wished AS DNTAW ' +
        'LEFT JOIN Discovery_Trade_Assets As DTA  ' +
        'ON (DNTAW.Discovery_ID=DTA.Discovery_ID AND DNTAW.TA_Loan_Agreement_Number = DTA.TA_Loan_Agreement_Number) ' +
        `WHERE DNTAW.Discovery_Id = '${discoveryId}' AND DTA.Deleted <>'1' `;

      let results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results && results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('checkDiscoveryNewTradeAssetsAgreement error :>> ', error);
      return [];
    }
  }

  /**
   * Function returns TA wish data of prospect/customer
   * @returns
   */
  async getTaWishData(agreementNumber: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const QUERY =
        'select id, ta_description as taDescription, ' +
        'material_number as materialNumber, ' +
        'quantity as quantity, [sequence] as [sequence], ' +
        'expected_turnover as expectedTurnover, ' +
        'design as design, price_tag as price ' +
        'from discovery_new_trade_assets_wished ' +
        'where discovery_id = ? ' +
        'and ta_loan_agreement_number = ? ' +
        'order by [sequence] asc';

      const QUERY_VALUES = [discoveryId, agreementNumber];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getTaWishDataOfProspect error :>> ', error);
      return [];
    }
  }
}
