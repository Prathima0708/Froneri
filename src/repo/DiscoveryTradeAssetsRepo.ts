import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import DiscoveryTradeAssets from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryTradeAssets';
import {TextsService} from 'src/services/TextsService';
import {getISOCurrentDate} from 'src/utils/CommonUtil';
import {YAMBS_WORKFLOW_STATUS_TYPE} from 'src/utils/DbConst';

const ENTITY = OFFLINE_STORAGE.MODEL.DISCOVERY_TRADE_ASSETS;

export class DiscoveryTradeAssetsRepo extends BaseRepo<DiscoveryTradeAssets> {
  /**
   * Function returns TA listing data for the particular prospect
   * @returns
   */
  async getTAListing() {
    try {
      const collection = this.getCollection(ENTITY);

      const textsService = new TextsService();
      const msgConditionStatusFinalized = await textsService.getTextsValue(
        'MSG_CONDITION_STATUS_FINALIZED',
      );
      const msgConditionStatusOpen = await textsService.getTextsValue(
        'MSG_CONDITION_STATUS_OPEN',
      );
      const msgTaRequest = await textsService.getTextsValue('MSG_TA_REQUEST');
      const msgTaChargeOff = await textsService.getTextsValue(
        'MSG_TA_CHARGE_OFF',
      );

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const QUERY =
        'select discovery_trade_assets.ta_loan_agreement_number as taLoanAgreementNumber, ' +
        'coalesce((select case when tempta.discovery_id is null then ? ' +
        'else ? end from (select distinct discovery_id, ' +
        'ta_loan_agreement_number from [discovery_new_trade_assets_wished]) tempta ' +
        'where tempta.ta_loan_agreement_number = discovery_trade_assets.ta_loan_agreement_number ' +
        "), ?) as 'taWish', coalesce(( select case when " +
        'tempota.discovery_id is null then ? else ? ' +
        'end from (select distinct discovery_id, ta_loan_agreement_number from ' +
        "discovery_previous_owner_trade_assets where too = '1') tempota where " +
        'tempota.ta_loan_agreement_number = discovery_trade_assets.ta_loan_agreement_number), ' +
        "?) as 'too', coalesce (emp1.first_name, '') || coalesce(emp1.last_name, '') as createdBy, " +
        "coalesce (emp2.first_name, '') || coalesce(emp2.last_name, '') as updatedBy, " +
        "strftime('%d-%m-%Y', discovery_trade_assets.creation_datetime) as creationDate, " +
        "strftime('%d-%m-%Y', discovery_trade_assets.update_datetime) as updateDate, " +
        "strftime('%d-%m-%Y', discovery_trade_assets.ta_signed_datetime) as signedDate, " +
        "case when (discovery_trade_assets.yambs_status = '1' " +
        "or discovery_trade_assets.yambs_status = '2' " +
        "or discovery_trade_assets.yambs_status = '3') then ? " +
        "else ? end as 'status', signature_customer as signatureCustomer, signature_employee as signatureEmployee, " +
        "yambs_status as yambsStatus, justification, case ta_process when '1' then ? " +
        "when '2' then ? else '' end as process, discovery_trade_assets.ta_process as taProcess " +
        'from discovery_trade_assets left join employees as emp1 on ' +
        'discovery_trade_assets.creation_employee_number = emp1.employee_number ' +
        'left join employees as emp2 on discovery_trade_assets.update_employee_number = emp2.employee_number ' +
        'left join (select distinct discovery_id, ta_loan_agreement_number from ' +
        '[discovery_new_trade_assets_wished]) tempta on tempta.ta_loan_agreement_number ' +
        '= discovery_trade_assets.ta_loan_agreement_number left join (select distinct discovery_id, ' +
        "ta_loan_agreement_number from discovery_previous_owner_trade_assets where too = '1') " +
        'tempota on tempota.ta_loan_agreement_number = discovery_trade_assets.ta_loan_agreement_number ' +
        "where discovery_trade_assets.discovery_id = ? and discovery_trade_assets.deleted <> '1' " +
        'order by discovery_trade_assets.creation_datetime asc';
      const QUERY_VALUES = [
        0,
        1,
        0,
        0,
        1,
        0,
        msgConditionStatusFinalized,
        msgConditionStatusOpen,
        msgTaRequest,
        msgTaChargeOff,
        discoveryId,
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
      console.log('getTAListing error :>> ', error);
      return [];
    }
  }

  /**
   * Function returns true/false based on insert success/failure
   * @returns
   */
  async insertOrUpdateTaRequest(taRequestData: any) {
    try {
      const collection = this.getCollection(ENTITY);

      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const prospectData = await this.getPLProspectInfo();

      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
      const currentDate = getISOCurrentDate();

      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';
      const taLoanAgreementNumber = taRequestData?.agreementNumber ?? '';
      const signatureEmployee = taRequestData?.employeeSignature ?? 0;
      const signatureCustomer = taRequestData?.customerSignature ?? 0;
      const taStatus = taRequestData?.status ?? '0';
      const yambsStatus = YAMBS_WORKFLOW_STATUS_TYPE.NOT_REQUESTED;
      const justification = taRequestData?.notes ?? '';
      const taProcess = taRequestData?.taProcess ?? '0';
      const signedDate = taRequestData?.signedDate
        ? taRequestData?.signedDate
        : currentDate;

      const existingTaRequestData = await collection
        .query(Q.where('ta_loan_agreement_number', taLoanAgreementNumber))
        .fetch();

      // Update existing record
      if (existingTaRequestData.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await existingTaRequestData[0].update((rec: any) => {
            rec.signatureEmployee = signatureEmployee;
            rec.signatureCustomer = signatureCustomer;
            rec.updateEmployeeNumber = employeeNo;
            rec.updateDatetime = currentDate;
            rec.taStatus = taStatus;
            rec.yambsStatus = yambsStatus;
            rec.deleted = '0';
            rec.fileName = null;
            rec.justification = justification;

            if (
              signatureEmployee &&
              signatureCustomer &&
              !taRequestData?.signedDate
            ) {
              rec.taSignedDatetime = signedDate;
            }

            rec.sentDatetime = null;
            rec.taProcess = taProcess;
            rec.idOrder = null;
          });
        });
      }
      // Insert new record
      else {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await collection.create((rec: any) => {
            rec.discoveryId = discoveryId;
            rec.taLoanAgreementNumber = taLoanAgreementNumber;
            rec.signatureEmployee = signatureEmployee;
            rec.signatureCustomer = signatureCustomer;
            rec.creationEmployeeNumber = employeeNo;
            rec.creationDatetime = currentDate;
            rec.taStatus = taStatus;
            rec.yambsStatus = yambsStatus;
            rec.deleted = '0';
            rec.fileName = null;
            rec.justification = justification;

            if (signatureEmployee && signatureCustomer) {
              rec.taSignedDatetime = currentDate;
            }

            rec.sentDatetime = null;
            rec.taProcess = taProcess;
            rec.idOrder = null;
          });
        });
      }
      return true;
    } catch (error) {
      console.log('insertOrUpdateTaRequest error :>> ', error);
      return false;
    }
  }

  /**
   * Function returns true/false based on update delete status
   * @returns
   */
  async updateTradeAssetsDeleteStatus(agreementNumber: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const tradeAssetsObj = await collection
        .query(
          Q.where('discovery_id', discoveryId),
          Q.where('TA_Loan_Agreement_Number', agreementNumber),
        )
        .fetch();

      console.log(
        'discovery tradeAssetsObj length :>> ',
        tradeAssetsObj.length,
      );

      if (tradeAssetsObj.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await tradeAssetsObj[0].update((rec: any) => {
            rec.deleted = '1';
            rec.sentDatetime = null;
          });
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('updateTradeAssetsDeleteStatus error :>> ', error);
      return false;
    }
  }

  /**
   * Function returns true/false based on update status
   * @returns
   */
  async updateTaRequestFinalize(
    agreementNumber: string,
    tradeAssetsData: any,
    yambsStatus: string,
  ) {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const justification = tradeAssetsData?.notes ?? '';

      const tradeAssetsObj = await collection
        .query(
          Q.where('discovery_id', discoveryId),
          Q.where('TA_Loan_Agreement_Number', agreementNumber),
        )
        .fetch();

      if (tradeAssetsObj.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await tradeAssetsObj[0].update((rec: any) => {
            rec.yambsStatus = yambsStatus;
            rec.justification = justification;
            rec.sentDatetime = null;
            rec.taStatus = '1';
          });
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('updateTaRequestFinalize error :>> ', error);
      return false;
    }
  }
}
