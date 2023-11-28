import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import DiscoveryPreviousOwnerTradeAssets from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryPreviousOwnerTradeAssets';

const ENTITY = OFFLINE_STORAGE.MODEL.DISCOVERY_PREVIOUS_OWNER_TRADE_ASSETS;

export class DiscoveryPreviousOwnerTradeAssetsRepo extends BaseRepo<DiscoveryPreviousOwnerTradeAssets> {
  /**
   * Function returns true/false based on previous owner trade asset is deleted or not
   * @returns
   */
  async deletePreviousOwnerTradeAsset(discoveryId: string) {
    try {
      const database = OFFLINE_STORAGE.getDB();
      const collection = this.getCollection(ENTITY);

      const prevCustomerTradeAssetData = await collection
        .query(Q.where('discovery_id', discoveryId))
        .fetch();

      if (prevCustomerTradeAssetData.length > 0) {
        await database.write(async () => {
          const preparedDeleteBatch = await Promise.all(
            prevCustomerTradeAssetData.map(async (tradeAssetData: any) =>
              tradeAssetData.destroyPermanently(),
            ),
          );

          await database.batch(preparedDeleteBatch);
        });
      }
      return true;
    } catch (error) {
      console.log('deletePreviousOwnerTradeAsset error :>> ', error);
      return false;
    }
  }

