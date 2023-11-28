import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import DiscoverySepa from 'src/storage/OfflineDBStorage/WmDB/models/DiscoverySepa';
import {getISOCurrentDate} from 'src/utils/CommonUtil';
import {SEPA_AGREEMENT_TYPE_DROPDOWN} from 'src/utils/DropdownConst';

const ENTITY = OFFLINE_STORAGE.MODEL.DISCOVERY_SEPA;

export class DiscoverySepaRepo extends BaseRepo<DiscoverySepa> {
  /**
   * Function returns sepa agreement status
   * @returns
   */
  async checkSepaAgreement(discoveryId: string) {
    const collection = this.getCollection(ENTITY);

    const QUERY =
      'SELECT Discovery_Id as discoveryId ' +
      'FROM Discovery_SEPA WHERE ' +
      '[Discovery_Id] = ? AND ' +
      "File_Name IS NOT  NULL AND File_Name <> ''";

    const QUERY_VALUES = [discoveryId];

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * PLP Sepa - Prospect/Customer - Check if sepa exists or not
   * @returns
   */
  async isSepaAgreementExists() {
    const collection = this.getCollection(ENTITY);

    const prospectData = await this.getPLProspectInfo();
    const discoveryId = prospectData?.discoveryId
      ? prospectData.discoveryId
      : '';

    const QUERY =
      'select sepa_agreement_number ' +
      'from discovery_sepa where ' +
      `discovery_sepa.discovery_id = '${discoveryId}' `;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Prospect Sepa - Create or update prospect sepa info
   * @returns
   */
  async createOrUpdateProspectSepaInfo(prospectData: any) {
    try {
      console.log('prospectData', prospectData);
      const prospect = await this.getPLProspectInfo();
      const discoveryId = prospect?.discoveryId ? prospect.discoveryId : '';

      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
      const currentDate = getISOCurrentDate();

      const collection = this.getCollection(ENTITY);

      // previous customer basic info
      const isFinalizing = prospectData.isFinalizing
        ? prospectData.isFinalizing
        : false;
      const mandateReferenceNumber = prospectData?.mandateReferenceNumber
        ? prospectData.mandateReferenceNumber
        : '';
      const nameOfAccountHolder = prospectData?.nameOfAccountHolder
        ? prospectData.nameOfAccountHolder
        : '';
      const ibanNumber = prospectData?.ibanNumber
        ? prospectData.ibanNumber
        : '';
      const customerSignature = prospectData?.customerSignature
        ? prospectData.customerSignature
        : '';

      let sepaStatus = prospectData?.sepaStatus ? prospectData.sepaStatus : '';
      if (customerSignature != '') {
        sepaStatus = '1';
      }
      const agreementType = prospectData?.agreementType
        ? prospectData.agreementType == SEPA_AGREEMENT_TYPE_DROPDOWN[0].value
          ? '1'
          : '2'
        : '';
      const generateAgreementNo = prospectData?.generateAgreementNo
        ? prospectData.generateAgreementNo
        : '';
      let sepaAgreementNumber = '';

      console.log("generate,,,,,no...", generateAgreementNo)

      sepaAgreementNumber = `${generateAgreementNo
        .replace(/[^0-9]/g, '')
        .slice(0, 10)
        .padStart(10, '0')
        }00001`;

      console.log('sepaAgreementNumber', sepaAgreementNumber);

      let entity = await collection
        .query(Q.where('discovery_id', discoveryId))
        .fetch();

      if (entity.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await entity[0].update((rec: any) => {
            if (isFinalizing) {
              rec.sepaStatus = '2';
            } else {
              rec.sepaStatus = sepaStatus;
            }
            if (customerSignature && !prospectData?.signedDate) {
              rec.sepaSignedDatetime = currentDate;
            }
            rec.mandateReferenceNumber = mandateReferenceNumber;
            rec.accountHolderName = nameOfAccountHolder;
            rec.bankName = '';
            rec.iban = ibanNumber;

            rec.signatureCustomer = customerSignature;
            rec.formType = agreementType;
            rec.updateEmployeeNumber = employeeNo;
            rec.updateDatetime = currentDate;

            rec.sentDatetime = null;
          });
        });
      } else {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await collection.create((rec: any) => {
            rec.discoveryId = discoveryId;
            if (isFinalizing) {
              rec.sepaStatus = '2';
            } else {
              rec.sepaStatus = sepaStatus;
            }
            if (customerSignature && !prospectData?.signedDate) {
              rec.sepaSignedDatetime = currentDate;
            }
            rec.sepaAgreementNumber = sepaAgreementNumber;
            rec.mandateReferenceNumber = mandateReferenceNumber;
            rec.accountHolderName = nameOfAccountHolder;
            rec.bankName = '';
            rec.iban = ibanNumber;
            rec.signatureCustomer = customerSignature;
            rec.formType = agreementType;
            rec.creationEmployeeNumber = employeeNo;
            rec.updateEmployeeNumber = null;
            rec.creationDatetime = currentDate;
            rec.updateDatetime = null;
            rec.sentDatetime = null;
          });
        });
      }
      return true;
    } catch (error) {
      console.log(
        'createOrUpdateProspectDiscoveryContactsInfo error :>> ',
        error,
      );
      return false;
    }
  }

  async deleteSepaAgreement() {
    try {
      const collection = await this.getCollection(ENTITY);
      const prospect = await this.getPLProspectInfo();
      const discoveryId = prospect?.discoveryId ? prospect.discoveryId : '';
      console.log('discoveryId', discoveryId);
      const recordExists = await collection
        .query(Q.where('discovery_id', discoveryId))
        .fetch();

      if (recordExists.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await recordExists[0].destroyPermanently(); // Delete the record
        });
        return true;
      } else {
        console.log('Record  not found');
        return false;
      }
    } catch (error) {
      console.log('Error deleting record', error);
      return false;
    }
  }

  /**
   * Function returns for SEPA agreement check
   * @returns []
   */
  async checkSEPAAgreements() {
    try {
      const collection = this.getCollection(ENTITY);
      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      let QUERY =
        'SELECT ' +
        'Discovery_Id FROM ' +
        'Discovery_SEPA ' +
        `WHERE Discovery_Id ='${discoveryId}' ` +
        "AND SEPA_Status ='2'";

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
}
