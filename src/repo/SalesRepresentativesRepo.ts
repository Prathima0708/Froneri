import BaseRepo from './BaseRepo';
import SalesRepresentatives from 'src/storage/OfflineDBStorage/WmDB/models/SalesRepresentatives';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';

const ENTITY = OFFLINE_STORAGE.MODEL.SALES_REPRESENTATIVES;

export class SalesRepresentativesRepo extends BaseRepo<SalesRepresentatives> {
  /**
   * Fetch LoggedIn User Sales Rep Info to update in redux store
   * get Employee number from redux user context using getLoggedInEmployeeInfo()
   * @returns -> Employee Obj
   */
  async findLoggedInSalesRepInfo(emp_no: string) {
    if (emp_no.length === 0) {
      return;
    }

    const collection = this.getCollection(ENTITY);
    let results = await collection
      .query(Q.where('employee_number', emp_no))
      .fetch();
    if (results) {
      results = this.copyPropertiesFromDBObjToResultsObj(results);
      return results;
    } else {
      return [];
    }
  }

  /**
   * Fetch LoggedIn User Sales Rep Info to update in redux store
   * get Employee number from redux user context using getLoggedInEmployeeInfo()
   * @returns -> Employee Obj
   */
  async getDelegatedUserIdTerritory(emp_no: string) {
    if (emp_no.length === 0) {
      return;
    }

    const collection = this.getCollection(ENTITY);
    let results = await collection
      .query(
        Q.unsafeSqlQuery(
          'Select Employee_Number  AS primaryResponsibleEmployeeNumber, ' +
            'Territories_Sales_Representatives.ID_Territory as idTerritory ' +
            'FROM Sales_Representatives ' +
            'Inner Join Territories_Sales_Representatives ' +
            'On Sales_Representatives.Partner_Number  = Territories_Sales_Representatives.Partner_Number ' +
            'where Secondary_Responsible = ? ',
          [emp_no],
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
   * Function returns responsible employee number linked with previous employee number
   * @returns
   */
  async getPreviousCustomerEmployeeNumber(
    prevCustomerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    const collection = this.getCollection(ENTITY);

    const QUERY =
      'select distinct employee_number as employeeNumber from sales_representatives ' +
      'inner join territories_sales_representatives on sales_representatives.partner_number = ' +
      'territories_sales_representatives.partner_number inner join territories_customers ' +
      'on territories_sales_representatives.id_territory = ' +
      'territories_customers.id_territory inner join customers ' +
      'on territories_customers.id_territory = customers.id_territory ' +
      'where customers.customer_ship_to = ? ' +
      'and customers.sales_organization = ? ' +
      'and customers.distribution_channel = ? ' +
      "and territories_customers.partner_function ='ZM' limit 1";

    const QUERY_VALUES = [
      prevCustomerShipTo,
      salesOrganization,
      distributionChannel,
    ];

    const results = await collection
      .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns canvasser for the employee number
   * @returns
   */
  async getCanvasser(employeeNumber: string) {
    const collection = this.getCollection(ENTITY);

    const QUERY =
      'select partner_number as partnerNumber from ' +
      'sales_representatives where ' +
      "substr('0000000000'|| partner_number, " +
      'length(partner_number) + 1, 10) = ?';

    const QUERY_VALUES = [employeeNumber];

    const results = await collection
      .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns canvasser for the sales rep
   * @returns
   */
  async getCanvasserSalesRep() {
    const collection = this.getCollection(ENTITY);

    const QUERY =
      'select sales_representatives.partner_number as partnerNumber, ' +
      "sales_representatives.last_name || ' ' || sales_representatives.first_name " +
      "|| ' ' || sales_representatives.partner_number as employee " +
      'from sales_representatives left outer join ' +
      'call_centers on sales_representatives.id_call_center = call_centers.id_call_center order by last_name, first_name';

    const results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }
  /**
   * Function returns approved by for the product claim
   * @returns
   */
  async getApprovedBy(value: string) {
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const collection = this.getCollection(ENTITY);
    const idRegion = employeeInfo.length > 0 ? employeeInfo[0].idRegion : '';

    let QUERY = `select   
      sales_representatives.partner_number as partnerNumber,  
      sales_representatives.last_name || ' '  || sales_representatives.first_name  || ' '  || sales_representatives.partner_number as salesRepresentativesName
      from  
      sales_representatives 
      left outer join  
      call_centers on  
      sales_representatives.id_call_center = call_centers.id_call_center 
      where (sales_representatives.id_call_center = 0 or id_region='${idRegion}')
       `;
    if (value.length > 0) {
      QUERY =
        QUERY +
        ` and (salesRepresentativesName like '%${value}%' OR partnerNumber like '%${value}%') `;
    }
    QUERY = QUERY + ' ORDER BY Last_Name,  First_Name  LIMIT 10';
    const results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }
}
