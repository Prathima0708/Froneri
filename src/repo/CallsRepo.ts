import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import Calls from 'src/storage/OfflineDBStorage/WmDB/models/Calls';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {getISOCurrentDate, getUUID} from 'src/utils/CommonUtil';
import {
  CALL_CATEGORY,
  CALL_TYPE,
  CUSTOMER_TYPE,
  VISITS_CALL_STATUS,
} from 'src/utils/DbConst';
import {ParametersValuesService} from 'src/services/ParametersValuesService';

const ENTITY = OFFLINE_STORAGE.MODEL.CALLS;

export class CallsRepo extends BaseRepo<Calls> {
  /**
   * Function returns open visits
   * @returns []
   */
  async getOpenVisits() {
    const collection = this.getCollection(ENTITY);

    let results = await collection
      .query(
        Q.where('call_category', Q.eq('2')),
        Q.where('deleted', Q.notEq('1')),
        Q.where('customer_ship_to', Q.notEq('0000000000')),
        Q.where('call_status', Q.oneOf(['1'])),
      )
      .fetch();

    if (results) {
      results = this.copyPropertiesFromDBObjToResultsObj(results);
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns today's visit
   * @returns []
   */
  async getMissedVisitAgenda(start: number, limit: number) {
    const collection = this.getCollection(ENTITY);

    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const delegatedEmployeeInfo = await this.getLoggedInDelegatedEmployeeInfo();
    const delegatedEmployeeNo =
      delegatedEmployeeInfo.length > 0
        ? delegatedEmployeeInfo[0].employeeNumber
        : employeeNo;

    const parametersValuesService = new ParametersValuesService();
    const parameterValue = Number(
      await parametersValuesService.getParameterValue(
        'Consider_Customers_End_Business_Date_For_Visit_Planning',
      ),
    );

    // TODO: Need to check this query
    // const query = parameterValue
    //   ? ''
    //   : "and (strftime('%Y-%m-%d', end_customer_business_datetime) >= strftime('%Y-%m-%d', 'now') or end_customer_business_datetime is null) ";
    const query = '';

    let results = await collection
      .query(
        Q.unsafeSqlQuery(
          " select '' as employee_objective, " +
            'discovery.discovery_id, ' +
            'calls.id_call, ' +
            'calls.employee_number, ' +
            'calls.customer_ship_to, ' +
            'calls.sales_organization, ' +
            'calls.distribution_channel, ' +
            'calls.id_call_center, ' +
            'calls.call_place_number, ' +
            'case ' +
            'when prefered_call_time is null ' +
            "or prefered_call_time = '' then call_from_datetime " +
            "else datetime(coalesce(strftime('%Y-%m-%d %H:%M', call_from_datetime),calls.call_from_datetime)) " +
            'end as call_from_datetime, ' +
            'case ' +
            'when prefered_call_time is null ' +
            "or prefered_call_time = '' then call_to_datetime " +
            'else case ' +
            'when call_from_datetime is not null ' +
            'and call_to_datetime is not null then ' +
            "datetime(call_from_datetime, '+' " +
            "|| (strftime('%s', call_to_datetime) - strftime('%s', call_from_datetime)) " +
            "|| ' seconds') " +
            'else calls.call_to_datetime ' +
            'end ' +
            'end as call_to_datetime, ' +
            'calls.original_call_from_datetime, ' +
            'calls.original_call_to_datetime, ' +
            'calls.effective_call_from_datetime, ' +
            'calls.effective_call_to_datetime, ' +
            'calls.deleted, ' +
            'calls.call_status, ' +
            'calls.manual_action, ' +
            'calls.visit_type, ' +
            'calls.id_employee_objective, ' +
            "coalesce(customers.name1, '') as customer_name, " +
            "coalesce(customers.name2, '') as name2, " +
            "coalesce(customers.name3, '') as name3, " +
            "coalesce(customers.city, '') as city, " +
            "coalesce(customers.postal_code, '') as postal_code, " +
            "coalesce(customers.address1, '') as address1, " +
            "coalesce(cfi.credit_blocked, '') as credit_blocked, " +
            "'' as customer_status_code, " +
            'visit_preparation_notes, ' +
            "'C' as status_type, " +
            "coalesce(customers.id_territory, '') as id_territory, " +
            "coalesce(customers.sales_manager, '') as sales_manager, " +
            "'' as created_by, " +
            "coalesce(customers.street3, '') as street3, " +
            "coalesce(customers.customer_group_15, '') as customer_group_15, " +
            'customers.delegated ' +
            'from calls ' +
            'left join customers ' +
            'on calls.customer_ship_to = customers.customer_ship_to ' +
            'and calls.sales_organization = customers.sales_organization ' +
            'and calls.distribution_channel = customers.distribution_channel ' +
            "and active_in_tess = '1' " +
            'left join customers_segregation on customers.customer_group_15 = customers_segregation.customer_group_15 ' +
            'left outer join customers_additional_information ' +
            'on customers_additional_information.customer_hierarchy_node ' +
            '= customers.customer_ship_to ' +
            'and customers_additional_information.sales_organization = ' +
            'customers.sales_organization ' +
            'and customers_additional_information.distribution_channel ' +
            '= customers.distribution_channel ' +
            'left join customers_financial_information cfi ' +
            'on customers.customer_ship_to = cfi.customer_ship_to ' +
            'and customers.sales_organization = cfi.sales_organization ' +
            'and customers.distribution_channel = cfi.distribution_channel ' +
            'left join discovery ' +
            'on calls.customer_ship_to = discovery.customer_ship_to ' +
            'left join prospects ' +
            'on prospects.discovery_id = discovery.discovery_id ' +
            'and calls.sales_organization = prospects.sales_organization ' +
            'and calls.distribution_channel = prospects.distribution_channel ' +
            "and prospects.delete_prospect = '0' " +
            "where calls.deleted = '0' " +
            "and call_category = '2' " +
            "and calls.call_type = 'O' " +
            query +
            'and (calls.employee_number in (?, ?) ' +
            'or calls.original_employee_number in (?, ?)) ' +
            "and calls.customer_ship_to <> '0000000000' " +
            "and calls.customer_ship_to not like '9%' " +
            'and calls.call_status in ("0", "1", "8") ' +
            "and strftime('%Y-%m-%d', calls.call_from_datetime) < strftime('%Y-%m-%d', 'now') " +
            'union ' +
            "select '' as employee_objective, " +
            'discovery.discovery_id, ' +
            'calls.id_call, ' +
            'calls.employee_number, ' +
            'calls.customer_ship_to, ' +
            'calls.sales_organization, ' +
            'calls.distribution_channel, ' +
            'calls.id_call_center, ' +
            'calls.call_place_number, ' +
            'case ' +
            'when prefered_call_time is null ' +
            "or prefered_call_time = '' then call_from_datetime " +
            "else datetime(coalesce(strftime('%Y-%m-%d %H:%M', call_from_datetime),calls.call_from_datetime)) " +
            'end as call_from_datetime, ' +
            'case ' +
            'when prefered_call_time is null ' +
            "or prefered_call_time = '' then call_to_datetime " +
            "else coalesce(datetime(call_from_datetime, '+' " +
            "|| (strftime('%s', call_to_datetime) - strftime('%s', call_from_datetime)) " +
            "|| ' seconds'), calls.call_to_datetime) " +
            'end as call_to_datetime, ' +
            'calls.original_call_from_datetime, ' +
            'calls.original_call_to_datetime, ' +
            'calls.effective_call_from_datetime, ' +
            'calls.effective_call_to_datetime, ' +
            'calls.deleted, ' +
            'calls.call_status, ' +
            'calls.manual_action, ' +
            'calls.visit_type, ' +
            'calls.id_employee_objective, ' +
            "coalesce(prospects.name1, '') as customer_name, " +
            "coalesce(prospects.name2, '') as name2, " +
            "coalesce(prospects.name3, '') as name3, " +
            "coalesce(prospects.city, '') as city, " +
            "coalesce(prospects.postal_code, '') as postal_code, " +
            "coalesce(prospects.address1, '') as address1, " +
            "'' as credit_blocked, " +
            "coalesce(discovery.customer_status_code, '') as customer_status_code, " +
            'visit_preparation_notes, ' +
            'case ' +
            "when discovery.indirect_prospect = '1' then 'II' " +
            "else 'p' " +
            'end as status_type, ' +
            "coalesce(prospects.id_territory, '') as id_territory, " +
            "'' as sales_manager, " +
            "coalesce(discovery.created_by, '') as created_by, " +
            "'' as street3, " +
            "'' as customer_group_15, " +
            'prospects.delegated ' +
            'from calls ' +
            'left join discovery ' +
            'on calls.customer_ship_to = discovery.prospect_number ' +
            'left join prospects ' +
            'on prospects.discovery_id = discovery.discovery_id ' +
            "where calls.deleted = '0' " +
            "and call_category = '2' " +
            "and calls.call_type = 'O' " +
            'and (calls.employee_number in (?, ?) ' +
            'or calls.original_employee_number in (?, ?)) ' +
            "and calls.customer_ship_to <> '0000000000' " +
            "and calls.customer_ship_to like '9%' " +
            'and calls.call_status in ("0", "1", "8") ' +
            "and strftime('%Y-%m-%d', calls.call_from_datetime) < strftime('%Y-%m-%d', 'now') " +
            'union ' +
            "select '' as employee_objective, " +
            'discovery.discovery_id, ' +
            'calls.id_call, ' +
            'calls.employee_number, ' +
            'calls.customer_ship_to, ' +
            'calls.sales_organization, ' +
            'calls.distribution_channel, ' +
            'calls.id_call_center, ' +
            'calls.call_place_number, ' +
            'case ' +
            'when prefered_call_time is null ' +
            "or prefered_call_time = '' then call_from_datetime " +
            "else datetime(coalesce(strftime('%Y-%m-%d %H:%M', call_from_datetime),calls.call_from_datetime)) " +
            'end as call_from_datetime, ' +
            'case ' +
            'when prefered_call_time is null ' +
            "or prefered_call_time = '' then call_to_datetime " +
            "else coalesce(datetime(call_from_datetime, '+' " +
            "|| (strftime('%s', call_to_datetime) - strftime('%s', call_from_datetime)) " +
            "|| ' seconds'), calls.call_to_datetime) " +
            'end as call_to_datetime, ' +
            'calls.original_call_from_datetime, ' +
            'calls.original_call_to_datetime, ' +
            'calls.effective_call_from_datetime, ' +
            'calls.effective_call_to_datetime, ' +
            'calls.deleted, ' +
            'calls.call_status, ' +
            'calls.manual_action, ' +
            'calls.visit_type, ' +
            'calls.id_employee_objective, ' +
            "'' as customer_name, " +
            "'' as name2, " +
            "'' as name3, " +
            "'' as city, " +
            "'' as postal_code, " +
            "'' as address1, " +
            "'' as credit_blocked, " +
            "'' as customer_status_code, " +
            'visit_preparation_notes, ' +
            "'I' as status_type, " +
            "'' as id_territory, " +
            "'' as sales_manager, " +
            "'' as created_by, " +
            "'' as street3, " +
            "'' as customer_group_15, " +
            'customers.delegated ' +
            'from calls ' +
            'left join employees_objectives ' +
            'on calls.id_employee_objective = employees_objectives.id_employee_objective ' +
            'left join customers ' +
            'on calls.customer_ship_to = customers.customer_ship_to ' +
            'and calls.sales_organization = customers.sales_organization ' +
            'and calls.distribution_channel = customers.distribution_channel ' +
            'left join discovery ' +
            'on calls.customer_ship_to = discovery.customer_ship_to ' +
            'left join prospects ' +
            'on prospects.discovery_id = discovery.discovery_id ' +
            'and calls.sales_organization = prospects.sales_organization ' +
            'and calls.distribution_channel = prospects.distribution_channel ' +
            "and prospects.delete_prospect = '0' " +
            "where calls.deleted = '0' " +
            "and calls.call_type = 'O' " +
            'and calls.employee_number in (?, ?) ' +
            "and calls.customer_ship_to = '0000000000' " +
            'and calls.call_status in ("0", "1", "8") ' +
            "and strftime('%Y-%m-%d', calls.call_from_datetime) < strftime('%Y-%m-%d', 'now') order by call_from_datetime desc limit ? offset ? ",
          [
            employeeNo,
            delegatedEmployeeNo,
            employeeNo,
            delegatedEmployeeNo,
            employeeNo,
            delegatedEmployeeNo,
            employeeNo,
            delegatedEmployeeNo,
            employeeNo,
            delegatedEmployeeNo,
            limit,
            start,
          ],
        ),
      )
      .unsafeFetchRaw();

    let BASE_TOTAL_QUERY = await collection
      .query(
        Q.unsafeSqlQuery(
          'select COUNT(*) AS totalCount from ( select ' +
            'calls.id_call ' +
            'from calls ' +
            'left join customers ' +
            'on calls.customer_ship_to = customers.customer_ship_to ' +
            'and calls.sales_organization = customers.sales_organization ' +
            'and calls.distribution_channel = customers.distribution_channel ' +
            "and active_in_tess = '1' " +
            'left join customers_segregation on customers.customer_group_15 = customers_segregation.customer_group_15 ' +
            'left outer join customers_additional_information ' +
            'on customers_additional_information.customer_hierarchy_node ' +
            '= customers.customer_ship_to ' +
            'and customers_additional_information.sales_organization = ' +
            'customers.sales_organization ' +
            'and customers_additional_information.distribution_channel ' +
            '= customers.distribution_channel ' +
            'left join customers_financial_information cfi ' +
            'on customers.customer_ship_to = cfi.customer_ship_to ' +
            'and customers.sales_organization = cfi.sales_organization ' +
            'and customers.distribution_channel = cfi.distribution_channel ' +
            "where calls.deleted = '0' " +
            "and call_category = '2' " +
            "and calls.call_type = 'O' " +
            query +
            'and (calls.employee_number in (?, ?) ' +
            'or calls.original_employee_number in (?, ?)) ' +
            "and calls.customer_ship_to <> '0000000000' " +
            "and calls.customer_ship_to not like '9%' " +
            'and calls.call_status in ("0", "1", "8") ' +
            "and strftime('%Y-%m-%d', calls.call_from_datetime) < strftime('%Y-%m-%d', 'now') " +
            'union ' +
            'select  ' +
            'calls.id_call ' +
            'from calls ' +
            'left join discovery ' +
            'on calls.customer_ship_to = discovery.prospect_number ' +
            'left join prospects ' +
            'on prospects.discovery_id = discovery.discovery_id ' +
            "where calls.deleted = '0' " +
            "and call_category = '2' " +
            "and calls.call_type = 'O' " +
            'and (calls.employee_number in (?, ?) ' +
            'or calls.original_employee_number in (?, ?)) ' +
            "and calls.customer_ship_to <> '0000000000' " +
            "and calls.customer_ship_to like '9%' " +
            'and calls.call_status in ("0", "1", "8") ' +
            "and strftime('%Y-%m-%d', calls.call_from_datetime) < strftime('%Y-%m-%d', 'now') " +
            'union ' +
            'select  ' +
            'calls.id_call ' +
            'from calls ' +
            'left join employees_objectives ' +
            'on calls.id_employee_objective = employees_objectives.id_employee_objective ' +
            'left join customers ' +
            'on calls.customer_ship_to = customers.customer_ship_to ' +
            'and calls.sales_organization = customers.sales_organization ' +
            'and calls.distribution_channel = customers.distribution_channel ' +
            "where calls.deleted = '0' " +
            "and calls.call_type = 'O' " +
            'and employee_number in (?, ?) ' +
            "and calls.customer_ship_to = '0000000000' " +
            'and calls.call_status in ("0", "1", "8") ' +
            "and strftime('%Y-%m-%d', calls.call_from_datetime) < strftime('%Y-%m-%d', 'now'))  ",
          [
            employeeNo,
            delegatedEmployeeNo,
            employeeNo,
            delegatedEmployeeNo,
            employeeNo,
            delegatedEmployeeNo,
            employeeNo,
            delegatedEmployeeNo,
            employeeNo,
            delegatedEmployeeNo,
          ],
        ),
      )
      .unsafeFetchRaw();
    console.log('BASE_TOTAL_QUERY', BASE_TOTAL_QUERY);

    if (results) {
      return {results: results, totalCount: BASE_TOTAL_QUERY[0].totalCount};
    } else {
      return {results: [], totalCount: 0};
    }
  }

  /**
   * Function returns today customers visit
   * @returns []
   */
  async getCustomersToVisitToday() {
    const collection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const delegatedEmployeeInfo = await this.getLoggedInDelegatedEmployeeInfo();
    const delegatedEmployeeNo =
      delegatedEmployeeInfo.length > 0
        ? delegatedEmployeeInfo[0].employeeNumber
        : employeeNo;

    let results = await collection
      .query(
        Q.unsafeSqlQuery(
          'select distinct c.id_call from calls c ' +
            "where date(strftime('%Y-%m-%d', call_from_datetime)) = date('now') " +
            "and c.call_status in('0', '1', '8') " +
            "and c.call_category ='2' " +
            'and c.employee_number in (?, ?) ' +
            "and c.deleted <> '1' " +
            "and c.customer_ship_to <> '0000000000' " +
            "and c.customer_ship_to not like '9%'",
          [employeeNo, delegatedEmployeeNo],
        ),
      )
      .unsafeFetchRaw();

    return results.length;
  }
  /**
   * Function returns  customers delegated visit
   * @returns []
   */
  async getDelegatedCustomersVisit() {
    const collection = this.getCollection(ENTITY);
    const delegatedEmployeeInfo = await this.getLoggedInDelegatedEmployeeInfo();
    const delegatedEmployeeNo =
      delegatedEmployeeInfo.length > 0
        ? delegatedEmployeeInfo[0].employeeNumber
        : '';

    const QUERY =
      'SELECT Distinct C.ID_Call FROM [Calls] C WHERE ' +
      "strftime('%Y-%m-%d', Call_From_DateTime) = strftime('%Y-%m-%d', 'now') " +
      "And C.Call_Status In('0', '1','8') AND " +
      "C.call_category ='2' AND C.Employee_Number IN (?) " +
      "AND C.Deleted <> '1' AND C.Customer_Ship_To <> '0000000000' AND " +
      "C.Customer_Ship_To NOT LIKE '9%' ";

    const QUERY_VALUES = [delegatedEmployeeNo];

    const results = await collection
      .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
      .unsafeFetchRaw();

    return results.length;
  }
  /**
   * Function returns  prospects delegated visit
   * @returns []
   */
  async getDelegatedProspectsVisit() {
    const collection = this.getCollection(ENTITY);

    const delegatedEmployeeInfo = await this.getLoggedInDelegatedEmployeeInfo();
    const delegatedEmployeeNo =
      delegatedEmployeeInfo.length > 0
        ? delegatedEmployeeInfo[0].employeeNumber
        : '';

    const QUERY =
      'SELECT Distinct C.ID_Call FROM [Calls] C WHERE ' +
      "strftime('%Y-%m-%d', Call_From_DateTime) = strftime('%Y-%m-%d', 'now') " +
      "And C.Call_Status In('0', '1','8') AND " +
      "C.call_category ='2' AND C.Employee_Number IN (?) " +
      "AND C.Deleted <> '1' AND C.Customer_Ship_To <> '0000000000' AND " +
      "C.Customer_Ship_To LIKE '9%' ";

    const QUERY_VALUES = [delegatedEmployeeNo];

    const results = await collection
      .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
      .unsafeFetchRaw();

    return results.length;
  }

  /**
   * Function returns  prospects to visit
   * @returns []
   */
  async getProspectsToVisitToday() {
    const collection = this.getCollection(ENTITY);

    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const delegatedEmployeeInfo = await this.getLoggedInDelegatedEmployeeInfo();
    const delegatedEmployeeNo =
      delegatedEmployeeInfo.length > 0
        ? delegatedEmployeeInfo[0].employeeNumber
        : employeeNo;

    const results = await collection
      .query(
        Q.unsafeSqlQuery(
          'select distinct c.id_call from calls c ' +
            "where date(strftime('%Y-%m-%d', call_from_datetime)) = date('now') " +
            "and c.call_status in('0', '1') " +
            "and c.call_category ='2' " +
            'and c.employee_number in (?, ?) ' +
            "and c.deleted <> '1' " +
            "and c.customer_ship_to <> '0000000000' " +
            "and c.customer_ship_to like '9%'",
          [employeeNo, delegatedEmployeeNo],
        ),
      )
      .unsafeFetchRaw();

    return results.length;
  }

  /**
   * Function returns today's visit
   * @returns []
   */
  async getVisitAgenda(startDate: string, endDate: string) {
    const collection = this.getCollection(ENTITY);

    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const delegatedEmployeeInfo = await this.getLoggedInDelegatedEmployeeInfo();
    const delegatedEmployeeNo =
      delegatedEmployeeInfo.length > 0
        ? delegatedEmployeeInfo[0].employeeNumber
        : employeeNo;

    const parametersValuesService = new ParametersValuesService();
    const parameterValue = Number(
      await parametersValuesService.getParameterValue(
        'Consider_Customers_End_Business_Date_For_Visit_Planning',
      ),
    );

    const query = parameterValue
      ? ''
      : "and (end_customer_business_datetime >= strftime('%Y-%m-%d', 'now') or end_customer_business_datetime is null) ";

    let results = await collection
      .query(
        Q.unsafeSqlQuery(
          "select '' as employee_objective, " +
            'discovery.discovery_id, ' +
            'calls.id_call, ' +
            'calls.employee_number, ' +
            'calls.customer_ship_to, ' +
            'calls.sales_organization, ' +
            'calls.distribution_channel, ' +
            'calls.id_call_center, ' +
            'calls.call_place_number, ' +
            'case ' +
            'when prefered_call_time is null ' +
            "or prefered_call_time = '' then call_from_datetime " +
            "else datetime(coalesce(strftime('%Y-%m-%d %H:%M', call_from_datetime),calls.call_from_datetime)) " +
            'end as call_from_datetime, ' +
            'case ' +
            'when prefered_call_time is null ' +
            "or prefered_call_time = '' then call_to_datetime " +
            'else case ' +
            'when call_from_datetime is not null ' +
            'and call_to_datetime is not null then ' +
            "datetime(call_from_datetime, '+' " +
            "|| (strftime('%s', call_to_datetime) - strftime('%s', call_from_datetime)) " +
            "|| ' seconds') " +
            'else calls.call_to_datetime ' +
            'end ' +
            'end as call_to_datetime, ' +
            'calls.original_call_from_datetime, ' +
            'calls.original_call_to_datetime, ' +
            'calls.effective_call_from_datetime, ' +
            'calls.effective_call_to_datetime, ' +
            'calls.deleted, ' +
            'calls.call_status, ' +
            'calls.manual_action, ' +
            'calls.visit_type, ' +
            'calls.id_employee_objective, ' +
            "coalesce(customers.name1, '') as customer_name, " +
            "coalesce(customers.name2, '') as name2, " +
            "coalesce(customers.name3, '') as name3, " +
            "coalesce(customers.city, '') as city, " +
            "coalesce(customers.postal_code, '') as postal_code, " +
            "coalesce(customers.address1, '') as address1, " +
            "coalesce(cfi.credit_blocked, '') as credit_blocked, " +
            "'' as customer_status_code, " +
            'visit_preparation_notes, ' +
            "'C' as status_type, " +
            "coalesce(customers.id_territory, '') as id_territory, " +
            "coalesce(customers.sales_manager, '') as sales_manager, " +
            "'' as created_by, " +
            "coalesce(customers.street3, '') as street3, " +
            "coalesce(customers.customer_group_15, '') as customer_group_15, " +
            'customers.delegated ' +
            'from calls ' +
            'left join customers ' +
            'on calls.customer_ship_to = customers.customer_ship_to ' +
            'and calls.sales_organization = customers.sales_organization ' +
            'and calls.distribution_channel = customers.distribution_channel ' +
            "and active_in_tess = '1' " +
            'left join customers_segregation on customers.customer_group_15 = customers_segregation.customer_group_15 ' +
            'left outer join customers_additional_information ' +
            'on customers_additional_information.customer_hierarchy_node ' +
            '= customers.customer_ship_to ' +
            'and customers_additional_information.sales_organization = ' +
            'customers.sales_organization ' +
            'and customers_additional_information.distribution_channel ' +
            '= customers.distribution_channel ' +
            'left join customers_financial_information cfi ' +
            'on customers.customer_ship_to = cfi.customer_ship_to ' +
            'and customers.sales_organization = cfi.sales_organization ' +
            'and customers.distribution_channel = cfi.distribution_channel ' +
            'left join discovery ' +
            'on calls.customer_ship_to = discovery.customer_ship_to ' +
            'left join prospects ' +
            'on prospects.discovery_id = discovery.discovery_id ' +
            'and calls.sales_organization = prospects.sales_organization ' +
            'and calls.distribution_channel = prospects.distribution_channel ' +
            "and prospects.delete_prospect = '0' " +
            "where calls.deleted = '0' " +
            "and call_category = '2' " +
            "and calls.call_type = 'O' " +
            query +
            'and (calls.employee_number in (?, ?) ' +
            'or calls.original_employee_number in (?, ?)) ' +
            "and calls.customer_ship_to <> '0000000000' " +
            "and calls.customer_ship_to not like '9%' " +
            "AND strftime('%Y-%m-%d', calls.call_from_datetime) between strftime('%Y-%m-%d', ?) and strftime('%Y-%m-%d', ?) " +
            'union ' +
            "select '' as employee_objective, " +
            'discovery.discovery_id, ' +
            'calls.id_call, ' +
            'calls.employee_number, ' +
            'calls.customer_ship_to, ' +
            'calls.sales_organization, ' +
            'calls.distribution_channel, ' +
            'calls.id_call_center, ' +
            'calls.call_place_number, ' +
            'case ' +
            'when prefered_call_time is null ' +
            "or prefered_call_time = '' then call_from_datetime " +
            "else datetime(coalesce(strftime('%Y-%m-%d %H:%M', call_from_datetime),calls.call_from_datetime)) " +
            'end as call_from_datetime, ' +
            'case ' +
            'when prefered_call_time is null ' +
            "or prefered_call_time = '' then call_to_datetime " +
            "else coalesce(datetime(call_from_datetime, '+' " +
            "|| (strftime('%s', call_to_datetime) - strftime('%s', call_from_datetime)) " +
            "|| ' seconds'), calls.call_to_datetime) " +
            'end as call_to_datetime, ' +
            'calls.original_call_from_datetime, ' +
            'calls.original_call_to_datetime, ' +
            'calls.effective_call_from_datetime, ' +
            'calls.effective_call_to_datetime, ' +
            'calls.deleted, ' +
            'calls.call_status, ' +
            'calls.manual_action, ' +
            'calls.visit_type, ' +
            'calls.id_employee_objective, ' +
            "coalesce(prospects.name1, '') as customer_name, " +
            "coalesce(prospects.name2, '') as name2, " +
            "coalesce(prospects.name3, '') as name3, " +
            "coalesce(prospects.city, '') as city, " +
            "coalesce(prospects.postal_code, '') as postal_code, " +
            "coalesce(prospects.address1, '') as address1, " +
            "'' as credit_blocked, " +
            "coalesce(discovery.customer_status_code, '') as customer_status_code, " +
            'visit_preparation_notes, ' +
            'case ' +
            "when discovery.indirect_prospect = '1' then 'II' " +
            "else 'p' " +
            'end as status_type, ' +
            "coalesce(prospects.id_territory, '') as id_territory, " +
            "'' as sales_manager, " +
            "coalesce(discovery.created_by, '') as created_by, " +
            "'' as street3, " +
            "'' as customer_group_15, " +
            'prospects.delegated ' +
            'from calls ' +
            'left join discovery ' +
            'on calls.customer_ship_to = discovery.prospect_number ' +
            'left join prospects ' +
            'on prospects.discovery_id = discovery.discovery_id ' +
            "where calls.deleted = '0' " +
            "and call_category = '2' " +
            "and calls.call_type = 'O' " +
            'and (calls.employee_number in (?, ?) ' +
            'or calls.original_employee_number in (?, ?)) ' +
            "and calls.customer_ship_to <> '0000000000' " +
            "and calls.customer_ship_to like '9%' " +
            "AND strftime('%Y-%m-%d', calls.call_from_datetime) between strftime('%Y-%m-%d', ?) and strftime('%Y-%m-%d', ?) " +
            'union ' +
            "select '' as employee_objective, " +
            'discovery.discovery_id, ' +
            'calls.id_call, ' +
            'calls.employee_number, ' +
            'calls.customer_ship_to, ' +
            'calls.sales_organization, ' +
            'calls.distribution_channel, ' +
            'calls.id_call_center, ' +
            'calls.call_place_number, ' +
            'case ' +
            'when prefered_call_time is null ' +
            "or prefered_call_time = '' then call_from_datetime " +
            "else datetime(coalesce(strftime('%Y-%m-%d %H:%M', call_from_datetime),calls.call_from_datetime)) " +
            'end as call_from_datetime, ' +
            'case ' +
            'when prefered_call_time is null ' +
            "or prefered_call_time = '' then call_to_datetime " +
            "else coalesce(datetime(call_from_datetime, '+' " +
            "|| (strftime('%s', call_to_datetime) - strftime('%s', call_from_datetime)) " +
            "|| ' seconds'), calls.call_to_datetime) " +
            'end as call_to_datetime, ' +
            'calls.original_call_from_datetime, ' +
            'calls.original_call_to_datetime, ' +
            'calls.effective_call_from_datetime, ' +
            'calls.effective_call_to_datetime, ' +
            'calls.deleted, ' +
            'calls.call_status, ' +
            'calls.manual_action, ' +
            'calls.visit_type, ' +
            'calls.id_employee_objective, ' +
            "'' as customer_name, " +
            "'' as name2, " +
            "'' as name3, " +
            "'' as city, " +
            "'' as postal_code, " +
            "'' as address1, " +
            "'' as credit_blocked, " +
            "'' as customer_status_code, " +
            'visit_preparation_notes, ' +
            "'I' as status_type, " +
            "'' as id_territory, " +
            "'' as sales_manager, " +
            "'' as created_by, " +
            "'' as street3, " +
            "'' as customer_group_15, " +
            'customers.delegated ' +
            'from calls ' +
            'left join employees_objectives ' +
            'on calls.id_employee_objective = employees_objectives.id_employee_objective ' +
            'left join customers ' +
            'on calls.customer_ship_to = customers.customer_ship_to ' +
            'and calls.sales_organization = customers.sales_organization ' +
            'and calls.distribution_channel = customers.distribution_channel ' +
            'left join discovery ' +
            'on calls.customer_ship_to = discovery.customer_ship_to ' +
            'left join prospects ' +
            'on prospects.discovery_id = discovery.discovery_id ' +
            'and calls.sales_organization = prospects.sales_organization ' +
            'and calls.distribution_channel = prospects.distribution_channel ' +
            "and prospects.delete_prospect = '0' " +
            "where calls.deleted = '0' " +
            "and calls.call_type = 'O' " +
            'and calls.employee_number in (?, ?) ' +
            "and calls.customer_ship_to = '0000000000'" +
            "AND strftime('%Y-%m-%d', calls.call_from_datetime) between strftime('%Y-%m-%d', ?) and strftime('%Y-%m-%d', ?)",
          [
            employeeNo,
            delegatedEmployeeNo,
            employeeNo,
            delegatedEmployeeNo,
            startDate,
            endDate,
            employeeNo,
            delegatedEmployeeNo,
            employeeNo,
            delegatedEmployeeNo,
            startDate,
            endDate,
            employeeNo,
            delegatedEmployeeNo,
            startDate,
            endDate,
          ],
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
   * Start Visit
   * @returns
   */
  async updateStartVisit(idCall: string) {
    const collection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const callStatusOpen = VISITS_CALL_STATUS.OPEN;
    const callStatusInitial = VISITS_CALL_STATUS.INITIAL;

    const currentDate = getISOCurrentDate();
    let callsObj = await collection
      .query(
        Q.where('id_call', idCall),
        Q.where('call_status', callStatusInitial),
      )
      .fetch();
    if (callsObj.length > 0) {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await callsObj[0].update((rec: any) => {
          rec.callStatus = callStatusOpen;
          rec.local = '1';
          rec.updationEmployeeNumber = employeeNo;
          rec.updationDatetime = currentDate;
          rec.sentDatetime = null;
        });
      });
      return;
    } else {
      return undefined;
    }
  }

  /**
   * Resume Visit
   * @returns
   */
  async updateResumeVisit(idCall: string) {
    const collection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const callStatusOpen = VISITS_CALL_STATUS.OPEN;
    const callStatusPaused = VISITS_CALL_STATUS.ONHOLD;
    const currentDate = getISOCurrentDate();
    let callsObj = await collection
      .query(
        Q.where('id_call', idCall),
        Q.where('call_status', callStatusPaused),
      )
      .fetch();
    if (callsObj.length > 0) {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await callsObj[0].update((rec: any) => {
          rec.callStatus = callStatusOpen;
          rec.updationDatetime = currentDate;
        });
      });
      return;
    } else {
      return undefined;
    }
  }

  /**
   * Delete Visit
   * @returns
   */
  async updateDeleteVisit(idCall: string) {
    const collection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const callPlaceNumber =
      employeeInfo.length > 0 ? employeeInfo[0].callPlaceNumber : '';
    const idCallCenter =
      employeeInfo.length > 0 ? employeeInfo[0].idCallCenter : '';

    const currentDate = getISOCurrentDate();
    let callsObj = await collection.query(Q.where('id_call', idCall)).fetch();

    if (callsObj.length > 0) {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await callsObj[0].update((rec: any) => {
          rec.deleted = '1';
          rec.local = '1';
          rec.manualAction = 'D2';
          rec.updationEmployeeNumber = employeeNo;
          rec.updationDatetime = currentDate;
          rec.sentDatetime = null;
          rec.callPlaceNumber = callPlaceNumber;
          rec.employeeNumber = employeeNo;
          rec.idCallCenter = idCallCenter;
        });
      });
      return;
    } else {
      return undefined;
    }
  }

  /**
   * Edit Visit
   * @returns
   */
  async updateEditVisit(obj: any) {
    const collection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const callFromDateTime = obj.callFromDateTime;
    const callToDateTime = obj.callToDateTime;
    const idEmployeeObjective = obj.idEmployeeObjective;
    const visitType = obj.visitType;
    const originalCallFromDateTime = obj.originalCallFromDateTime;
    const originalCallToDateTime = obj.originalCallFromDateTime;
    const visitPreparationNotes = obj.visitPreparationNotes;
    const preferedCallTime = obj.preferedCallTime;
    const idCall = obj.idCall;

    const currentDate = getISOCurrentDate();
    let callsObj = await collection.query(Q.where('id_call', idCall)).fetch();

    if (callsObj.length > 0) {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await callsObj[0].update((rec: any) => {
          rec.callFromDatetime = callFromDateTime;
          rec.callToDatetime = callToDateTime;
          rec.idEmployeeObjective = idEmployeeObjective;
          rec.visitType = visitType;
          rec.originalCallFromDatetime = originalCallFromDateTime;
          rec.originalCallToDatetime = originalCallToDateTime;
          rec.visitPreparationNotes = visitPreparationNotes;
          rec.preferedCallTime = preferedCallTime;
          rec.local = '1';
          rec.updationEmployeeNumber = employeeNo;
          rec.updationDateTime = currentDate;
          rec.sentDatetime = null;
        });
      });
    }

    return undefined;
  }

  /**
   * create Visit
   * @returns
   */
  async createNewVisit(
    customerInfo: any,
    callFromDateTime: string,
    callToDateTime: string,
    preferedCallTime: string,
  ) {
    const collection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();

    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const callPlaceNumber =
      employeeInfo.length > 0 ? employeeInfo[0].callPlaceNumber : '';
    const idCallCenter =
      employeeInfo.length > 0 ? employeeInfo[0].idCallCenter : '';

    const customerShipTo = customerInfo.customerShipTo;
    const salesOrganization = customerInfo.salesOrganization;
    const distributionChannel = customerInfo.distributionChannel;
    const idEmployeeObjective = customerInfo?.idEmployeeObjective
      ? Number(customerInfo.idEmployeeObjective)
      : 0;
    const getCurrentDate = getISOCurrentDate();
    const delegatedEmployeeInfo = await this.getLoggedInDelegatedEmployeeInfo();
    const delegatedEmployeeNo =
      delegatedEmployeeInfo.length > 0
        ? delegatedEmployeeInfo[0].employeeNumber
        : '';
    const delegatedEmpCallPlaceNo =
      delegatedEmployeeInfo.length > 0
        ? delegatedEmployeeInfo[0]?.callPlaceNumber
        : '';
    const delegatedIdCallCenter =
      delegatedEmployeeInfo.length > 0
        ? delegatedEmployeeInfo[0]?.idCallCenter
        : '';

    const idCall = getUUID();

    // prepare employee no check
    const delegated = customerInfo.delegated ? customerInfo.delegated : '0';
    let preparEmployeeNo = '';
    if (delegated == '0') {
      preparEmployeeNo = employeeNo;
    } else {
      preparEmployeeNo = delegatedEmployeeNo;
    }

    // prepare id_call_center and call_place_number check
    let preparIdCallCenter = '';
    let preparCallPlaceNumber = '';
    if (delegated === '0') {
      preparIdCallCenter = idCallCenter;
      preparCallPlaceNumber = callPlaceNumber;
    } else {
      preparIdCallCenter = delegatedIdCallCenter;
      preparCallPlaceNumber = delegatedEmpCallPlaceNo;
    }
    console.log(
      'preparIdCallCenter',
      preparEmployeeNo,
      preparIdCallCenter,
      preparCallPlaceNumber,
    );
    return collection.prepareCreate((rec: any) => {
      rec.idCall = idCall;
      rec.idCallList = '0';
      rec.employeeNumber = preparEmployeeNo;
      rec.customerShipTo = customerShipTo;
      rec.salesOrganization = salesOrganization;
      rec.distributionChannel = distributionChannel;
      rec.idCallCenter = preparIdCallCenter;
      rec.callPlaceNumber = preparCallPlaceNumber;
      rec.callFromDatetime = callFromDateTime;
      rec.callToDatetime = callToDateTime;
      rec.preferedCallTime = preferedCallTime;
      rec.callStatus = '0';
      rec.callContactStatus = 10;
      rec.callType = CALL_TYPE.OUTBOUND;
      rec.callResult = '';
      rec.callListType = 'A';
      rec.manualAction = 'M';
      rec.deleted = '0';
      rec.deliveryRoute = '';
      rec.deliverySequence = '';
      rec.effectiveCallFromDatetime = getCurrentDate;
      rec.callCategory = '2';
      rec.effectiveCallToDatetime = null;
      rec.updationEmployeeNumber = delegatedEmployeeNo;
      rec.updationDatetime = getCurrentDate;
      rec.idEmployeeObjective = idEmployeeObjective;
      rec.resultObjective = '0';
      rec.originalEmployeeNumber = employeeNo;
      rec.local = '1';
      rec.visitType = '1';
      rec.callOrigin = '0';
      rec.prospection = '';
    });
  }

  /**
   * Pause the visit
   * @returns
   */
  async pauseVisit(callPlaceNumber: string, idCall: string) {
    const collection = this.getCollection(ENTITY);

    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';

    const updationDateTime = getISOCurrentDate();
    const callsObj = await collection.query(Q.where('id_call', idCall)).fetch();

    if (callsObj.length > 0) {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await callsObj[0].update((rec: any) => {
          rec.callStatus = VISITS_CALL_STATUS.ONHOLD;
          rec.local = '1';
          rec.updationEmployeeNumber = employeeNo;
          rec.updationDatetime = updationDateTime;
          rec.sentDatetime = null;
          rec.callPlaceNumber = callPlaceNumber;
          rec.employeeNumber = employeeNo;
          rec.idCallCenter = idCall;
        });
      });
      return true;
    }
    return false;
  }

  /**
   * Function returns the upcoming visits
   * @returns
   */
  async getUpcomingVisits(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
    idCall?: string,
  ) {
    const collection = this.getCollection(ENTITY);

    let additionalQuery = '';

    if (idCall) {
      additionalQuery = `and id_call = '${idCall}' `;
    } else {
      additionalQuery = `and call_status in ('${VISITS_CALL_STATUS.INITIAL}', '${VISITS_CALL_STATUS.OPEN}', '${VISITS_CALL_STATUS.ONHOLD}') `;
    }

    const QUERY =
      'select id_call as idCall,call_status as callStatus, employee_number as employeeNumber, call_from_datetime as callFromDatetime, ' +
      'call_to_datetime as callToDatetime, visit_type as visitType, ' +
      'employees_objectives.description_language_1 as visitObjective, ' +
      'visit_type as visitType, visit_preparation_notes as visitPreparationNotes, ' +
      'call_place_number as callPlaceNumber, calls.id_employee_objective as idEmployeeObjective ' +
      'from calls left join employees_objectives ' +
      'on calls.id_employee_objective = employees_objectives.id_employee_objective ' +
      'where customer_ship_to = ? ' +
      'and sales_organization = ? ' +
      'and distribution_channel = ? ' +
      'and call_category = ? ' +
      "and deleted <> '1' " +
      additionalQuery +
      // TODO: Revert this change after adding UTC time
      "and strftime('%Y-%m-%d', call_from_datetime) >= strftime('%Y-%m-%d', 'now') " +
      // "and strftime('%Y-%m-%d', call_from_datetime) > strftime('%Y-%m-%d', 'now') " +
      'order by call_from_datetime limit 1';

    const QUERY_VALUES: string[] = [
      customerShipTo,
      salesOrganization,
      distributionChannel,
      CALL_CATEGORY.VISITS,
    ];

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
      .unsafeFetchRaw();

    return results;
  }

  /**
   * Function returns the linked order of the visit to finish
   * @returns
   */
  async getOrderLinkWithFinishVisit(idCall: string) {
    const collection = this.getCollection(ENTITY);

    const QUERY =
      'select distinct calls.id_call ' +
      'from calls inner join ' +
      'orders on orders.id_order = ' +
      'calls.call_order_number where ' +
      "orders.order_status = 'A' " +
      'and calls.id_call = ?';

    const QUERY_VALUES: string[] = [idCall];

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
      .unsafeFetchRaw();

    return results;
  }

  /**
   * Function finish the visit
   * @returns
   */
  async finishVisit(idCall: string) {
    const collection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const callPlaceNumber =
      employeeInfo.length > 0 ? employeeInfo[0].callPlaceNumber : '';
    const idCallCenter =
      employeeInfo.length > 0 ? employeeInfo[0].idCallCenter : '';

    const updationDateTime = getISOCurrentDate();
    const callsObj = await collection.query(Q.where('id_call', idCall)).fetch();

    if (callsObj.length > 0) {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await callsObj[0].update((rec: any) => {
          rec.callStatus = VISITS_CALL_STATUS.FINISHED;
          rec.local = '1';
          rec.updationEmployeeNumber = employeeNo;
          rec.updationDatetime = updationDateTime;
          rec.sentDatetime = null;
          rec.callPlaceNumber = callPlaceNumber;
          rec.employeeNumber = employeeNo;
          rec.idCallCenter = idCallCenter;
        });
      });
      return true;
    }
    return false;
  }
  /**
   * Function returns the 10 future visits of the customer
   * @returns
   */
  async getNextTenFutureVisits() {
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
    const callCategoryVisit = CALL_CATEGORY.VISITS; // 2

    const QUERY =
      'SELECT Calls.Call_From_DateTime AS callFromDateTime ' +
      'FROM Calls ' +
      `WHERE Calls.Customer_Ship_To = "${customerShipTo}" ` +
      `AND Calls.Sales_Organization = "${salesOrganization}" ` +
      `AND Calls.Distribution_Channel = "${distributionChannel}" ` +
      "AND Calls.Deleted = '0' " +
      `AND Calls.Call_Category = "${callCategoryVisit}" ` +
      "AND strftime('%Y-%m-%d', Calls.Call_From_DateTime) >= strftime('%Y-%m-%d', 'now') " +
      'ORDER BY callFromDateTime LIMIT 10';

    let results = await collection

      .query(Q.unsafeSqlQuery(QUERY))

      .unsafeFetchRaw();

    return results;
  }

  /**
   * Function returns the 2 latest visit notes of the customer
   * @returns
   */

  async getLatestTwoVisitNotes() {
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

    const QUERY =
      'SELECT Call_From_DateTime AS visitDate, Calls.Visit_Preparation_Notes as notes, ' +
      "SR.First_Name || ' ' || SR.Last_Name AS salesRepName, " +
      "Employees_Objectives.description_language_1 || ' - ' || Visit_Preparation_Notes AS visitNote, " +
      'Employees_Objectives.description_language_1 as visitObjective, Calls.Id_Employee_Objective as idEmployeeObjective ' +
      'FROM Calls ' +
      'LEFT JOIN Employees_Objectives ' +
      'ON Calls.Id_Employee_Objective  = Employees_Objectives.Id_Employee_Objective  ' +
      'LEFT JOIN Sales_Representatives SR ' +
      'ON Calls.Employee_Number = SR.Employee_Number ' +
      `WHERE Customer_Ship_To = "${customerShipTo}" ` +
      `AND Sales_Organization = "${salesOrganization}" ` +
      `AND Distribution_Channel = "${distributionChannel}" ` +
      "AND Deleted <> '1' " +
      "AND Visit_Preparation_Notes <> '' " +
      "AND strftime('%Y%m%d', Call_From_DateTime) <= strftime('%Y%m%d', 'now') " +
      'ORDER BY Call_From_DateTime DESC LIMIT 2';

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();
    return results;
  }

  async getLastVisitInfo(idCall: string) {
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

    const callCategoryVisit = CALL_CATEGORY.VISITS;
    const callStatusInitial = VISITS_CALL_STATUS.INITIAL;
    const callStatusOpen = VISITS_CALL_STATUS.OPEN;
    const callStatusHold = VISITS_CALL_STATUS.ONHOLD;
    const idCallVal = idCall;

    const QUERY =
      'SELECT Call_From_DateTime As callFromDatetime, ' +
      'Call_to_DateTime As callToDatetime, ' +
      'Visit_Preparation_Notes As visPreparationNotes, ' +
      'Description_Language_1 AS objective, visit_preparation_notes as visitPreparationNotes, ' +
      'call_status as callStatus, visit_type as visitType ' +
      'FROM Calls ' +
      'LEFT JOIN  Employees_Objectives ' +
      'ON Calls.Id_Employee_Objective = Employees_Objectives.Id_Employee_Objective ' +
      `WHERE Customer_Ship_To = '${customerShipTo}' AND  ` +
      `Sales_Organization = '${salesOrganization}' AND ` +
      `Distribution_Channel = '${distributionChannel}' AND  ` +
      `Call_Category = '${callCategoryVisit}' AND ` +
      "strftime('%Y%m%d', Call_From_DateTime) <= strftime('%Y%m%d', 'now') AND " +
      `Call_Status <> '${callStatusInitial}' AND Call_Status <> '${callStatusOpen}' AND Call_Status <> '${callStatusHold}' ` +
      'ORDER BY Call_From_DateTime DESC LIMIT 1';

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }

  async getVisitFromIdCall(idCall: string, isProspect: boolean) {
    const collection = this.getCollection(ENTITY);

    // const customerType = isProspect
    //   ? CUSTOMER_TYPE.PROSPECT
    //   : CUSTOMER_TYPE.CUSTOMER;

    const QUERY =
      'select call_from_datetime as callFromDatetime, ' +
      'call_to_datetime as callToDatetime, call_status as callStatus, ' +
      'visit_type as visitType, visit_preparation_notes as visitPreparationNotes, ' +
      'call_place_number as callPlaceNumber, id_call as idCall, ' +
      'calls.id_employee_objective as idEmployeeObjective, name1, ' +
      'name2, name3, address1, description_language_1 as visitObjective ' +
      'from calls ' +
      'left join customers on calls.customer_ship_to = customers.customer_ship_to ' +
      'left join employees_objectives on calls.id_employee_objective = employees_objectives.id_employee_objective ' +
      'where id_call = ? ';
    // +'and employees_objectives.customer_type = ?';

    // const VALUES = [idCall, customerType];
    const VALUES = [idCall];

    const results = await collection
      .query(Q.unsafeSqlQuery(QUERY, VALUES))
      .unsafeFetchRaw();

    if (results.length > 0) {
      return results;
    }

    return [];
  }

  async getUpcomingVisitForProspect() {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const prospectNumber = prospectData?.prospectNumber
        ? prospectData.prospectNumber
        : '';

      const QUERY =
        'select call_from_datetime as callFromDatetime, ' +
        'call_to_datetime as callToDatetime, call_status as callStatus, ' +
        'visit_type as visitType, visit_preparation_notes as visitPreparationNotes, ' +
        'call_place_number as callPlaceNumber, id_call as idCall, ' +
        'calls.id_employee_objective as idEmployeeObjective, description_language_1 as visitObjective ' +
        'from calls ' +
        'left join employees_objectives on calls.id_employee_objective = ' +
        'employees_objectives.id_employee_objective where customer_ship_to = ? ' +
        "and call_category = ? and deleted <> '1' " +
        "and call_status in (?, ?, ?) and strftime('%Y-%m-%d', call_from_datetime) >= " +
        "strftime('%Y-%m-%d', 'now') order by call_from_datetime limit 1";

      const QUERY_VALUES = [
        prospectNumber,
        CALL_CATEGORY.VISITS,
        VISITS_CALL_STATUS.INITIAL,
        VISITS_CALL_STATUS.OPEN,
        VISITS_CALL_STATUS.ONHOLD,
      ];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      }

      return [];
    } catch (error) {
      console.log('getUpcomingVisitForProspect error :>> ', error);
      return [];
    }
  }
}
