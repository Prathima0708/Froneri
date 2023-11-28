import BaseRepo from './BaseRepo';
import CustomerVacations from 'src/storage/OfflineDBStorage/WmDB/models/CustomerVacations';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import {getUUID} from 'src/utils/CommonUtil';

const ENTITY = OFFLINE_STORAGE.MODEL.CUSTOMER_VACATIONS;

export class CustomerVacationsRepo extends BaseRepo<CustomerVacations> {
  /**
   * Function returns the data of unavailable customers
   * @returns
   */
  async checkUnavailableCustomers(customersShipTo: string[], date: string) {
    const collection = this.getCollection(ENTITY);

    // Set timezone offset to zero
    const selectedDate = new Date(date);
    selectedDate.setMinutes(
      selectedDate.getMinutes() - selectedDate.getTimezoneOffset(),
    );
    const formattedDate = new Date(selectedDate).toISOString().split('T')[0];

    const QUERY =
      `SELECT customer_ship_to, start_vacation_datetime, end_vacation_datetime ` +
      `FROM customer_vacations ` +
      `WHERE customer_ship_to IN ('${customersShipTo.join("','")}') ` +
      `AND DATE(start_vacation_datetime) <= '${formattedDate}' ` +
      `AND DATE(end_vacation_datetime) >= '${formattedDate}' and deletion_requested <> '1' `;
    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return 0;
    }
  }

  async checkIsCustomerOnVacation(customerShipTo: string) {
    const collection = this.getCollection(ENTITY);

    const QUERY =
      'select customer_ship_to as customerShipTo, end_vacation_datetime as endVacationDateTime from ' +
      'customer_vacations where customer_ship_to = ? ' +
      "and strftime('%Y-%m-%d', 'now') between " +
      "strftime('%Y-%m-%d', start_vacation_datetime) " +
      "and strftime('%Y-%m-%d', end_vacation_datetime) and deletion_requested <> '1'";

    const QUERY_VALUES = [customerShipTo];

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
      .unsafeFetchRaw();

    if (results.length > 0) {
      return results;
    }
    return [];
  }

  /**
   *
   * @returns customers all vacation
   */
  async getCustomersAllVacations() {
    const collection = this.getCollection(ENTITY);
    const customerInfo: any = await this.getCLCustomerInfo();

    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';

    const QUERY =
      'select id_customer_vacations as idCustomerVacations, start_vacation_datetime as [from], ' +
      'end_vacation_datetime as [to], remarks as remark ' +
      'from customer_vacations ' +
      `where customer_ship_to = '${customerShipTo}' ` +
      'and deletion_requested <> "1" ' +
      'AND strftime("%Y%m%d", end_vacation_datetime) >= strftime("%Y%m%d", "now") ' +
      'order by start_vacation_datetime limit 30';

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    if (results.length > 0) {
      return results;
    }
    return [];
  }

  /**
   *
   * @returns customers past vacation
   */
  async getCustomersPastVacations() {
    const collection = this.getCollection(ENTITY);
    const customerInfo: any = await this.getCLCustomerInfo();

    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';

    const QUERY =
      'select id_customer_vacations as idCustomerVacations, start_vacation_datetime as [from], ' +
      'end_vacation_datetime as [to], remarks as remark, deletion_requested ' +
      'from customer_vacations ' +
      `where customer_ship_to = '${customerShipTo}' ` +
      'and deletion_requested <> "1" ' +
      'AND strftime("%Y%m%d", end_vacation_datetime) < strftime("%Y%m%d", "now") ' +
      'order by start_vacation_datetime limit 30';

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    if (results.length > 0) {
      return results;
    }
    return [];
  }

  /**
   * create / update customer  vacation
   * @returns
   */
  async createOrUpdateCustomerVacation(vacationObj: any) {
    const customerInfo: any = await this.getCLCustomerInfo();

    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';

    const collection = this.getCollection(ENTITY);
    let entity: any = undefined;
    console.log('vacationObj', vacationObj);

    // if exists, update. else create.
    if (vacationObj.idCustomerVacations) {
      entity = await collection
        .query(
          Q.where('id_customer_vacations', vacationObj.idCustomerVacations),
        )
        .fetch();
    }

    if (entity) {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await entity[0].update((rec: any) => {
          rec.customerShipTo = customerShipTo;
          rec.startVacationDatetime = vacationObj.fromDate;
          rec.endVacationDatetime = vacationObj.toDate;
          rec.remarks = vacationObj.remark;
          rec.sentDatetime = null;
          rec.deletionRequested = '0';
        });
      });
    } else {
      const idCustomerVacations = await getUUID();
      console.log('idCustomerVacations', idCustomerVacations);
      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.idCustomerVacations = idCustomerVacations;
          rec.customerShipTo = customerShipTo;
          rec.startVacationDatetime = vacationObj.fromDate;
          rec.endVacationDatetime = vacationObj.toDate;
          rec.remarks = vacationObj.remark;
          rec.sentDatetime = null;
          rec.deletionRequested = '0';
        });
      });
      return;
    }
  }

  /**
   * Delete customer vacations  (soft delete)
   */
  async deleteCustomerVacation(idCustomerVacations: string) {
    const collection = this.getCollection(ENTITY);
    let entity: any = undefined;

    // if exists, update. else create.
    if (idCustomerVacations) {
      entity = await collection
        .query(Q.where('id_customer_vacations', idCustomerVacations))
        .fetch();
    }

    if (entity) {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await entity[0].update((rec: any) => {
          rec.deletionRequested = '1';
          rec.sentDatetime = null;
        });
      });
    } else {
      return undefined;
    }
  }
}
