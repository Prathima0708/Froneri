import BaseRepo from './BaseRepo';
import Employees from 'src/storage/OfflineDBStorage/WmDB/models/Employees';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import {EMPLOYEE_CATEGORY} from 'src/utils/DbConst';

const ENTITY = OFFLINE_STORAGE.MODEL.EMPLOYEES;
const SALES_REP_ENTITY = OFFLINE_STORAGE.MODEL.SALES_REPRESENTATIVES;

export class EmployeesRepo extends BaseRepo<Employees> {
  /**
   * Fetch LoggedIn User Employee Info to update in redux store
   * @param {loggedInUserMailId} string
   * @returns -> Employee Obj
   */
  async findLoggedInEmployeeInfo(loggedInUserMailId: string) {
    if (loggedInUserMailId.length === 0) {
      return;
    }
    const empCollection = this.getCollection(ENTITY);

    let results = await empCollection
      .query(
        Q.unsafeSqlQuery(
          'select employee_number as employeeNumber, windows_name as windowsName, ' +
            'employees.id_call_center as idCallCenter, call_place_number as callPlaceNumber, ' +
            'first_name as firstName, last_name as lastName, phone, ' +
            'language, mail_address as mailAddress, ' +
            'id_employee_function as idEmployeeFunction, ' +
            'enable_alternative_tours as enableAlternativeTours, ' +
            'km_limit_alternative_tours as kmLimitAlternativeTours, ' +
            'time_limit_alternative_tours as timeLimitAlternativeTours, ' +
            'enable_customer_language as enableCustomerLanguage, ' +
            'enable_stock_updates as enableStockUpdates, ' +
            'enable_test_user as enableTestUser, ' +
            'reset_environment as resetEnvironment, ' +
            'synchronization_master_station as synchronizationMasterStation, ' +
            'enable_quick_cancel as enableQuickCancel, ' +
            'time_message_not_transfered_orders as timeMessageNotTransferedOrders, ' +
            'enable_fax_orders as enableFaxOrders, ' +
            'enable_print_preview as enablePrintPreview, ' +
            'enable_show_price_calculation_detail as enableShowPriceCalculationDetail, ' +
            'last_connection_datetime as lastConnectionDatetime, ' +
            'last_connection_version as lastConnectionVersion, ' +
            'deleted, synchronize_all_data as synchronizeAllData, ' +
            'enable_free_products as enableFreeProducts, ' +
            'enable_mobile_user as enableMobileUser, ' +
            'employee_category as employeeCategory, ' +
            'telesales_manager as telesalesManager, ' +
            'telesales_deputy_manager as telesalesDeputyManager , ' +
            'regional_trade_asset_manager as regionalTradeAssetManager, ' +
            'fsm_approval_for_ta_order as fsmApprovalForTaOrder, ' +
            'fsm_approval_for_posm_order as fsmApprovalForPosmOrder, ' +
            'dual_mode as dualMode, ' +
            'last_logged_in_employee_category as lastLoggedInEmployeeCategory, ' +
            'is_citrix_user as isCitrixUser, ' +
            'enable_display_mode as enableDisplayMode, ' +
            'id_sales_team as idSalesTeam, ' +
            'head_of_sales as headOfSales, ' +
            'call_centers.id_region as idRegion from employees ' +
            'left join call_centers on employees.id_call_center = call_centers.id_call_center ' +
            `where mail_address = '${loggedInUserMailId}' `,
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
   * Function to get Delegated Employee for loggedIn user to update in redux store
   * @param {mailId} string
   * @returns -> Employee Obj
   */
  async findLoggedInDelegatedEmployeeInfo(employeeNumber: string) {
    const empCollection = this.getCollection(ENTITY);

    let results = await empCollection
      .query(
        Q.unsafeSqlQuery(
          'select employee_number as employeeNumber, windows_name as windowsName, id_call_center as idCallCenter, call_place_number as callPlaceNumber, id_sales_team as idSalesTeam, head_of_sales as headOfSales, first_name || " " || last_name as delegatedEmployeeName from employees where employee_number = (select employee_number from sales_representatives where secondary_responsible = ? limit 1)',
          [employeeNumber],
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
   * Fetch LoggedIn User Employee Info to update in redux store
   * @param {loggedInUserMailId} string
   * @returns -> Employee Obj
   */
  async getEmployeeInfoBasedOnEmployeeId(employeeNo: string) {
    if (employeeNo.length === 0) {
      return [];
    }
    const collection = this.getCollection(ENTITY);
    let results = await collection
      .query(Q.where('employee_number', employeeNo))
      .fetch();
    if (results) {
      results = this.copyPropertiesFromDBObjToResultsObj(results);
      return results;
    } else {
      return [];
    }
  }

  /**
   * Update the Employee Info for the LoggedIn User
   * @returns
   */
  async findAndUpdateUserData(userInfo: any) {
    const collection = this.getCollection(ENTITY);

    const callPlaceNumber = userInfo?.value || '';
    const userName = userInfo?.name || '';
    const userEmail = userInfo?.email || '';

    let callsObj = await collection
      .query(Q.where('call_place_number', callPlaceNumber))
      .fetch();

    if (callsObj.length > 0) {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await callsObj[0].update((rec: any) => {
          rec.windowsName = userName;
          console.log('windowsName :>> ', rec.windowsName);
          rec.mailAddress = userEmail;
          console.log('mailAddress :>> ', rec.mailAddress);
        });
      });
      return true;
    } else {
      return false;
    }
  }

  /**
   * Function returns created by and updated by employees
   * @returns
   */
  async getCreatedByAndUpdatedByEmployees(searchText?: string) {
    const collection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const idRegion = employeeInfo.length > 0 ? employeeInfo[0].idRegion : '';

    const QUERY =
      "SELECT * FROM (SELECT  Employees.Last_Name || ' ' || Employees.First_Name ||' - ' || Employee_Number As name, " +
      'Employee_Number as employeeNumber FROM  Employees LEFT JOIN Call_Centers ' +
      'ON Call_Centers.ID_Call_Center = Employees.ID_Call_Center ' +
      "WHERE Employees.Deleted = '0'  AND  Employees.Employee_Category <> '2' " +
      "AND Employees.Enable_Test_User = '0' UNION " +
      "SELECT  Sales_Representatives.Last_Name || ' ' || Sales_Representatives.First_Name || " +
      "' - '|| COALESCE(Employees.Employee_Number, Partner_Number) As name, " +
      'CASE WHEN Employees.Employee_Number IS NULL THEN  Partner_Number ' +
      'ELSE Employees.Employee_Number END  AS employeeNumber FROM Sales_Representatives ' +
      'INNER JOIN Employees ON Sales_Representatives.Employee_Number =  Employees.Employee_Number ' +
      'LEFT JOIN Call_Centers ON Call_Centers.ID_Call_Center = Sales_Representatives.ID_Call_Center ' +
      "WHERE ((Employees.Employee_Category = '2'  AND Employees.Enable_Test_User = '0' ) AND Employees.Deleted = '0' ) " +
      `AND ( Sales_Representatives.ID_Call_Center = 0 OR  Call_Centers.ID_Region = ${idRegion} ) ORDER BY name)`;

    let FILTER_QUERY = '';

    if (searchText && searchText.trim().length > 0) {
      FILTER_QUERY += ` WHERE name LIKE '%${searchText}%'`;
    }

    FILTER_QUERY = FILTER_QUERY + ' LIMIT 10';

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY + FILTER_QUERY))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns employees
   * @returns
   */
  async getEmployeesList(searchText?: string) {
    const collection = this.getCollection(ENTITY);

    const QUERY =
      "select * from ( SELECT Employees.Employee_number as employeeNumber, Employees.Last_Name || '-' || Employees.First_Name " +
      "|| '-' || Employees.Employee_Number AS employeeDetails FROM  Employees WHERE  Employees.Deleted <> '1' " +
      "And Employees.Employee_Category='2' UNION SELECT DISTINCT Sales_Representatives.Employee_Number " +
      "AS employeeNumber, Sales_Representatives.Last_Name || '-' || Sales_Representatives.First_Name || " +
      "'-' || Sales_Representatives.Employee_Number AS employeeDetails FROM  Sales_Representatives " +
      "WHERE Sales_Representatives.First_Name <> '' AND Sales_Representatives.Employee_Number <> '') ";

    let FILTER_QUERY = '';

    if (searchText && searchText.trim().length > 0) {
      FILTER_QUERY += ` WHERE employeeDetails LIKE '%${searchText}%'`;
    }

    FILTER_QUERY = FILTER_QUERY + ' Order by employeeDetails LIMIT 10';

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY + FILTER_QUERY))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns list of responsible person and creator
   * @returns
   */
  async getResponsiblePersonAndCreatorList(searchText: string) {
    try {
      const collection = this.getCollection(ENTITY);
      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const idRegion = employeeInfo.length > 0 ? employeeInfo[0].idRegion : '';

      const QUERY =
        "select * from (select employees.last_name || ' ' || employees.first_name as name, " +
        'employee_number as employeeNumber, first_name as firstName, ' +
        "last_name as lastName, id_region as idRegion, 'TESS User' as typeOfUser " +
        'from employees left join call_centers on call_centers.id_call_center = employees.id_call_center ' +
        "where employees.deleted = '0' and employees.employee_category <> ? and employees.enable_test_user = '0' " +
        "union select sales_representatives.last_name || ' ' || sales_representatives.first_name as name, " +
        'case when employees.employee_number is null then partner_number else employees.employee_number ' +
        'end as employeeNumber, sales_representatives.first_name as firstName, sales_representatives.last_name as lastName, ' +
        "id_region as idRegion, 'Sales Rep' as typeOfUser from sales_representatives inner join employees on " +
        'sales_representatives.employee_number = employees.employee_number left join call_centers on ' +
        'call_centers.id_call_center = sales_representatives.id_call_center where ((employees.employee_category = ? ' +
        "and employees.enable_test_user = '0') and employees.deleted = '0') and (sales_representatives.id_call_center = 0 " +
        'or call_centers.id_region = ?)  order by last_name, first_name)';

      const QUERY_VALUES = [
        EMPLOYEE_CATEGORY.FIELDSALES,
        EMPLOYEE_CATEGORY.FIELDSALES,
        idRegion,
      ];

      let FILTER_QUERY = '';

      if (searchText && searchText.trim().length > 0) {
        FILTER_QUERY += ` WHERE name LIKE '%${searchText}%' or employeeNumber LIKE '%${searchText}%'`;
      }

      FILTER_QUERY += ' LIMIT 10';

      console.log('filter employee query :>> ', FILTER_QUERY);

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY + FILTER_QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getResponsiblePersonAndCreatorList error :>> ', error);
      return [];
    }
  }
}
