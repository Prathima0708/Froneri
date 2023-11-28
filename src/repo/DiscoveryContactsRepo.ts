import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import DiscoveryContacts from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryContacts';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {getISOCurrentDate} from 'src/utils/CommonUtil';
import {IContactInfo} from 'src/views/private/ProspectLanding/PLContacts/PLContacts';

const ENTITY = OFFLINE_STORAGE.MODEL.DISCOVERY_CONTACTS;

export class DiscoveryContactsRepo extends BaseRepo<DiscoveryContacts> {
  /**
   * create new prospect - discovery contacts info insert function
   * Function returns true/false based on prospect is inserted or not
   * discoveryId, previousCustomerBasicInfo - get from screen
   * @returns
   */
  async saveCreateProspectDiscoveryContactsInfo(
    discoveryId: string,
    previousCustomerBasicInfoData: any,
  ) {
    try {
      const collection = this.getCollection(ENTITY);

      const previousCustomerBasicInfo = previousCustomerBasicInfoData[0];

      // previous customer basic info
      const contact1Phone1 = previousCustomerBasicInfo?.contact1Phone1
        ? previousCustomerBasicInfo.contact1Phone1
        : '';
      const contact2Phone1 = previousCustomerBasicInfo?.contact2Phone1
        ? previousCustomerBasicInfo.contact2Phone1
        : '';
      const contact1Phone2 = previousCustomerBasicInfo?.contact1Phone2
        ? previousCustomerBasicInfo.contact1Phone2
        : '';
      const contact2Phone2 = previousCustomerBasicInfo?.contact2Phone2
        ? previousCustomerBasicInfo.contact2Phone2
        : '';

      const contact1MailAddress = previousCustomerBasicInfo?.contact1MailAddress
        ? previousCustomerBasicInfo.contact1MailAddress
        : '';
      const contact2MailAddress = previousCustomerBasicInfo?.contact2MailAddress
        ? previousCustomerBasicInfo.contact2MailAddress
        : '';
      const contact1Name = previousCustomerBasicInfo?.contact1Name
        ? previousCustomerBasicInfo.contact1Name
        : '';
      const contact2Name = previousCustomerBasicInfo?.contact2Name
        ? previousCustomerBasicInfo.contact2Name
        : '';

      const discoveryContactsData = await collection
        .query(Q.where('discovery_id', discoveryId))
        .fetch();

      // if exists, update. else create.
      if (discoveryContactsData.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          discoveryContactsData[0].update((rec: any) => {
            rec.phoneNumContact1 = contact1Phone1;
            rec.phoneNumContact2 = contact2Phone1;
            rec.mobileNumContact1 = contact1Phone2;
            rec.mobileNumContact2 = contact2Phone2;
            rec.emailContact1 = contact1MailAddress;
            rec.emailContact2 = contact2MailAddress;
            rec.firstNameContact1 = contact1Name;
            rec.firstNameContact2 = contact2Name;
            rec.sentDatetime = null;
          });
        });
      } else {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await collection.create((rec: any) => {
            rec.discoveryId = discoveryId;
            rec.phoneNumContact1 = contact1Phone1;
            rec.phoneNumContact2 = contact2Phone1;
            rec.mobileNumContact1 = contact1Phone2;
            rec.mobileNumContact2 = contact2Phone2;
            rec.emailContact1 = contact1MailAddress;
            rec.emailContact2 = contact2MailAddress;
            rec.firstNameContact1 = contact1Name;
            rec.firstNameContact2 = contact2Name;
            rec.sentDatetime = null;
          });
        });
      }
      return true;
    } catch (error) {
      console.log('saveCreateProspectDiscoveryContactsInfo error :>> ', error);
      return false;
    }
  }

  /**
   * Prospect Ship to  - discovery contacts info insert function
   * @returns
   */
  async createOrUpdateProspectDiscoveryContactsInfo(prospectData: any) {
    try {
      console.log('prospectData', prospectData);
      const prospect = await this.getPLProspectInfo();
      const discoveryId = prospect?.discoveryId ? prospect.discoveryId : '';
      const collection = this.getCollection(ENTITY);

      // previous customer basic info
      const firstNameContact1 = prospectData?.name1 ? prospectData.name1 : '';
      const phoneNumContact1 = prospectData?.phoneNumber
        ? prospectData.phoneNumber
        : '';
      const mobileNumContact1 = prospectData?.mobileNumber
        ? prospectData.mobileNumber
        : '';
      const emailContact1 = prospectData?.email ? prospectData.email : '';

      const faxNumContact1 = prospectData?.fax ? prospectData.fax : '';

      let entity: any = undefined;

      // if exists, update. else create.
      if (discoveryId) {
        entity = await collection
          .query(Q.where('discovery_id', discoveryId))
          .fetch();
      }
      console.log('entity', entity);

      if (entity.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await entity[0].update((rec: any) => {
            rec.firstNameContact1 = firstNameContact1;
            rec.phoneNumContact1 = phoneNumContact1;
            rec.mobileNumContact1 = mobileNumContact1;
            rec.emailContact1 = emailContact1;
            rec.faxNumContact1 = faxNumContact1;
            rec.sentDatetime = null;
          });
        });
      } else {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await collection.create((rec: any) => {
            rec.discoveryId = discoveryId;
            rec.firstNameContact1 = firstNameContact1;
            rec.phoneNumContact1 = phoneNumContact1;
            rec.mobileNumContact1 = mobileNumContact1;
            rec.emailContact1 = emailContact1;
            rec.faxNumContact1 = faxNumContact1;
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

  /**
   * Function returns contact info data
   * @returns []
   */
  async getContactsData() {
    const prospectData = await this.getPLProspectInfo();
    const discoveryId = prospectData?.discoveryId
      ? prospectData.discoveryId
      : '';
    const collection = this.getCollection(ENTITY);
    let results = await collection
      .query(
        Q.unsafeSqlQuery(
          'SELECT designation_contact_1 AS designationContact1, ' +
            'designation_contact_2 AS designationContact2, ' +
            "CASE WHEN discovery.customer_status_code = 'C'" +
            ' THEN customers.contact1_name Else first_name_contact_1 END AS firstNameContact1, ' +
            "CASE WHEN discovery.customer_status_code = 'C'" +
            ' THEN customers.contact2_name Else first_name_contact_2 END AS firstNameContact2, ' +
            'last_name_contact_1 AS lastNameContact1, last_name_contact_2 AS lastNameContact2, ' +
            "CASE WHEN discovery.customer_status_code = 'C'" +
            ' THEN customers.contact1_phone_1 Else phone_num_contact_1 END AS phoneNumContact1, ' +
            "CASE WHEN discovery.customer_status_code = 'C'" +
            ' THEN customers.contact1_phone_2 Else phone_num_contact_2 END AS phoneNumContact2, ' +
            "CASE WHEN discovery.customer_status_code = 'C'" +
            ' THEN customers.contact1_phone_2 Else mobile_num_contact_1 END AS mobileNumContact1, ' +
            "CASE WHEN discovery.customer_status_code = 'C'" +
            ' THEN customers.contact2_phone_2 Else mobile_num_contact_2 END AS mobileNumContact2, ' +
            'fax_num_contact_1 AS faxNumContact1, fax_num_contact_2 AS faxNumContact2, ' +
            "CASE WHEN discovery.customer_status_code = 'C'" +
            ' THEN customers.contact1_mail_address Else email_contact_1 END AS emailContact1, ' +
            "CASE WHEN discovery.customer_status_code = 'C' " +
            ' THEN customers.contact2_mail_address Else email_contact_2 END AS emailContact2, ' +
            'comment1, comment2 FROM discovery_contacts As discoveryContacts INNER JOIN prospects ON discoveryContacts.discovery_id = prospects.discovery_id ' +
            'INNER JOIN discovery ON discovery.discovery_id = prospects.discovery_id ' +
            "AND prospects.delete_prospect <> '1' LEFT JOIN customers " +
            'ON discovery.customer_ship_to = customers.customer_ship_to ' +
            'AND prospects.sales_organization = customers.sales_organization ' +
            'AND prospects.distribution_channel = customers.distribution_channel ' +
            `WHERE discoveryContacts.discovery_id = '${discoveryId}' `,
        ),
      )
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns true/false based on discovery contacts update or insert
   * @returns
   */
  async updateOrInsertDiscoveryContacts(
    contacts1obj: IContactInfo,
    contacts2obj: IContactInfo,
  ) {
    try {
      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';
      const collection = this.getCollection(ENTITY);
      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
      const currentDate = getISOCurrentDate();
      //Update Contact Info
      const prospectObj = await collection
        .query(Q.where('discovery_id', discoveryId))
        .fetch();
      if (prospectObj.length > 0) {
        // Update contact info
        await OFFLINE_STORAGE.getDB().write(async () => {
          await prospectObj[0].update((rec: any) => {
            rec.designationContact1 = contacts1obj.title
              ? contacts1obj.title?.label
              : '';
            rec.designationContact2 = contacts2obj.title
              ? contacts2obj.title?.label
              : '';
            rec.firstNameContact1 = contacts1obj.firstName;
            rec.firstNameContact2 = contacts2obj.firstName;
            rec.lastNameContact1 = contacts1obj.lastName;
            rec.lastNameContact2 = contacts2obj.lastName;
            rec.phoneNumContact1 = contacts1obj.phoneNumber;
            rec.phoneNumContact2 = contacts2obj.phoneNumber;
            rec.mobileNumContact1 = contacts1obj.mobileNumber;
            rec.mobileNumContact2 = contacts2obj.mobileNumber;
            rec.faxNumContact1 = contacts1obj.faxNumber;
            rec.faxNumContact2 = contacts2obj.faxNumber;
            rec.emailContact1 = contacts1obj.email;
            rec.emailContact2 = contacts2obj.email;
            rec.comment1 = contacts1obj.notes;
            rec.comment2 = contacts2obj.notes;
            rec.updateEmployeeNumber = employeeNo;
            rec.updateDatetime = currentDate;
            rec.sentDatetime = null;
          });
        });
        return true;
      } else {
        //Insert contact data

        await OFFLINE_STORAGE.getDB().write(async () => {
          await collection.create((rec: any) => {
            rec.discoveryId = discoveryId;
            rec.designationContact1 = contacts1obj.title
              ? contacts1obj.title?.label
              : '';
            rec.designationContact2 = contacts2obj.title
              ? contacts2obj.title?.label
              : '';
            rec.firstNameContact1 = contacts1obj.firstName;
            rec.firstNameContact2 = contacts2obj.firstName;
            rec.lastNameContact1 = contacts1obj.lastName;
            rec.lastNameContact2 = contacts2obj.lastName;
            rec.phoneNumContact1 = contacts1obj.phoneNumber;
            rec.phoneNumContact2 = contacts2obj.phoneNumber;
            rec.mobileNumContact1 = contacts1obj.mobileNumber;
            rec.mobileNumContact2 = contacts2obj.mobileNumber;
            rec.faxNumContact1 = contacts1obj.faxNumber;
            rec.faxNumContact2 = contacts2obj.faxNumber;
            rec.emailContact1 = contacts1obj.email;
            rec.emailContact2 = contacts2obj.email;
            rec.comment1 = contacts1obj.notes;
            rec.comment2 = contacts2obj.notes;
            rec.updateEmployeeNumber = employeeNo;
            rec.updateDatetime = currentDate;
            rec.sentDatetime = null;
          });
        });
        return true;
      }
    } catch (error) {
      console.log('insertProspectVisitNotesData error :>> ', error);
      return false;
    }
  }
}