  /**
   * Function returns true/false based on insertion of previous owner trade asset
   * @returns
   */
  async insertPreviousOwnerTradeAsset(
    previousCustomerShipTo: string,
    discoveryId: string,
    tradeAssetData: any,
  ) {
    try {
      const database = OFFLINE_STORAGE.getDB();
      const collection = this.getCollection(ENTITY);

      if (tradeAssetData.length > 0) {
        await database.write(async () => {
          const preparedTradeAssetData = await Promise.all(
            tradeAssetData.map(async (data: any) => {
              return collection.prepareCreate((rec: any) => {
                rec.discoveryId = discoveryId;
                rec.materialNumber = data.materialNumber;
                rec.serialNumber = data.serialNumber;
                rec.previousCustomerShipTo = previousCustomerShipTo;
                rec.previousCustomerSalesOrganization = data.salesOrganization;
                rec.previousCustomerDistributionChannel =
                  data.distributionChannel;
                rec.too = '';
                rec.priceTag = data.priceTag;
                rec.sentDatetime = null;
              });
            }),
          );

          await database.batch(preparedTradeAssetData);
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('insertPreviousOwnerTradeAsset error :>> ', error);
      return false;
    }
  }

  /**
   * Function returns ta takeover data of prospect
   * @returns
   */
  async getTaTakeoverOfProspect(
    salesOrganization: string,
    distributionChannel: string,
  ) {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';
      const QUERY =
        "select coalesce(replace(materials.description_language_1, ';', ''),'') " +
        "as description, coalesce(serial_number, '') as serialNumber, case " +
        "when too = '' then 1 when too is null then 1 else too end as taTransfer, " +
        "coalesce(expected_turnover, '') as expectedTurnoverTa, " +
        "coalesce(follow_up_action, '') as followUpAction, " +
        "coalesce(discovery_previous_owner_trade_assets.material_number,'') as " +
        "materialNumber, coalesce(discovery_previous_owner_trade_assets.price_tag,'') as priceTag " +
        'from discovery_previous_owner_trade_assets left join materials on ' +
        "substr('000000000000000000' || discovery_previous_owner_trade_assets.material_number, " +
        'length(discovery_previous_owner_trade_assets.material_number) + 1, 18) = materials.material_number ' +
        'and discovery_previous_owner_trade_assets.previous_customer_sales_organization = materials.sales_organization ' +
        'and discovery_previous_owner_trade_assets.previous_customer_distribution_channel = materials.distribution_channel ' +
        'where discovery_previous_owner_trade_assets.discovery_id = ? ' +
        'and discovery_previous_owner_trade_assets.previous_customer_sales_organization = ? ' +
        'and discovery_previous_owner_trade_assets.previous_customer_distribution_channel = ?' +
        "and discovery_previous_owner_trade_assets.ta_loan_agreement_number = ''";

      const QUERY_VALUES = [
        discoveryId,
        salesOrganization,
        distributionChannel,
      ];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getTaTakeoverOfProspect error :>> ', error);
      return [];
    }
  }

  /*
   * Function returns check previous customer's trade assets
   * @returns []
   */
  async checkPreviousCustomersTradeAssets() {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      let QUERY =
        'SELECT DPOTA.TOO, DTA.YAMBS_Status ,* ' +
        'FROM Discovery_Previous_Owner_Trade_Assets AS DPOTA  ' +
        'LEFT JOIN Discovery_Trade_Assets AS DTA ' +
        'ON (DPOTA.Discovery_Id=DTA.Discovery_Id AND  DPOTA.TA_Loan_Agreement_Number=DTA.TA_Loan_Agreement_Number) ' +
        'LEFT JOIN Discovery AS D ' +
        'ON D.Discovery_Id=DPOTA.discovery_ID  ' +
        `WHERE DTA.Discovery_Id = '${discoveryId}' AND DTA.Deleted <>'1'`;

      let results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results && results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  /**
   * Function returns prepared taTakeover object to insert in db
   * @returns
   */
  async insertOrUpdateTaTakeover(
    taTakeoverData: any,
    discoveryId: string,
    agreementNumber: string,
    previousCustomerShipTo: string,
    previousCustomerSalesOrganization: string,
    previousCustomerDistributionChannel: string,
  ) {
    try {
      const collection = this.getCollection(ENTITY);

      const materialNumber = taTakeoverData?.materialNumber ?? '';
      const serialNumber = taTakeoverData?.serialNumber ?? '';
      const too = taTakeoverData?.taTransfer ? '1' : '0';
      const expectedTurnover = taTakeoverData?.expectedTurnoverTa
        ? Number(taTakeoverData?.expectedTurnoverTa)
        : 0;
      const followUpAction = taTakeoverData?.followUpAction ?? '';
      const priceTag = taTakeoverData?.priceTag
        ? Number(taTakeoverData?.priceTag)
        : 0;

      const existingTaTakeoverData = await collection
        .query(Q.where('serial_number', serialNumber))
        .fetch();

      // Updating existing ta wish data
      if (existingTaTakeoverData.length > 0) {
        return existingTaTakeoverData[0].prepareUpdate((rec: any) => {
          rec.discoveryId = discoveryId;
          rec.taLoanAgreementNumber = agreementNumber;
          rec.idServiceRequestCustomer = null;
          rec.materialNumber = materialNumber;
          rec.serialNumber = serialNumber;
          rec.too = too;
          rec.expectedTurnover = expectedTurnover;
          rec.followUpAction = followUpAction;
          rec.sentDatetime = null;
          rec.previousCustomerShipTo = previousCustomerShipTo;
          rec.previousCustomerSalesOrganization =
            previousCustomerSalesOrganization;
          rec.previousCustomerDistributionChannel =
            previousCustomerDistributionChannel;
          rec.priceTag = priceTag;
        });
      }

      // Creating new ta wish data
      return collection.prepareCreate((rec: any) => {
        rec.discoveryId = discoveryId;
        rec.taLoanAgreementNumber = agreementNumber;
        rec.idServiceRequestCustomer = null;
        rec.materialNumber = materialNumber;
        rec.serialNumber = serialNumber;
        rec.too = too;
        rec.expectedTurnover = expectedTurnover;
        rec.followUpAction = followUpAction;
        rec.sentDatetime = null;
        rec.previousCustomerShipTo = previousCustomerShipTo;
        rec.previousCustomerSalesOrganization =
          previousCustomerSalesOrganization;
        rec.previousCustomerDistributionChannel =
          previousCustomerDistributionChannel;
        rec.priceTag = priceTag;
      });
    } catch (error) {
      console.log('insertOrUpdateTaTakeover error :>> ', error);
      return {};
    }
  }

  /*
   * Function returns check previous customer's trade assets but agreement is not created for the same.
   * @returns []
   */
  async checkPreviousCustomersTradeAssetsWithoutAgreement() {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      let QUERY =
        'SELECT TA_Loan_Agreement_Number ' +
        'FROM Discovery_Previous_Owner_Trade_Assets ' +
        `WHERE Discovery_Id = '${discoveryId}' AND TA_Loan_Agreement_Number IS NULL`;

      let results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results && results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log(
        'checkPreviousCustomersTradeAssetsWithoutAgreement error :>> ',
        error,
      );
      return [];
    }
  }

  /**
   * Function returns TA takeover data of prospect/customer
   * @returns
   */
  async getTaTakeoverData(agreementNumber: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      let QUERY =
        'select previous_customer_ship_to as previousCustomerShipTo, discovery_previous_owner_trade_assets.id, ' +
        "coalesce(replace(materials.description_language_1, ';', ''),'') as description, " +
        "coalesce(serial_number, '') as serialNumber, case when too = '' then 1 " +
        'when too is null then 1 else too end as taTransfer, ' +
        "coalesce(expected_turnover, '') as expectedTurnoverTa, " +
        "coalesce(follow_up_action, '') as followUpAction, " +
        "coalesce(discovery_previous_owner_trade_assets.material_number, '') as materialNumber, " +
        "coalesce(discovery_previous_owner_trade_assets.price_tag, '') as priceTag " +
        'from discovery_previous_owner_trade_assets left join materials on ' +
        "substr('000000000000000000' || discovery_previous_owner_trade_assets.material_number, " +
        'length(discovery_previous_owner_trade_assets.material_number) + 1, 18) = materials.material_number ' +
        'and discovery_previous_owner_trade_assets.previous_customer_sales_organization = materials.sales_organization ' +
        'and discovery_previous_owner_trade_assets.previous_customer_distribution_channel = materials.distribution_channel ' +
        'where discovery_previous_owner_trade_assets.discovery_id = ? ' +
        'and discovery_previous_owner_trade_assets.ta_loan_agreement_number = ? ';

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
      console.log('getTaTakeoverData error :>> ', error);
      return [];
    }
  }

  /**
   * Function returns true/false based on update status
   * @returns
   */
  async updatePrevOwnerTradeAssetsStatus(agreementNumber: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const discoveryPreviousOwnerTradeAssetsObj = await collection
        .query(Q.where('TA_Loan_Agreement_Number', agreementNumber))
        .fetch();

      console.log(
        'discoveryPreviousOwnerTradeAssetsObj length :>> ',
        discoveryPreviousOwnerTradeAssetsObj.length,
      );

      if (discoveryPreviousOwnerTradeAssetsObj.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await discoveryPreviousOwnerTradeAssetsObj[0].update((rec: any) => {
            rec.taLoanAgreementNumber = null;
            rec.idServiceRequestCustomer = null;
            rec.too = '';
            rec.expectedTurnover = null;
            rec.followUpAction = null;
            rec.priceTag = null;
            rec.sentDatetime = null;
          });
        });
      }

