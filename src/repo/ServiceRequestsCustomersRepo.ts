import BaseRepo from './BaseRepo';
import ServiceRequestsCustomers from 'src/storage/OfflineDBStorage/WmDB/models/ServiceRequestsCustomers';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import {SERVICE_REQUEST} from 'src/utils/DbConst';
import {
  formatDate,
  getCurrentDateAndTime,
  getISOCurrentDate,
  getServerDate,
} from 'src/utils/CommonUtil';
import {SERVICE_WORKFLOW} from 'src/utils/Constant';
import {generateAccentString} from 'src/utils/Util';

const ENTITY = OFFLINE_STORAGE.MODEL.SERVICE_REQUESTS_CUSTOMERS;

export class ServiceRequestsCustomersRepo extends BaseRepo<ServiceRequestsCustomers> {
  /**
   * Function returns OPEN workflow of customers assigned to connected user and which are not resolved.
   * @returns
   */
  async getWorkflowOfCustomersAssignedToConnectedUser() {
    const serviceCollection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';

    const delegatedEmployeeInfo = await this.getLoggedInDelegatedEmployeeInfo();
    const delegatedEmployeeNo =
      delegatedEmployeeInfo.length > 0
        ? delegatedEmployeeInfo[0].employeeNumber
        : employeeNo;

    let results = await serviceCollection
      .query(
        Q.unsafeSqlQuery(
          'SELECT DISTINCT id_service_request_customer, status, resolved_employee_number ' +
            'FROM service_requests_customers ' +
            'INNER JOIN customers ON customers.customer_ship_to = service_requests_customers.customer_ship_to ' +
            'WHERE status <> "3" ' +
            'AND resolved_employee_number IN (?, ?) ' +
            'AND customers.active_in_tess = "1"',
          [employeeNo, delegatedEmployeeNo],
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
   * Function returns OPEN workflow of prospects assigned to connected user and which are not resolved.
   * @returns
   */
  async getWorkflowOfProspectsAssignedToConnectedUser() {
    const serviceCollection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';

    const delegatedEmployeeInfo = await this.getLoggedInDelegatedEmployeeInfo();
    const delegatedEmployeeNo =
      delegatedEmployeeInfo.length > 0
        ? delegatedEmployeeInfo[0].employeeNumber
        : employeeNo;

    let results = await serviceCollection
      .query(
        Q.unsafeSqlQuery(
          'select distinct id_service_request_customer,status,resolved_employee_number ' +
            'from service_requests_customers ' +
            'inner join discovery ' +
            'on service_requests_customers.customer_ship_to = discovery.prospect_number ' +
            'inner join prospects ' +
            'on discovery.discovery_id=prospects.discovery_id ' +
            'where status <> "3" ' +
            'and (service_requests_customers.resolved_employee_number in(?) ' +
            'or service_requests_customers.resolved_employee_number in(?)) ' +
            'and discovery.customer_status_code <> "c"',
          [employeeNo, delegatedEmployeeNo],
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
   * Function returns OPEN workflow count from local in case of FSR.
   * @returns
   */
  async getWorkflowOfCountFromLocalInCaseOfFSR() {
    const serviceCollection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';

    let results = await serviceCollection
      .query(
        Q.unsafeSqlQuery(
          'select distinct id_service_request_customer, status, ' +
            'ifnull(resolved_employee_number, "") as resolved_employee_number ' +
            'from service_requests_customers ' +
            'where service_requests_customers.sent_datetime is null and ' +
            'service_requests_customers.resolved_employee_number = ?',
          [employeeNo],
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
   * Function returns OPEN workflow of customer created by connected user and which are no resolved.
   * @returns
   */
  async getWorkflowOfCustomerCreatedByConnectedUser() {
    const serviceCollection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';

    const delegatedEmployeeInfo = await this.getLoggedInDelegatedEmployeeInfo();
    const delegatedEmployeeNo =
      delegatedEmployeeInfo.length > 0
        ? delegatedEmployeeInfo[0].employeeNumber
        : employeeNo;

    let results = await serviceCollection
      .query(
        Q.unsafeSqlQuery(
          'select distinct id_service_request_customer, status, resolved_employee_number ' +
            'from service_requests_customers ' +
            'inner join customers ' +
            'on customers.customer_ship_to = service_requests_customers.customer_ship_to ' +
            'where status <> "3" ' +
            'and creation_employee_number in(?,?) ' +
            'and customers.active_in_tess = "1"',
          [employeeNo, delegatedEmployeeNo],
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
   * Function returns OPEN workflow of prospects created by connected user and which are not resolved.
   * @returns
   */
  async getWorkflowOfProspectsCreatedByConnectedUser() {
    const serviceCollection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';

    const delegatedEmployeeInfo = await this.getLoggedInDelegatedEmployeeInfo();
    const delegatedEmployeeNo =
      delegatedEmployeeInfo.length > 0
        ? delegatedEmployeeInfo[0].employeeNumber
        : employeeNo;

    let results = await serviceCollection
      .query(
        Q.unsafeSqlQuery(
          'select distinct id_service_request_customer,status,resolved_employee_number ' +
            'from service_requests_customers ' +
            'inner join discovery ' +
            'on service_requests_customers.customer_ship_to = discovery.prospect_number ' +
            'inner join prospects ' +
            'on discovery.discovery_id=prospects.discovery_id ' +
            'where status <> "3" ' +
            'and service_requests_customers.creation_employee_number in(?) ' +
            'or service_requests_customers.creation_employee_number in(?) ' +
            'and discovery.customer_status_code <> "c"',
          [employeeNo, delegatedEmployeeNo],
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
   * Function returns OPEN workflow count from local in case of FSR.
   * @returns
   */
  async getOpenWorkflowOfCountFromLocalInCaseOfFSR() {
    const serviceCollection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';

    let results = await serviceCollection
      .query(
        Q.unsafeSqlQuery(
          'select distinct id_service_request_customer,status,' +
            'ifnull(resolved_employee_number,"") as resolved_employee_number ' +
            'from service_requests_customers ' +
            'where service_requests_customers.sent_datetime is null and ' +
            'service_requests_customers.creation_employee_number in(?)',
          [employeeNo],
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
   * Function returns OPEN workflow count of customer from local
   * @returns
   */

  async getOpenWorkflowOfCustomerFromLocal(customerShipTo: string) {
    const serviceCollection = this.getCollection(ENTITY);

    const result = await serviceCollection
      .query(
        Q.unsafeSqlQuery(
          'select count(*) as openRequestCount ' +
            'from service_requests_customers ' +
            'where customer_ship_to = ? and ' +
            'status <> ? and ' +
            "deletion_requested <> '1'",
          [customerShipTo, SERVICE_REQUEST.SERVICE_REQUEST_COMPLETED],
        ),
      )
      .unsafeFetchRaw();

    if (result) {
      return result[0].openRequestCount;
    } else {
      return 0;
    }
  }

  /**
   * Function returns service request data for finalize
   * @returns
   */
  async getServiceRequestForFinalize(tradeAssetId: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const QUERY =
        'select discovery_previous_owner_trade_assets.discovery_id as discoveryId, ' +
        'discovery_previous_owner_trade_assets.id_service_request_customer as idServiceRequestCustomer, ' +
        "status, [too], serial_number as serialNumber, coalesce(discovery_list_values.description_language_1, '') as followUpAction " +
        'from discovery_previous_owner_trade_assets inner join service_requests_customers ' +
        'on service_requests_customers.id_service_request_customer = ' +
        'discovery_previous_owner_trade_assets.id_service_request_customer ' +
        'left join discovery_list_values on discovery_list_values.discovery_list_values_id ' +
        '= discovery_previous_owner_trade_assets.follow_up_action ' +
        "where service_requests_customers.id_service_request_customer = ? and too = '0' and status = '1' ";

      const QUERY_VALUES = [tradeAssetId];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      }

      return [];
    } catch (error) {
      console.log('getServiceRequestForFinalize error :>> ', error);
      return [];
    }
  }

  /**
   * Function returns true/false based on create status
   * @returns
   */
  async insertTaRequestServiceData(
    tradeAssetId: string,
    previousCustomerShipTo: string,
  ) {
    try {
      const collection = this.getCollection(ENTITY);

      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
      const currentDate = getISOCurrentDate();

      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.idServiceRequestCustomer = tradeAssetId;
          rec.idServiceRequestType = '25';
          rec.status = SERVICE_REQUEST.SERVICE_REQUEST_OPEN;
          rec.description = '';
          rec.customerShipTo = previousCustomerShipTo;
          rec.creationEmployeeNumber = employeeNo;
          rec.creationDatetime = currentDate;
          rec.requestedDatetime = currentDate;
          rec.resolution = '';
          rec.resolvedEmployeeNumber = null;
          rec.resolvedDatetime = null;
          rec.lockBy = null;
          rec.sentDatetime = null;
          rec.deletionRequested = '0';
        });
      });
      return true;
    } catch (error) {
      console.log('insertTaRequestServiceData error :>> ', error);
      return false;
    }
  }

  /**
   * Function returns true/false based on create status
   * @returns
   */
  async updateTaRequestServiceData(tradeAssetId: string, description: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const serviceRequestsData = await collection
        .query(Q.where('id_service_request_customer', tradeAssetId))
        .fetch();

      if (serviceRequestsData.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await serviceRequestsData[0].update((rec: any) => {
            rec.description = description;
          });
        });
      }
      return true;
    } catch (error) {
      console.log('updateTaRequestServiceData error :>> ', error);
      return false;
    }
  }

  /**
   * Function returns service workflow listing data
   * @returns
   */
  async getServiceWorkflowListing(
    start: number,
    limit: number,
    statusType: string,
    filterObj: any,
  ) {
    try {
      const collection = this.getCollection(ENTITY);
      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';

      let FILTER_QUERY_1 = '';
      let FILTER_QUERY_2 = '';

      if (statusType === SERVICE_WORKFLOW.TODO) {
        FILTER_QUERY_1 += ` and status in('1', '2') `;
        FILTER_QUERY_2 += ` and status in('1', '2') `;
      } else if (statusType === SERVICE_WORKFLOW.OPEN) {
        FILTER_QUERY_1 += ` and status in('1') `;
        FILTER_QUERY_2 += ` and status in('1') `;
      } else if (statusType === SERVICE_WORKFLOW.INPROGRESS) {
        FILTER_QUERY_1 += ` and status in('2') `;
        FILTER_QUERY_2 += ` and status in('2') `;
      } else if (statusType === SERVICE_WORKFLOW.COMPLETED) {
        FILTER_QUERY_1 += ` and status in('3') `;
        FILTER_QUERY_2 += ` and status in('3') `;
      }

      if (filterObj) {
        console.log('filterObj repo :>> ', filterObj);

        if (filterObj?.name && filterObj.name.trim().length > 0) {
          const accentList = generateAccentString(filterObj.name);

          FILTER_QUERY_1 += ` and ( `;
          FILTER_QUERY_2 += ` and ( `;

          accentList.forEach((item, index) => {
            if (index === accentList.length - 1) {
              FILTER_QUERY_1 += ` service_requests_customers.customer_ship_to like '%${item}%' or customers.name1 like '%${item}%' `;
              FILTER_QUERY_2 += ` service_requests_customers.customer_ship_to like '%${item}%' `;
            } else {
              FILTER_QUERY_1 += ` service_requests_customers.customer_ship_to like '%${item}%' or customers.name1 like '%${item}%' or `;
              FILTER_QUERY_2 += ` service_requests_customers.customer_ship_to like '%${item}%' or `;
            }
          });

          FILTER_QUERY_1 += ` ) `;
          FILTER_QUERY_2 += ` ) `;
        }

        if (filterObj?.requestType && filterObj.requestType.length > 0) {
          FILTER_QUERY_1 += ` and service_request_types.id_service_request_type = '${filterObj.requestType[0].idServiceRequestType}' `;
          FILTER_QUERY_2 += ` and service_request_types.id_service_request_type = '${filterObj.requestType[0].idServiceRequestType}' `;
        }

        if (filterObj?.assignedTo && filterObj.assignedTo.length > 0) {
          FILTER_QUERY_1 += ` and service_requests_customers.resolved_employee_number in ('${filterObj.assignedTo[0].employeeNumber}') `;
          FILTER_QUERY_2 += ` and service_requests_customers.resolved_employee_number in ('${filterObj.assignedTo[0].employeeNumber}') `;
        }

        if (filterObj?.createdFrom && filterObj?.createdTill) {
          const createdFrom = formatDate(filterObj.createdFrom);
          const createdTill = formatDate(filterObj.createdTill);

          FILTER_QUERY_1 += ` and (strftime("%Y-%m-%d", service_requests_customers.creation_datetime) >= strftime("%Y-%m-%d", '${createdFrom}') and strftime("%Y-%m-%d", service_requests_customers.creation_datetime) <= strftime("%Y-%m-%d", '${createdTill}')) `;
          FILTER_QUERY_2 += ` and (strftime("%Y-%m-%d", service_requests_customers.creation_datetime) >= strftime("%Y-%m-%d", '${createdFrom}') and strftime("%Y-%m-%d", service_requests_customers.creation_datetime) <= strftime("%Y-%m-%d", '${createdTill}')) `;
        }

        if (filterObj?.requestedFrom && filterObj?.requestedTill) {
          const requestedFrom = formatDate(filterObj.requestedFrom);
          const requestedTill = formatDate(filterObj.requestedTill);

          FILTER_QUERY_1 += ` and (strftime("%Y-%m-%d", service_requests_customers.requested_datetime) >= strftime("%Y-%m-%d", '${requestedFrom}') and strftime("%Y-%m-%d", service_requests_customers.requested_datetime) <= strftime("%Y-%m-%d", '${requestedTill}')) `;
          FILTER_QUERY_2 += ` and (strftime("%Y-%m-%d", service_requests_customers.requested_datetime) >= strftime("%Y-%m-%d", '${requestedFrom}') and strftime("%Y-%m-%d", service_requests_customers.requested_datetime) <= strftime("%Y-%m-%d", '${requestedTill}')) `;
        }
      }

      const LIMIT_QUERY = `order by overdue desc, status limit ${limit} offset ${start}`;

      console.log('filter query 1 :>> ', FILTER_QUERY_1);
      console.log('filter query 2 :>> ', FILTER_QUERY_2);

      const QUERY =
        'select service_request_types.claims_screen_layout as claimsScreenLayout, ' +
        'service_request_types.is_claim_type as isClaimType, ' +
        'service_requests_customers.id_service_request_customer as idServiceRequestCustomer, ' +
        'service_request_types.description_language_1 as requestType, ' +
        'service_requests_customers.customer_ship_to as customerShipTo, ' +
        `case service_requests_customers.status when '1' then '${SERVICE_WORKFLOW.OPEN}' ` +
        `when '2' then '${SERVICE_WORKFLOW.INPROGRESS}' when '3' then '${SERVICE_WORKFLOW.COMPLETED}' ` +
        'end as status, service_requests_customers.status as idStatus, ' +
        'customers.abc_classification as customerClassification, ' +
        "service_requests_customers.creation_employee_number || ' ' || " +
        "employees_1.first_name || ' ' || employees_1.last_name as employee, " +
        "strftime('%d-%m-%Y', service_requests_customers.creation_datetime) as creationDate, " +
        "strftime('%d-%m-%Y', requested_datetime) as requestedDate, " +
        "substr('0000000000' || service_requests_customers.resolved_employee_number, " +
        'length(service_requests_customers.resolved_employee_number) + 1, 10) || ' +
        "service_requests_customers.resolved_employee_number || ' ' || case when " +
        'sales_representatives.first_name is not null then sales_representatives.first_name ' +
        "else employees.first_name end || ' ' || case when sales_representatives.last_name is not " +
        'null then sales_representatives.last_name else employees.last_name ' +
        'end as responsible, service_requests_customers.description, coalesce(' +
        "service_requests_customers.resolved_employee_number, '') as resolvedEmployeeNumber, " +
        "strftime('%d-%m-%Y', resolved_datetime) as resolutionDate, " +
        "case when(service_requests_customers.status <> '3' and strftime('%d', 'now') - " +
        "strftime('%d', requested_datetime) > 0) then 1 else 0 end as overdue, " +
        'customers.name1 as name, customers.distribution_channel as distributionChannel, ' +
        "coalesce(customers.sales_organization, '') as salesOrganization, " +
        "coalesce(customers.industry_code, '') as industryCode, " +
        "'' as discoveryId, " +
        "'C' as customerStatusCode, 'C' as statusType, customers.picking_plant_number as pickingPlantNumber, " +
        'crca.call_place_number as callPlaceNumber, customers.street3, customers.trade_assets_amount as tradeAssetsAmount, ' +
        'customers.delegated, customers.customer_group_15 as customerGroup15 from service_requests_customers ' +
        'left outer join customers on service_requests_customers.customer_ship_to = customers.customer_ship_to ' +
        'left outer join service_request_types on service_requests_customers.id_service_request_type = service_request_types.id_service_request_type ' +
        'left outer join employees as employees_1 on service_requests_customers.creation_employee_number = employees_1.employee_number ' +
        'left outer join employees on service_requests_customers.resolved_employee_number = employees.employee_number ' +
        'left outer join sales_representatives on sales_representatives.partner_number = service_requests_customers.resolved_employee_number ' +
        'left join customers_claims_workflow_header on customers_claims_workflow_header.id_service_request_customer = ' +
        'service_requests_customers.id_service_request_customer left join customers_claims_workflow_claims_data on ' +
        'customers_claims_workflow_claims_data.id_service_request_customer = service_requests_customers.id_service_request_customer ' +
        'left join customers_claims_workflow_settlement_data on customers_claims_workflow_settlement_data.id_service_request_customer ' +
        '= service_requests_customers.id_service_request_customer left join customers_route_customer_assignment crca on ' +
        'crca.customer_ship_to = customers.customer_ship_to and crca.sales_organization = customers.sales_organization ' +
        "and crca.distribution_channel = customers.distribution_channel and (strftime('%Y-%m-%d', valid_from_datetime) <= strftime('%Y-%m-%d', 'now') " +
        "and strftime('%Y-%m-%d', valid_to_datetime) >= strftime('%Y-%m-%d', 'now')) where 1 = 1 and service_requests_customers.deletion_requested <> '1' " +
        FILTER_QUERY_1 +
        " and (id_customers_claims_workflow_claims_data = '1' " +
        'or id_customers_claims_workflow_claims_data is null) union select service_request_types.claims_screen_layout as claimsScreenLayout, ' +
        ' service_request_types.is_claim_type as isClaimType, ' +
        'service_requests_customers.id_service_request_customer as idServiceRequestCustomer, service_request_types.description_language_1 as requestType, ' +
        `service_requests_customers.customer_ship_to as customerShipTo, case service_requests_customers.status when '1' then '${SERVICE_WORKFLOW.OPEN}' ` +
        `when '2' then '${SERVICE_WORKFLOW.INPROGRESS}' when '3' then '${SERVICE_WORKFLOW.COMPLETED}' end as status, service_requests_customers.status as idStatus, ` +
        "coalesce(discovery_customer_attributes.abc_classification, '') as customerClassification, service_requests_customers.creation_employee_number || ' ' || employees_1.first_name " +
        "|| ' ' || employees_1.last_name as employee, strftime('%d-%m-%Y', service_requests_customers.creation_datetime) as creationDate, " +
        "strftime('%d-%m-%Y', service_requests_customers.requested_datetime) as requestedDate, service_requests_customers.resolved_employee_number || ' ' || case " +
        "when sales_representatives.first_name is not null then sales_representatives.first_name else employees.first_name end + ' ' + case " +
        'when sales_representatives.last_name is not null then sales_representatives.last_name else employees.last_name end as responsible,' +
        "service_requests_customers.description, coalesce(service_requests_customers.resolved_employee_number, '') as resolvedEmployeeNumber, " +
        "strftime('%d-%m-%Y', resolved_datetime) as resolutionDate, case when (service_requests_customers.status <> '3' and strftime('%d', 'now') - strftime('%d', " +
        'service_requests_customers.requested_datetime) > 0) then 1 else 0 end as overdue, prospects.name1 as name, ' +
        "coalesce(prospects.distribution_channel, '') as distributionChannel, " +
        "coalesce(prospects.sales_organization, '') as salesOrganization, " +
        "coalesce(prospects.industry_code, '') as industryCode, " +
        "coalesce(prospects.discovery_id, '') as discoveryId, " +
        "coalesce(discovery.customer_status_code, '') as customerStatusCode, " +
        "coalesce(discovery.customer_status_code, '') as statusType, " +
        "'' as pickingPlantNumber, '' as callPlaceNumber, '' as street3, '' as tradeAssetsAmount, '' as delegated, " +
        "'' as customerGroup15 FROM Service_Requests_Customers LEFT OUTER JOIN Discovery ON " +
        'Service_Requests_Customers.customer_ship_To = Discovery.Prospect_Number INNER JOIN Prospects ON Discovery.Discovery_Id = Prospects.Discovery_Id ' +
        'LEFT JOIN Discovery_Customer_Attributes ON Discovery_Customer_Attributes.Discovery_Id = Prospects.Discovery_Id ' +
        'LEFT OUTER JOIN Service_Request_Types ON Service_Requests_Customers.ID_Service_Request_Type = Service_Request_Types.ID_Service_Request_Type ' +
        'LEFT OUTER JOIN Employees as Employees_1 ON Service_Requests_Customers.Creation_Employee_Number = Employees_1.Employee_Number ' +
        'LEFT OUTER JOIN Employees ON Service_Requests_Customers.Resolved_Employee_Number = Employees.Employee_Number ' +
        'LEFT OUTER JOIN Sales_Representatives ON Sales_Representatives.Partner_Number = Service_Requests_Customers.Resolved_Employee_Number ' +
        "LEFT OUTER JOIN Call_Centers ON Call_Centers.ID_Call_Center = Prospects.ID_Call_Center where 1 = 1 and service_requests_customers.deletion_requested <> '1' " +
        FILTER_QUERY_2;

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY + LIMIT_QUERY))
        .unsafeFetchRaw();

      const totalCountResult = await await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return {results, totalCount: totalCountResult.length};
      }

      return {
        results: [],
        totalCount: 0,
      };
    } catch (error) {
      console.log('getServiceWorkflowListing error :>> ', error);
      return {
        results: [],
        totalCount: 0,
      };
    }
  }

  /**
   * Delete service workflow data
   * @returns
   */
  async deleteServiceWorkflowData(idServiceRequestCustomer: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const serviceWorkflowData = await collection
        .query(Q.where('id_service_request_customer', idServiceRequestCustomer))
        .fetch();

      if (serviceWorkflowData.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await serviceWorkflowData[0].update((rec: any) => {
            rec.deletionRequested = '1';
            rec.sentDatetime = null;
          });
        });
        return true;
      }

      return false;
    } catch (error) {
      console.log('deleteServiceWorkflowData error :>> ', error);
      return false;
    }
  }

  /**
   * Function returns service workflow listing data of selected customer
   * @returns
   */
  async getServiceWorkflowListingOfCustomer(
    start: number,
    limit: number,
    statusType: string,
    filterObj: any,
  ) {
    try {
      const collection = this.getCollection(ENTITY);
      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';

      const customerInfo: any = await this.getCLCustomerInfo();
      const customerShipTo = customerInfo.customerShipTo
        ? customerInfo.customerShipTo
        : '';

      let FILTER_QUERY = '';

      if (statusType === SERVICE_WORKFLOW.TODO) {
        FILTER_QUERY += ` and status in('1', '2') `;
      } else if (statusType === SERVICE_WORKFLOW.OPEN) {
        FILTER_QUERY += ` and status in('1') `;
      } else if (statusType === SERVICE_WORKFLOW.INPROGRESS) {
        FILTER_QUERY += ` and status in('2') `;
      } else if (statusType === SERVICE_WORKFLOW.COMPLETED) {
        FILTER_QUERY += ` and status in('3') `;
      }

      if (filterObj) {
        console.log('filterObj repo :>> ', filterObj);

        if (filterObj?.requestType && filterObj.requestType.length > 0) {
          FILTER_QUERY += ` and service_request_types.id_service_request_type = '${filterObj.requestType[0].idServiceRequestType}' `;
        }

        if (filterObj?.assignedTo && filterObj.assignedTo.length > 0) {
          FILTER_QUERY += ` and service_requests_customers.resolved_employee_number in ('${filterObj.assignedTo[0].employeeNumber}') `;
        }

        if (filterObj?.createdFrom && filterObj?.createdTill) {
          const createdFrom = formatDate(filterObj.createdFrom);
          const createdTill = formatDate(filterObj.createdTill);

          FILTER_QUERY += ` and (strftime("%Y-%m-%d", service_requests_customers.creation_datetime) >= strftime("%Y-%m-%d", '${createdFrom}') and strftime("%Y-%m-%d", service_requests_customers.creation_datetime) <= strftime("%Y-%m-%d", '${createdTill}')) `;
        }

        if (filterObj?.requestedFrom && filterObj?.requestedTill) {
          const requestedFrom = formatDate(filterObj.requestedFrom);
          const requestedTill = formatDate(filterObj.requestedTill);

          FILTER_QUERY += ` and (strftime("%Y-%m-%d", service_requests_customers.requested_datetime) >= strftime("%Y-%m-%d", '${requestedFrom}') and strftime("%Y-%m-%d", service_requests_customers.requested_datetime) <= strftime("%Y-%m-%d", '${requestedTill}')) `;
        }
      }

      const LIMIT_QUERY = `order by service_requests_customers.creation_datetime desc limit ${limit} offset ${start}`;

      console.log('SWF customer filter query :>> ', FILTER_QUERY);

      const QUERY =
        'select service_request_types.claims_screen_layout as claimsScreenLayout, ' +
        'service_request_types.is_claim_type as isClaimType, ' +
        'service_requests_customers.id_service_request_customer as idServiceRequestCustomer, ' +
        'service_request_types.description_language_1 as requestType, ' +
        `case service_requests_customers.status when '1' then '${SERVICE_WORKFLOW.OPEN}' when '2' then '${SERVICE_WORKFLOW.INPROGRESS}' ` +
        `when '3' then '${SERVICE_WORKFLOW.COMPLETED}' end as status, service_requests_customers.creation_employee_number ` +
        "|| ' ' || employees_1.first_name || ' ' || employees_1.last_name as creationEmployeeNameAndNumber, " +
        "strftime('%d-%m-%Y', service_requests_customers.creation_datetime) as creationDate, " +
        "strftime('%d-%m-%Y', service_requests_customers.requested_datetime) as requestedDate, " +
        'service_requests_customers.description, service_requests_customers.resolved_employee_number ' +
        "|| ' ' || case when sales_representatives.first_name is not null then sales_representatives.first_name " +
        "else employees.first_name end || ' ' || case when sales_representatives.last_name is not null then " +
        'sales_representatives.last_name else employees.last_name end as resolvedEmployeeNameAndNumber, ' +
        "strftime('%d-%m-%Y', service_requests_customers.resolved_datetime) as resolvedDateTime, " +
        'service_requests_customers.status as idStatus, claims_screen_layout as serviceRequestType, ' +
        "case when(service_requests_customers.status <> '3' and (strftime('%Y-%m-%d', 'now') > " +
        "strftime('%Y-%m-%d', requested_datetime))) then 1 else 0 end as overdue " +
        'from service_requests_customers left outer join service_request_types on ' +
        'service_requests_customers.id_service_request_type = service_request_types.id_service_request_type ' +
        'left outer join employees as employees_1 on service_requests_customers.creation_employee_number = employees_1.employee_number ' +
        'left outer join employees on service_requests_customers.resolved_employee_number = employees.employee_number ' +
        'left outer join sales_representatives on sales_representatives.partner_number = service_requests_customers.resolved_employee_number ' +
        `where customer_ship_to = '${customerShipTo}' and deletion_requested <> '1'` +
        FILTER_QUERY;

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY + LIMIT_QUERY))
        .unsafeFetchRaw();

      const totalCountResult = await await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return {results, totalCount: totalCountResult.length};
      }

      return {
        results: [],
        totalCount: 0,
      };
    } catch (error) {
      console.log('getServiceWorkflowListingOfCustomer error :>> ', error);
      return {
        results: [],
        totalCount: 0,
      };
    }
  }

