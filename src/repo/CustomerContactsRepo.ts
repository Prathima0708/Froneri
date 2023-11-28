import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import CustomerContacts from 'src/storage/OfflineDBStorage/WmDB/models/CustomerContacts';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {getISOCurrentDate, getUUID} from 'src/utils/CommonUtil';

const ENTITY = OFFLINE_STORAGE.MODEL.CUSTOMER_CONTACTS;

export class CustomerContactsRepo extends BaseRepo<CustomerContacts> {
  /**
   * Function returns contact details
   * @returns []
   */
  async getContactDetails(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    const collection = this.getCollection(ENTITY);

    let QUERY =
      'select title, ' +
      'first_name as firstName, last_name as lastName, ' +
      'customer_contacts.phone_number as phoneNumber, ' +
      'customer_contacts.mobile_number as mobileNumber, ' +
      'customer_contacts.fax, ' +
      'customer_contacts.email_id as email, ' +
      'id_customer_contact as idCustomerContact, note ' +
      'from customer_contacts ' +
      'where customer_ship_to = ? and ' +
      'sales_organization = ? and ' +
      'distribution_channel = ? limit 2';

    let results = await collection
      .query(
        Q.unsafeSqlQuery(QUERY, [
          customerShipTo,
          salesOrganization,
          distributionChannel,
        ]),
      )
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Create / Update contact details
   * @returns
   */
  async createOrUpdateContactDetails(contactDetails: any) {
    const collection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';

    const idCustomerContact = contactDetails?.idCustomerContact ?? '';
    const title = contactDetails?.title ?? '';
    const firstName = contactDetails?.firstName ?? '';
    const lastName = contactDetails?.lastName ?? '';
    const phoneNumber = contactDetails?.phoneNumber ?? '';
    const mobileNumber = contactDetails?.mobileNumber ?? '';
    const fax = contactDetails?.fax ?? '';
    const email = contactDetails?.email ?? '';
    const note = contactDetails?.note ?? '';

    const currentDate = getISOCurrentDate();

    // Update
    if (idCustomerContact) {
      const customerContactsObj = await collection
        .query(Q.where('id_customer_contact', idCustomerContact))
        .fetch();

      if (customerContactsObj.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await customerContactsObj[0].update((rec: any) => {
            rec.title = title;
            rec.firstName = firstName;
            rec.lastName = lastName;
            rec.phoneNumber = phoneNumber;
            rec.mobileNumber = mobileNumber;
            rec.fax = fax;
            rec.emailId = email;
            rec.note = note;

            rec.updatedByEmployeeNumber = employeeNo;
            rec.updatedDatetime = currentDate;
            rec.sentDatetime = null;
          });
        });
        return true;
      }
    }
    // Create
    else {
      const idCustomerContact = getUUID();
      const customerInfo: any = await this.getCLCustomerInfo();
      const customerShipTo = customerInfo.customerShipTo
        ? customerInfo.customerShipTo
        : '';
      const salesOrganization = customerInfo.salesOrganization
        ? customerInfo.salesOrganization
        : '';
      const distributionChannel = customerInfo.distributionChannel
        ? customerInfo.distributionChannel
        : '';

      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.idCustomerContact = idCustomerContact;
          rec.customerShipTo = customerShipTo;
          rec.salesOrganization = salesOrganization;
          rec.distributionChannel = distributionChannel;

          rec.title = title;
          rec.firstName = firstName;
          rec.lastName = lastName;
          rec.phoneNumber = phoneNumber;
          rec.mobileNumber = mobileNumber;
          rec.fax = fax;
          rec.emailId = email;
          rec.note = note;

          rec.updatedByEmployeeNumber = employeeNo;
          rec.updatedDatetime = currentDate;
          rec.sentDatetime = null;
        });
      });
      return true;
    }

    return false;
  }

  /**
   * Delete contact details
   * @returns
   */
  async deleteContact(idCustomerContact: string) {
    const collection = this.getCollection(ENTITY);

    const customerContactsObj = await collection
      .query(Q.where('id_customer_contact', idCustomerContact))
      .fetch();

    if (customerContactsObj.length > 0) {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await customerContactsObj[0].destroyPermanently();
      });
      return true;
    }

    return false;
  }
}
