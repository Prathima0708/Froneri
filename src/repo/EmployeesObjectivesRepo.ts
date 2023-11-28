import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import EmployeesObjectives from 'src/storage/OfflineDBStorage/WmDB/models/EmployeesObjectives';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {CUSTOMER_TYPE} from 'src/utils/DbConst';
const ENTITY = OFFLINE_STORAGE.MODEL.EMPLOYEES_OBJECTIVES;
export class EmployeesObjectivesRepo extends BaseRepo<EmployeesObjectives> {
  /**
   * Fetch  Employee Objectives
   * @returns -> Array
   */
  async getEmployeesObjectives() {
    const collection = this.getCollection(ENTITY);
    let results = await collection.query().fetch();
    if (results.length > 0) {
      results = this.copyPropertiesFromDBObjToResultsObj(results);
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns the Employee Objective of the particular customer
   * @returns -> Array
   */
  async getEmployeeObjective(idEmployeeObjective: string) {
    const collection = this.getCollection(ENTITY);

    const QUERY =
      'select description_language_1 as descriptionLanguage1 ' +
      'from employees_objectives ' +
      'where id_employee_objective = ? ';
    // +'and customer_type = ?';

    // const QUERY_VALUES = [idEmployeeObjective, CUSTOMER_TYPE.CUSTOMER];
    const QUERY_VALUES = [idEmployeeObjective];

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
      .unsafeFetchRaw();

    if (results.length > 0) {
      return results[0].descriptionLanguage1;
    } else {
      return '';
    }
  }

  /**
   * Function returns the standard duration by checking the type (customer/prospect)
   * @returns
   */
  async getStandardDuration(statusType: string) {
    try {
      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const collection = this.getCollection(ENTITY);

      console.log('employeeInfo :>> ', employeeInfo);

      let customerType = CUSTOMER_TYPE.CUSTOMER;

      if (statusType.toLowerCase() === 'p') {
        customerType = CUSTOMER_TYPE.PROSPECT;
      }

      const QUERY =
        'select standard_duration as standardDuration, id_employee_objective as idEmployeeObjective ' +
        'from employees_objectives where customer_type = ? ' +
        "and employee_objective_type = ? and default_objective = '1' " +
        'order by employees_objectives.id_employee_objective';

      const QUERY_VALUES = [customerType, '2'];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getStandardDuration error :>> ', error);
      return [];
    }
  }
}
