import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import DiscoveryTradeAssetsChargeOff from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryTradeAssetsChargeOff';
import {Q} from '@nozbe/watermelondb';
const ENTITY = OFFLINE_STORAGE.MODEL.DISCOVERY_TRADE_ASSETS_CHARGE_OFF;

export class DiscoveryTradeAssetsChargeOffRepo extends BaseRepo<DiscoveryTradeAssetsChargeOff> {
  /**
   * Function returns true/false based on insert success/failure
   * @returns
   */
  async insertOrUpdateTaChargeOffData(
    taChargeOffData: any,
    discoveryId: string,
    agreementNumber: string,
  ) {
    try {
      const database = OFFLINE_STORAGE.getDB();
      const collection = this.getCollection(ENTITY);

      const materialNumber = taChargeOffData?.materialNumber ?? '';
      const serialNumber = taChargeOffData?.serialNumber ?? '';
      const taChargeOffStatus = taChargeOffData?.status ? '1' : '0';
      const residualValue = taChargeOffData?.residualValue
        ? Number(taChargeOffData?.residualValue)
        : 0;
      const constDate = taChargeOffData?.constructionDate ?? '';

      const existingTaChargeOffData = await collection
        .query(
          Q.where('discovery_id', discoveryId),
          Q.where('ta_loan_agreement_number', agreementNumber),
          Q.where('material_number', materialNumber),
          Q.where('serial_number', serialNumber),
        )
        .fetch();

      console.log(
        'existingTaChargeOffData length :>> ',
        existingTaChargeOffData.length,
      );

      if (existingTaChargeOffData.length > 0) {
        if (!taChargeOffData?.status) {
          await database.write(async () => {
            await existingTaChargeOffData[0].destroyPermanently();
          });
        } else {
          await database.write(async () => {
            await existingTaChargeOffData[0].update((rec: any) => {
              rec.materialNumber = materialNumber;
              rec.serialNumber = serialNumber;
              rec.taChargeOffStatus = taChargeOffStatus;
              rec.residualValue = residualValue;
              rec.constDate = constDate;
              rec.sentDatetime = null;
            });
          });
        }
      } else if (taChargeOffData?.status) {
        await database.write(async () => {
          await collection.create((rec: any) => {
            rec.discoveryId = discoveryId;
            rec.taLoanAgreementNumber = agreementNumber;
            rec.materialNumber = materialNumber;
            rec.serialNumber = serialNumber;
            rec.taChargeOffStatus = taChargeOffStatus;
            rec.residualValue = residualValue;
            rec.constDate = constDate;
            rec.sentDatetime = null;
          });
        });
      }

      return true;
    } catch (error) {
      console.log('insertOrUpdateTaChargeOffData error :>> ', error);
      return false;
    }
  }

  /**
   * Function returns true/false based on delete entry
   * @returns
   */
  async deleteDiscoveryTradeAssetsChargeOff(agreementNumber: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const tradeAssetsChargeOffObj = await collection
        .query(
          Q.where('discovery_id', discoveryId),
          Q.where('ta_loan_agreement_number', agreementNumber),
        )
        .fetch();

      console.log(
        'tradeAssetsChargeOffObj length :>> ',
        tradeAssetsChargeOffObj.length,
      );

      if (tradeAssetsChargeOffObj.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          for (const tradeAssetsChargeOff of tradeAssetsChargeOffObj) {
            await tradeAssetsChargeOff.destroyPermanently();
          }
        });
        return true;
      }
      return false;
    } catch (error) {
      console.log('deleteDiscoveryTradeAssetsChargeOff error :>> ', error);
      return false;
    }
  }
}