      return true;
    } catch (error) {
      console.log('updatePrevOwnerTradeAssetsStatus error :>> ', error);
      return false;
    }
  }

  /**
   * Function returns true/false based on delete entry
   * @returns
   */
  async deletePrevOwnerTradeAssetsStatus(agreementNumber: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const tradeAssetsObj = await collection
        .query(
          Q.where('discovery_id', discoveryId),
          Q.where('ta_loan_agreement_number', agreementNumber),
        )
        .fetch();

      console.log('tradeAssetsObj length :>> ', tradeAssetsObj.length);

      if (tradeAssetsObj.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          for (const tradeAssets of tradeAssetsObj) {
            await tradeAssets.destroyPermanently();
          }
        });
      }
      return true;
    } catch (error) {
      console.log('deletePrevOwnerTradeAssetsStatus error :>> ', error);
      return false;
    }
  }

  /**
   * Function returns true/false based on update status
   * @returns
   */
  async finalizePreviousOwnerTradeAssets(
    tradeAssetId: string,
    agreementNumber: string,
  ) {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const tradeAssetsObj = await collection
        .query(
          Q.where('discovery_id', discoveryId),
          Q.where('ta_loan_agreement_number', agreementNumber),
          Q.where('too', '0'),
        )
        .fetch();

      console.log('tradeAssetsObj length :>> ', tradeAssetsObj.length);

      if (tradeAssetsObj.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          for (const tradeAssets of tradeAssetsObj) {
            tradeAssets.update((rec: any) => {
              rec.idServiceRequestCustomer = tradeAssetId;
              rec.sentDatetime = null;
            });
          }
        });
      }
      return true;
    } catch (error) {
      console.log('finalizePreviousOwnerTradeAssets error :>> ', error);
      return false;
    }
  }
}
