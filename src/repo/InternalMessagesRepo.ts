import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import InternalMessages from 'src/storage/OfflineDBStorage/WmDB/models/InternalMessages';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {getISOCurrentDate, getUUID} from 'src/utils/CommonUtil';

const ENTITY = OFFLINE_STORAGE.MODEL.INTERNAL_MESSAGES;

export class InternalMessagesRepo extends BaseRepo<InternalMessages> {
  /**
   * Function returns customer notes / internal messages
   * @returns []
   */
  async getCustomerNotes() {
    const collection = this.getCollection(ENTITY);

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

    let QUERY =
      'select internal_messages.id_internal_message as idInternalMessage, ' +
      'case when internal_messages.updation_datetime is null ' +
      'then internal_messages.creation_datetime else ' +
      'internal_messages.updation_datetime end as creationDate, ' +
      'case when emp.employee_number is null ' +
      'then employees.first_name || " " || employees.last_name ' +
      'else emp.first_name || " " || emp.last_name ' +
      'end as employeeName, 0 as modified, 0 as deleted, ' +
      'internal_messages.type, internal_messages.valid_to_datetime as validToDate, ' +
      'internal_messages.body as internalMessages ' +
      'from internal_messages ' +
      'left join employees ' +
      'on internal_messages.creation_employee_number = employees.employee_number ' +
      'left join employees as emp ' +
      'on internal_messages.updation_employee_number = emp.employee_number ' +
      'where ' +
      `internal_messages.sales_organization = "${salesOrganization}" and ` +
      `internal_messages.distribution_channel = "${distributionChannel}" and ` +
      `internal_messages.customer_number = "${customerShipTo}" and ` +
      'coalesce(internal_messages.action,"") <> "1"  ' +
      'and (strftime("%Y%m%d", valid_to_datetime) >= strftime("%Y%m%d", "now") ' +
      'or internal_messages.valid_to_datetime is null ) ' +
      'order by ' +
      'case when internal_messages.valid_to_datetime is null ' +
      'then internal_messages.updation_datetime end desc, ' +
      'case when internal_messages.valid_to_datetime is not null ' +
      'then internal_messages.valid_to_datetime end';

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
   * create / update customer  notes
   * @returns
   */
  async createOrUpdateCustomerNotes(notesObj: any) {
    console.log('notesObj', notesObj);
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

    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';

    const currentDate = getISOCurrentDate();
    const validToDatetime =
      notesObj.validTill == '' ? null : notesObj.validTill;

    console.log('currentDate', currentDate, validToDatetime, employeeNo);
    const collection = this.getCollection(ENTITY);
    let entity: any = undefined;

    // if exists, update. else create.
    if (notesObj.idInternalMessage) {
      entity = await collection
        .query(Q.where('id_internal_message', notesObj.idInternalMessage))
        .fetch();
    }

    if (entity) {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await entity[0].update((rec: any) => {
          rec.body = notesObj.body;
          rec.validToDatetime = validToDatetime;
          rec.updationDatetime = currentDate;
          rec.updationEmployeeNumber = employeeNo;
          rec.type = '2';
          rec.sentDatetime = null;
        });
      });
    } else {
      const idInternalMessage = await getUUID();
      console.log('idInternalMessage', idInternalMessage);
      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.idInternalMessage = idInternalMessage;
          rec.customerNumber = customerShipTo;
          rec.validFromDatetime = currentDate;
          rec.validToDatetime = validToDatetime;
          rec.creationDatetime = currentDate;
          rec.creationEmployeeNumber = employeeNo;
          rec.updationEmployeeNumber = null;
          rec.updationDatetime = null;
          rec.subject = '';
          rec.body = notesObj.body;
          rec.status = '';
          rec.action = '';
          rec.sentDatetime = null;
          rec.sentDatetime = '';
          rec.salesOrganization = salesOrganization;
          rec.distributionChannel = distributionChannel;
          rec.type = '2';
        });
      });
      return;
    }
  }

  /**
   * Delete customer notes / internal messages (soft delete)
   */
  async deleteCustomerNotes(notesObj: any) {
    console.log('notesObj', notesObj);

    const collection = this.getCollection(ENTITY);
    let entity: any = undefined;

    // if exists, update. else create.
    if (notesObj.idInternalMessage) {
      entity = await collection
        .query(Q.where('id_internal_message', notesObj.idInternalMessage))
        .fetch();
    }

    if (entity) {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await entity[0].update((rec: any) => {
          rec.action = '1';
          rec.sentDatetime = null;
        });
      });
    } else {
      return undefined;
    }
  }
}
