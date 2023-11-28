import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {
  getCurrentDateAndTime,
  getDateTime,
  getISOCurrentDate,
  getUUID,
} from 'src/utils/CommonUtil';
import ServiceRequestsCustomersJournal from 'src/storage/OfflineDBStorage/WmDB/models/ServiceRequestsCustomersJournal';
import {
  SERVICE_REQUEST,
  SERVICE_REQUEST_JOURNAL_STATUS,
} from 'src/utils/DbConst';
import {Q} from '@nozbe/watermelondb';

const ENTITY = OFFLINE_STORAGE.MODEL.SERVICE_REQUESTS_CUSTOMERS_JOURNAL;

export class ServiceRequestsCustomersJournalRepo extends BaseRepo<ServiceRequestsCustomersJournal> {
  /**
   * Function returns true/false based on update status
   * @returns
   */
  async insertTaRequestCustomerJournal(tradeAssetId: string) {
    try {
      const collection = this.getCollection(ENTITY);
      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';

      const currentDate = getISOCurrentDate();
      const uniqueId = getUUID();

      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.idServiceRequestCustomerJournal = uniqueId;
          rec.idServiceRequestCustomer = tradeAssetId;
          rec.eventEmployeeNumber = employeeNo;
          rec.action = SERVICE_REQUEST.SERVICE_REQUEST_OPEN;
          rec.eventDatetime = currentDate;
          rec.sentDatetime = null;
        });
      });
      return true;
    } catch (error) {
      console.log('insertTaRequestCustomerJournal error :>> ', error);
      return false;
    }
  }

  /**
   * Function returns true/false based on create/update status
   * @returns
   */
  async insertOrUpdateServiceWorkflowJournal(
    idServiceRequestCustomer: string,
    actionType: string,
  ) {
    try {
      const collection = this.getCollection(ENTITY);
      const employeeInfo = await this.getLoggedInEmployeeInfo();

      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
      const currentDate = getCurrentDateAndTime();
      const idServiceRequestCustomerJournal = getUUID();

      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.idServiceRequestCustomerJournal = idServiceRequestCustomerJournal;
          rec.idServiceRequestCustomer = idServiceRequestCustomer;
          rec.eventEmployeeNumber = employeeNo;
          rec.action = actionType;
          rec.eventDatetime = currentDate;
          rec.sentDatetime = null;
        });
      });

      return true;
    } catch (error) {
      console.log('insertOrUpdateServiceWorkflowJournal error :>> ', error);
      return true;
    }
  }

  /**
   * Function returns trace grid data of particular customer
   * @returns
   */
  async getTraceGridDataOfCustomer(idServiceRequestCustomer: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const QUERY =
        `select service_requests_customers_journal.event_employee_number || ' ' || employees.last_name ` +
        `|| ' ' || employees.first_name as employee, case when action = '${SERVICE_REQUEST_JOURNAL_STATUS.CREATION}' ` +
        `then 'Creation' when action = '${SERVICE_REQUEST_JOURNAL_STATUS.ASSIGNMENT}' then 'Assignment' ` +
        `when action = '${SERVICE_REQUEST_JOURNAL_STATUS.UPDATE}' then 'Update' when action = ` +
        `'${SERVICE_REQUEST_JOURNAL_STATUS.COMPLETION}' then 'Completion' when action = ` +
        `'${SERVICE_REQUEST_JOURNAL_STATUS.CLAIM_DATA_UPDATED}' then 'Updated' else '' end as action, strftime("%d-%m-%Y %H:%M",event_datetime) as eventDatetime ` +
        `from service_requests_customers_journal left join employees on service_requests_customers_journal.event_employee_number ` +
        `= employees.employee_number where id_service_request_customer = ? order by event_datetime desc`;

      const QUERY_VALUES = [idServiceRequestCustomer];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      }

      return [];
    } catch (error) {
      console.log('getTraceGridDataOfCustomer error :>> ', error);
      return [];
    }
  }
}