  /**
   * Function returns true/false based on updation
   * @returns
   */
  async updateSendReportStatus(idServiceRequestCustomer: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const serviceWorkflowData = await collection
        .query(Q.where('id_service_request_customer', idServiceRequestCustomer))
        .fetch();

      if (serviceWorkflowData.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await serviceWorkflowData[0].update((rec: any) => {
            rec.sendReport = '1';
            rec.sentDatetime = null;
          });
        });
        return true;
      }

      return false;
    } catch (error) {
      console.log('updateSendReportStatus error :>> ', error);
      return false;
    }
  }

  /**
   * Function returns true/false based on insertion/updation
   * @returns
   */
  async insertOrUpdateServiceRequestsCustomersData(
    serviceRequestsCustomersData: any,
  ) {
    try {
      const collection = this.getCollection(ENTITY);
      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
      const currentDate = getCurrentDateAndTime();

      const idServiceRequestCustomer =
        serviceRequestsCustomersData?.idServiceRequestCustomer || '';

      const existingData = await collection
        .query(Q.where('id_service_request_customer', idServiceRequestCustomer))
        .fetch();

      const idServiceRequestType = serviceRequestsCustomersData?.requestType
        ? serviceRequestsCustomersData?.requestType
        : '';
      const status = serviceRequestsCustomersData?.status || '';
      const description = serviceRequestsCustomersData?.description || '';
      const customerShipTo = serviceRequestsCustomersData?.customerShipTo || '';
      const requestedDatetime = serviceRequestsCustomersData?.requestedDate
        ? getServerDate(serviceRequestsCustomersData?.requestedDate)
        : '';
      const resolution = serviceRequestsCustomersData?.resolution || '';
      const resolvedEmployeeNumber =
        serviceRequestsCustomersData?.assignedTo || null;
      const resolvedDatetime = serviceRequestsCustomersData?.resolvedDate
        ? getServerDate(serviceRequestsCustomersData?.resolvedDate)
        : null;

      if (existingData.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await existingData[0].update((rec: any) => {
            rec.idServiceRequestType = idServiceRequestType;
            rec.status = status;
            rec.description = description;
            rec.customerShipTo = customerShipTo;
            rec.requestedDatetime = requestedDatetime;
            rec.resolution = resolution;
            rec.resolvedEmployeeNumber = resolvedEmployeeNumber;
            rec.resolvedDatetime = resolvedDatetime;
            rec.sentDatetime = null;
            rec.deletionRequested = '0';
          });
        });
      } else {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await collection.create((rec: any) => {
            rec.idServiceRequestCustomer = idServiceRequestCustomer;
            rec.idServiceRequestType = idServiceRequestType;
            rec.status = status;
            rec.description = description;
            rec.customerShipTo = customerShipTo;
            rec.creationEmployeeNumber = employeeNo;
            rec.creationDatetime = currentDate;
            rec.requestedDatetime = requestedDatetime;
            rec.resolution = resolution;
            rec.resolvedEmployeeNumber = resolvedEmployeeNumber;
            rec.resolvedDatetime = resolvedDatetime;
            rec.sentDatetime = null;
            rec.deletionRequested = '0';
            rec.sendReport = '0';
          });
        });
      }

      return true;
    } catch (error) {
      console.log(
        'insertOrUpdateServiceRequestsCustomersData error :>> ',
        error,
      );
      return false;
    }
  }

  /**
   * Function returns service workflow data of particular customer
   * @returns
   */
  async getServiceWorkflowDataOfCustomer(idServiceRequestCustomer: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const QUERY =
        'select case when employees.employee_number is null then creation_employee_number ' +
        "else creation_employee_number || ' ' || employees.last_name || ' ' || employees.first_name " +
        'end as createdBy, strftime("%d-%m-%Y %H:%M", creation_datetime) as creationDatetime, id_service_request_type as idServiceRequestType, ' +
        'requested_datetime as requestedDate, status, description, resolution, resolved_employee_number as ' +
        'resolvedEmployeeNumber, resolved_datetime as resolvedDate from service_requests_customers ' +
        'left join employees on service_requests_customers.creation_employee_number = substr(' +
        "'0000000000' || employees.employee_number, length(employees.employee_number) + 1, 10) " +
        'where id_service_request_customer = ?';

      const QUERY_VALUES = [idServiceRequestCustomer];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      }

      return [];
    } catch (error) {
      console.log('getServiceWorkflowDataOfCustomer error :>> ', error);
      return [];
    }
  }
  /**
   * Function returns service workflow data of particular customer
   * @returns
   */
  async checkWorkflowExists(idServiceRequestCustomer: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const QUERY =
        'select * from service_requests_customers where id_service_request_customer = ?';

      const QUERY_VALUES = [idServiceRequestCustomer];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return true;
      }

      return false;
    } catch (error) {
      console.log('checkWorkflowExists error :>> ', error);
      return false;
    }
  }
  /**
   * Function returns service workflow data of particular customer
   * @returns
   */
  async getClaimEnteredByData(idServiceRequestCustomer: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const QUERY = `select  
      strftime('%d-%m-%Y %H:%M',creation_datetime) as entry_date , 
      employees.first_name || ' ' || employees.last_name as name, 
      employees.phone as phone, 
      employees.mail_address 
      from  
      service_requests_customers 
      left join employees 
      on service_requests_customers.creation_employee_number = employees.employee_number 
      where
      id_service_request_customer = '${idServiceRequestCustomer}'`;

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();
      if (results.length) {
        return results;
      }
      return [];
    } catch (error) {
      console.log('getClaimEnteredByData error :>> ', error);
      return false;
    }
  }
}
