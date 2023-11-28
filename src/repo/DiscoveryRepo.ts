import BaseRepo from './BaseRepo';
import Discovery from 'src/storage/OfflineDBStorage/WmDB/models/Discovery';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import {generateAccentString} from 'src/utils/Util';
import {PROSPECTS_TYPE} from 'src/utils/DbConst';
import {
  formatDate,
  getCurrentTimeForId,
  getISOCurrentDate,
} from 'src/utils/CommonUtil';
import {PROSPECT_STATUS_TITLE} from 'src/utils/Constant';

const DISCOVERY_ENTITY = OFFLINE_STORAGE.MODEL.DISCOVERY;
export class DiscoveryRepo extends BaseRepo<Discovery> {
  /**
   * Function returns Prospects to visit
   * @returns
   */
  async getActiveProspects() {
    const discoveryCollection = this.getCollection(DISCOVERY_ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const delegatedEmployeeInfo = await this.getLoggedInDelegatedEmployeeInfo();
    const delegatedEmployeeNo =
      delegatedEmployeeInfo.length > 0
        ? delegatedEmployeeInfo[0].employeeNumber
        : employeeNo;

    let results = await discoveryCollection
      .query(
        Q.unsafeSqlQuery(
          'select distinct d.discovery_id from discovery d ' +
            'inner join prospects p ' +
            'on d.discovery_id = p.discovery_id ' +
            "where delete_prospect <> '1' and " +
            `p.employee_number in ("${employeeNo}", "${delegatedEmployeeNo}" ) and ` +
            "( d.new_customer_request_status = '6' " +
            "or d.new_customer_request_status = '0' " +
            'or d.new_customer_request_status is NULL ' +
            "or d.new_customer_request_status = '' ) ",
        ),
      )
      .unsafeFetchRaw();

    if (results) {
      return results.length;
    } else {
      return 0;
    }
  }

  async getProspectNewCustomerRequestVisit() {
    const discoveryCollection = this.getCollection(DISCOVERY_ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const delegatedEmployeeInfo = await this.getLoggedInDelegatedEmployeeInfo();
    let delegatedEmployeeNo =
      delegatedEmployeeInfo.length > 0
        ? delegatedEmployeeInfo[0].employeeNumber
        : employeeNo;

    delegatedEmployeeNo = delegatedEmployeeNo
      ? delegatedEmployeeNo
      : employeeNo;

    const empAndDelegatedTerritoryStr =
      await this.getEmployeeAndDelegatedTerritoryStr();

    const results = await discoveryCollection
      .query(
        Q.unsafeSqlQuery(
          'select d.discovery_id from discovery d inner join prospects ' +
            "p on d.discovery_id = p.discovery_id where delete_prospect <> '1' " +
            "and d.new_customer_request_status = '1' and (d.customer_status_code = 'P') " +
            `AND (D.Created_By IN('${employeeNo}','${delegatedEmployeeNo}') OR P.EMPLOYEE_NUMBER IN('${employeeNo}','${delegatedEmployeeNo}') ` +
            `OR P.ID_Territory in (${empAndDelegatedTerritoryStr})) `,
        ),
      )
      .unsafeFetchRaw();

    if (results) {
      return results.length;
    } else {
      return 0;
    }
  }

  async getProspectQueries(filterObj: {
    showCustomers?: boolean;
    searchText?: string;
    name?: string;
    address?: string;
    postalCode?: string;
    city?: string;
    prospectNumber?: string;
    externalProspectNumber?: string;
    industryCode?: string;
    priority?: string;
    createdFrom?: string;
    createdTill?: string;
    createdBy?: string;
    updatedBy?: string;
  }) {
    let JOIN_QUERY =
      'LEFT JOIN Discovery_Financial_Data As DAI On D.Discovery_Id = DAI.Discovery_Id ';
    if (filterObj.showCustomers) {
      JOIN_QUERY =
        'LEFT JOIN Customers_Additional_Information As DAI On (D.Customer_Ship_To = DAI.Customer_Hierarchy_Node And P.Distribution_Channel = DAI.Distribution_Channel And P.Sales_Organization = DAI.Sales_Organization) ';
    }

    const PROSPECTS_TABLES_QUERY =
      'FROM Discovery D ' +
      'INNER JOIN Prospects P On D.Discovery_Id = P.Discovery_Id ' +
      'LEFT JOIN Employees As Employees2 On D.Prospection_Data_Update_Employee_Number = Employees2.EMPLOYEE_NUMBER ' +
      'LEFT JOIN Employees As Employees1 On D.Created_By = Employees1.EMPLOYEE_NUMBER ' +
      JOIN_QUERY +
      'LEFT JOIN (Select DISTINCT(Customer_Hier_L6), Name_Hier_L6 from Customer_Hierarchies_Ship_To) ' +
      'CHST On CHST.Customer_Hier_L6 = P.Affiliation_Hierarchy_Node ' +
      'LEFT OUTER JOIN Customers_Industry_Codes CIC On CIC.Industry_Code = P.Industry_Code ' +
      'LEFT JOIN Employees E On P.EMPLOYEE_NUMBER = E.EMPLOYEE_NUMBER ' +
      'LEFT JOIN Discovery_SEPA DFD On D.Discovery_Id = DFD.Discovery_Id ' +
      'LEFT JOIN Discovery_List_Values LV On LV.Discovery_List_Values_Id = P.Country ' +
      'LEFT JOIN Prospect_Visit_Notes N On N.Discovery_ID = D.Discovery_ID ' +
      'LEFT JOIN Discovery_Contacts DC On DC.Discovery_ID = D.Discovery_ID ' +
      'LEFT JOIN DISCOVERY_CONDITION_AGREEMENTS On DISCOVERY_CONDITION_AGREEMENTS.Discovery_ID = D.Discovery_ID ' +
      "And CONDITIONS_STATUS = '1' LEFT JOIN DISCOVERY_TRADE_ASSETS On DISCOVERY_TRADE_ASSETS.Discovery_ID = D.Discovery_ID " +
      "And TA_Status = '1' LEFT JOIN Discovery_Customer_Attributes On Discovery_Customer_Attributes.Discovery_ID = D.Discovery_ID " +
      "WHERE P.Delete_Prospect <> '1' AND D.Indirect_Prospect = '0' ";

    const PROSPECTS_BASE_QUERY =
      'SELECT DISTINCT D.Prospect_Number as prospectNumber, P.name2, P.name3, D.External_Prospect_Number as externalProspectNumber, D.Customer_Ship_To as customerShipTo, ' +
      "case when P.Industry_Code <> '' OR P.Industry_Code <> NULL then P.Industry_Code || ' - ' || CIC.Description_Language_1 else '' " +
      "end AS industryCode, P.Affiliation_Hierarchy_Node || coalesce(' - ' + CHST.Name_Hier_L6, '') AS affiliationHierarchyNode, " +
      'P.Name1 AS name1, P.Phone1 AS phone1, P.House_Number AS street1, P.Address1 AS address1,' +
      'P.Postal_Code AS postalCode, P.City as city, LV.Description_Language_1 AS country, ' +
      'DAI.Expected_Turnover_1 as expectedTurnover1, DAI.Expected_Turnover_2 as expectedTurnover2, DAI.Expected_Turnover_3 as expectedTurnover2, ' +
      "coalesce (E.First_Name, '') || ' ' || coalesce(E.Last_Name, '') As employeeName, " +
      'P.Previous_Customer_Ship_To as previousCustomerShipTo, ' +
      "CASE WHEN DISCOVERY_TRADE_ASSETS.Discovery_ID IS NULL THEN 'No' ELSE 'Yes' END AS tradeAssetsList, " +
      "CASE WHEN DISCOVERY_CONDITION_AGREEMENTS.Discovery_ID IS NULL THEN 'No' ELSE 'Yes' END AS conditionsSignedSendRequested, " +
      "CASE WHEN DFD.SEPA_Status = 2 THEN 'Yes' ELSE 'No' END AS sepaSignedDatetime, " +
      "coalesce (Employees1.First_Name, '') || ' ' || coalesce(Employees1.Last_Name, '') As createdBy, " +
      'D.Create_Date AS createDate, ' +
      "coalesce (Employees2.First_Name, '') || ' ' || coalesce(Employees2.Last_Name, '') As modifiedBy, " +
      'D.Prospection_Data_Update_Time AS updateDate, D.Customer_Status_Code as customerStatusCode, D.Customer_Status_Code as statusType, P.delegated as delegated, ' +
      'D.Discovery_Id AS discoveryId, P.Sales_Organization as salesOrganization, P.Distribution_Channel as distributionChannel, ' +
      "CASE WHEN Discovery_Customer_Attributes.Priority = '1' " +
      "THEN 'Low' WHEN Discovery_Customer_Attributes.Priority = '2' " +
      "THEN 'Medium' WHEN Discovery_Customer_Attributes.Priority = '3' " +
      "THEN 'High' ELSE Discovery_Customer_Attributes.Priority END as priority, " +
      '(DAI.Expected_Turnover_1 + DAI.Expected_Turnover_2 + DAI.Expected_Turnover_3) As total, ' +
      '(SELECT N.Updated_DateTime FROM Prospect_Visit_Notes N WHERE N.Discovery_ID = D.Discovery_ID ' +
      'ORDER BY N.Updated_DateTime DESC LIMIT 1) AS noteCreationDateTime, ' +
      '(SELECT N.Visit_Note FROM Prospect_Visit_Notes N WHERE N.Discovery_ID = D.Discovery_ID ' +
      'ORDER BY N.Updated_DateTime DESC LIMIT 1) AS visitNote, ' +
      "CASE WHEN D.New_Customer_Request_Status = '0' OR D.New_Customer_Request_Status IS NULL " +
      `OR D.New_Customer_Request_Status = '' THEN '${PROSPECT_STATUS_TITLE.INITIAL}' WHEN D.New_Customer_Request_Status = '1' THEN '${PROSPECT_STATUS_TITLE.NEW_CUSTOMER_REQUESTED}' ` +
      `WHEN D.New_Customer_Request_Status = '4' THEN 'Not Interested' WHEN D.New_Customer_Request_Status = '5' THEN '${PROSPECT_STATUS_TITLE.BACK_OFFICE_VALIDATION}' ` +
      `WHEN D.New_Customer_Request_Status = '6' THEN '${PROSPECT_STATUS_TITLE.REWORK}' WHEN D.New_Customer_Request_Status = '7' THEN ` +
      "'Customer' ELSE D.New_Customer_Request_Status END as newCustomerRequestStatus " +
      PROSPECTS_TABLES_QUERY;

    const PROSPECTS_BASE_TOTAL_QUERY =
      'SELECT COUNT(DISTINCT D.discovery_id) as totalCount ' +
      PROSPECTS_TABLES_QUERY;

    return {PROSPECTS_BASE_QUERY, PROSPECTS_BASE_TOTAL_QUERY};
  }

  /**
   * Function returns Prospects which are assigned to logged in user
   * @returns
   */
  async getProspects(
    start: number,
    limit: number,
    prospectMode: string,
    filterObj: {
      showCustomers?: boolean;
      searchText?: string;
      name?: string;
      address?: string;
      postalCode?: string;
      city?: string;
      prospectNumber?: string;
      externalProspectNumber?: string;
      outlet?: any;
      priority?: any;
      createdFrom?: string;
      createdTill?: string;
      createdBy?: any;
      updatedBy?: any;
    },
  ) {
    const collection = this.getCollection(DISCOVERY_ENTITY);

    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';

    const delegatedEmployeeInfo = await this.getLoggedInDelegatedEmployeeInfo();
    let delegatedEmployeeNo =
      delegatedEmployeeInfo.length > 0
        ? delegatedEmployeeInfo[0].employeeNumber
        : '';

    let empAndDelegatedTerritoryStr =
      await this.getEmployeeAndDelegatedTerritoryStr();

    delegatedEmployeeNo = delegatedEmployeeNo
      ? delegatedEmployeeNo
      : employeeNo;

    const {PROSPECTS_BASE_QUERY, PROSPECTS_BASE_TOTAL_QUERY} =
      await this.getProspectQueries(filterObj);

    let PROSPECTS_FILTER_QUERY = '';

    // Dropdown filters

    if (!filterObj.showCustomers) {
      // Initial filter
      if (prospectMode === PROSPECTS_TYPE.INITIAL) {
        PROSPECTS_FILTER_QUERY +=
          " AND (D.customer_status_code = 'P') AND (D.New_Customer_Request_Status = '' or D.New_Customer_Request_Status = '0' or D.New_Customer_Request_Status IS NULL)";
      }
      // New customer Requested filter
      else if (prospectMode === PROSPECTS_TYPE.NEW_CUSTOMER_REQUESTED) {
        PROSPECTS_FILTER_QUERY +=
          " AND (D.customer_status_code = 'P') AND (D.New_Customer_Request_Status = '1')";
      }
      // Not Interested filter
      else if (prospectMode === PROSPECTS_TYPE.NOT_INTERESTED) {
        PROSPECTS_FILTER_QUERY +=
          " AND (D.customer_status_code = 'P') AND (D.New_Customer_Request_Status = '4')";
      }
      // Back office Validation filter
      else if (prospectMode === PROSPECTS_TYPE.BACK_OFFICE_VALIDATION) {
        PROSPECTS_FILTER_QUERY +=
          " AND (D.customer_status_code = 'P') AND (D.New_Customer_Request_Status = '5')";
      }
      // Rework filter
      else if (prospectMode === PROSPECTS_TYPE.REWORK) {
        PROSPECTS_FILTER_QUERY +=
          " AND (D.customer_status_code = 'P') AND (D.New_Customer_Request_Status = '6')";
      }
      // Partial filter
      else if (prospectMode === PROSPECTS_TYPE.PARTIAL) {
        PROSPECTS_FILTER_QUERY +=
          " AND (D.customer_status_code = 'P') AND ((P.Industry_code is null or p.Industry_code = '') or ((E.First_Name = '' and E.last_Name = '')) or ((E.First_Name IS NULL and E.last_Name IS NULL)) OR (p.phone1 is null or p.phone1 = '') OR (p.name1 is null or p.name1 = '')) ";
      }
      // Completed filter
      else if (prospectMode === PROSPECTS_TYPE.COMPLETED) {
        PROSPECTS_FILTER_QUERY +=
          " AND (D.Customer_status_code = 'P') AND (P.Name1 IS NOT NULL AND P.Name1 <> '' ) AND (P.Phone1 IS NOT NULL AND P.Phone1 <> '' ) AND (P.Address1 IS NOT NULL AND P.Address1 <> '' ) AND (P. Postal_Code IS NOT NULL AND P.Postal_Code <> '' ) AND (P.City IS NOT NULL AND P.City <> '' ) AND (P.Country IS NOT NULL AND P.Country <> '' ) AND (P. Industry_Code IS NOT NULL AND P. Industry_Code <> '' ) AND ((P.EMPLOYEE_NUMBER) IS NOT NULL AND (P.EMPLOYEE_NUMBER) <> '' ) AND ((E.First_Name) IS NOT NULL AND (E.First_Name) <> '' ) AND ((E.Last_Name) IS NOT NULL AND (E.Last_Name) <> '' ) ";
      }
      // All filter
      else {
        PROSPECTS_FILTER_QUERY += " AND (D.customer_status_code = 'P')";
      }
    }

    // Show customers
    if (filterObj.showCustomers) {
      PROSPECTS_FILTER_QUERY +=
        " AND (D.customer_ship_to is not null and D.customer_ship_to <> '') AND (D.prospect_number is not null and D.prospect_number <> '') AND (D.customer_status_code = 'C') ";
    }

    // Search text
    if (filterObj.searchText) {
      if (filterObj.searchText.trim().length > 0) {
        const multiSearchText = filterObj.searchText.trim();
        const accentList = generateAccentString(multiSearchText);

        let name1AccentString = '';
        let name2AccentString = '';
        let name3AccentString = '';
        let addressAccentString = '';
        let cityAccentString = '';

        accentList.forEach((item, index) => {
          if (index === accentList.length - 1) {
            name1AccentString =
              name1AccentString + ` P.Name1 LIKE "%${item}%"  `;
            name2AccentString =
              name2AccentString + ` P.Name2 LIKE "%${item}%"  `;
            name3AccentString =
              name3AccentString + ` P.Name3 LIKE "%${item}%"  `;
            addressAccentString =
              addressAccentString + ` P.Address1 LIKE "%${item}%"  `;
            cityAccentString = cityAccentString + ` P.City LIKE "%${item}%"  `;
          } else {
            name1AccentString =
              name1AccentString + ` P.Name1 LIKE "%${item}%" OR `;
            name2AccentString =
              name2AccentString + ` P.Name2 LIKE "%${item}%" OR `;
            name3AccentString =
              name3AccentString + ` P.Name3 LIKE "%${item}%" OR `;
            addressAccentString =
              addressAccentString + ` P.Address1 LIKE "%${item}%" OR `;
            cityAccentString =
              cityAccentString + ` P.City LIKE "%${item}%" OR `;
          }
        });

        PROSPECTS_FILTER_QUERY +=
          ` AND ( (P.address1 like "%${multiSearchText}%") ` +
          `OR (( ${name1AccentString} OR ${name2AccentString} OR ${name3AccentString}) ` +
          `OR ( ${addressAccentString}) ` +
          `OR P.Postal_Code LIKE "%${multiSearchText}%" ` +
          `OR D.prospect_number LIKE "%${multiSearchText}%" ` +
          `OR D.external_prospect_number LIKE "%${multiSearchText}%" ` +
          `OR (${cityAccentString}))) `;
      }
    }

    // Name
    if (filterObj.name && filterObj.name.trim().length > 0) {
      const name = filterObj.name.trim();
      const accentList = generateAccentString(name);
      let name1AccentString = '';
      let name2AccentString = '';
      let name3AccentString = '';
      accentList.forEach((item, index) => {
        if (index === accentList.length - 1) {
          name1AccentString = name1AccentString + ` P.Name1 LIKE "%${item}%"  `;
          name2AccentString = name2AccentString + ` P.Name2 LIKE "%${item}%"  `;
          name3AccentString = name3AccentString + ` P.Name3 LIKE "%${item}%"  `;
        } else {
          name1AccentString =
            name1AccentString + ` P.Name1 LIKE "%${item}%" OR `;
          name2AccentString =
            name2AccentString + ` P.Name2 LIKE "%${item}%" OR `;
          name3AccentString =
            name3AccentString + ` P.Name3 LIKE "%${item}%" OR `;
        }
      });

      PROSPECTS_FILTER_QUERY =
        PROSPECTS_FILTER_QUERY +
        ` AND ( ${name1AccentString} OR ${name2AccentString} OR ${name3AccentString}) `;
    }

    // Address
    if (filterObj.address && filterObj.address.trim().length > 0) {
      const address = filterObj.address.trim();
      const accentList = generateAccentString(address);
      let addressAccentString = '';

      accentList.forEach((item, index) => {
        if (index === accentList.length - 1) {
          addressAccentString =
            addressAccentString + ` P.Address1 LIKE "%${item}%"  `;
        } else {
          addressAccentString =
            addressAccentString + ` P.Address1 LIKE "%${item}%" OR `;
        }
      });

      PROSPECTS_FILTER_QUERY =
        PROSPECTS_FILTER_QUERY + ` AND ( ${addressAccentString} ) `;
    }

    // Postal code
    if (filterObj.postalCode && filterObj.postalCode.trim().length > 0) {
      const postalCode = filterObj.postalCode.trim();
      PROSPECTS_FILTER_QUERY =
        PROSPECTS_FILTER_QUERY + ` AND P.Postal_Code LIKE "${postalCode}%" `;
    }

    // City
    if (filterObj.city && filterObj.city.trim().length > 0) {
      const city = filterObj.city.trim();
      const accentList = generateAccentString(city);
      let cityAccentString = '';

      accentList.forEach((item, index) => {
        if (index === accentList.length - 1) {
          cityAccentString = cityAccentString + ` P.City LIKE "%${item}%"  `;
        } else {
          cityAccentString = cityAccentString + ` P.City LIKE "%${item}%" OR `;
        }
      });

      PROSPECTS_FILTER_QUERY =
        PROSPECTS_FILTER_QUERY + ` AND ( ${cityAccentString} ) `;
    }

    // Prospect number
    if (
      filterObj.prospectNumber &&
      filterObj.prospectNumber.trim().length > 0
    ) {
      const prospectNumber = filterObj.prospectNumber.trim();
      PROSPECTS_FILTER_QUERY =
        PROSPECTS_FILTER_QUERY +
        ` AND D.prospect_number LIKE "%${prospectNumber}%" `;
    }

    // External prospect number
    if (
      filterObj.externalProspectNumber &&
      filterObj.externalProspectNumber.trim().length > 0
    ) {
      const externalProspectNumber = filterObj.externalProspectNumber.trim();
      PROSPECTS_FILTER_QUERY =
        PROSPECTS_FILTER_QUERY +
        ` AND D.external_prospect_number LIKE "%${externalProspectNumber}%" `;
    }

    // Industry code
    if (filterObj.outlet && filterObj.outlet.length > 0) {
      const industryCode = filterObj.outlet[0].industryCode;
      PROSPECTS_FILTER_QUERY =
        PROSPECTS_FILTER_QUERY +
        ` AND P.Industry_Code LIKE "${industryCode}%" `;
    }

    // Priority
    if (filterObj.priority && filterObj.priority.length > 0) {
      const priority = filterObj.priority[0].value;
      PROSPECTS_FILTER_QUERY =
        PROSPECTS_FILTER_QUERY +
        ` AND Discovery_Customer_Attributes.Priority LIKE "${priority}%" `;
    }

    // Created from
    if (filterObj.createdFrom) {
      const createdFrom = formatDate(filterObj.createdFrom);

      PROSPECTS_FILTER_QUERY =
        PROSPECTS_FILTER_QUERY +
        ` AND strftime("%Y-%m-%d",D.create_date) >= strftime("%Y-%m-%d",'${createdFrom}') `;
    }

    // Created till
    if (filterObj.createdTill) {
      const createdTill = formatDate(filterObj.createdTill);
      PROSPECTS_FILTER_QUERY =
        PROSPECTS_FILTER_QUERY +
        ` AND strftime("%Y-%m-%d",D.create_date) <= strftime("%Y-%m-%d",'${createdTill}') `;
    }

    if (filterObj.createdBy.length > 0 || filterObj.updatedBy.length > 0) {
      // Created by
      if (filterObj.createdBy && filterObj.createdBy.length > 0) {
        const createdBy = filterObj.createdBy[0].employeeNumber;
        PROSPECTS_FILTER_QUERY =
          PROSPECTS_FILTER_QUERY + ` AND D.Created_By = "${createdBy}" `;
      }

      // Updated by
      if (filterObj.updatedBy && filterObj.updatedBy.length > 0) {
        const updatedBy = filterObj.updatedBy[0].employeeNumber;
        PROSPECTS_FILTER_QUERY =
          PROSPECTS_FILTER_QUERY +
          ` And (D.Modified_By = "${updatedBy}" OR P.Update_Employee_Number = "${updatedBy}") `;
      }
    } else {
      PROSPECTS_FILTER_QUERY +=
        `AND (D.Created_By IN('${employeeNo}','${delegatedEmployeeNo}') OR P.EMPLOYEE_NUMBER IN('${employeeNo}','${delegatedEmployeeNo}') ` +
        `OR P.ID_Territory in (${empAndDelegatedTerritoryStr})) `;
    }

    const ORDER_BY_QUERY = ` ORDER BY D.Prospection_Data_Update_Time DESC, D.Create_Date DESC`;
    const LIMIT_QUERY = ` LIMIT ${limit} OFFSET ${start}`;

    const results = await collection
      .query(
        Q.unsafeSqlQuery(
          PROSPECTS_BASE_QUERY +
            PROSPECTS_FILTER_QUERY +
            ORDER_BY_QUERY +
            LIMIT_QUERY,
        ),
      )
      .unsafeFetchRaw();

    const totalCountResults = await collection
      .query(
        Q.unsafeSqlQuery(
          PROSPECTS_BASE_TOTAL_QUERY + PROSPECTS_FILTER_QUERY + ORDER_BY_QUERY,
        ),
      )
      .unsafeFetchRaw();

    let totalCount = 0;
    if (totalCountResults.length > 0) {
      totalCount = totalCountResults[0].totalCount;
    }

    return {results, totalCount};
  }

  /**
   * Function returns particular prospect data for update
   * @returns
   */
  async getProspectById(discoveryId: string) {
    const collection = this.getCollection(DISCOVERY_ENTITY);

    const QUERY =
      "select d.discovery_id as discoveryId, p.delegated, p.previous_customer_sales_organization || '-' || " +
      'p.previous_customer_distribution_channel as salesAreaValue, d.prospect_number as prospectNumber, ' +
      'p.previous_customer_ship_to as previousCustomerShipTo, d.created_by as createdBy, p.industry_code as professionalCode, ' +
      'p.employee_number as employeeNumber, cic.description_language_1 as description, ' +
      "coalesce(p.affiliation_hierarchy_node,'')  as affiliationHierarchyNode, " +
      'p.name1 as establishment, p.phone1 as telephone, p.mail_address as mailAddress, ' +
      'p.house_number as street, p.address1 as address, d.customer_status_code as statusType, ' +
      'dlv.discovery_list_values_id as country, postal_code as zipCode, ' +
      'city, dfd.expected_turnover_1 as expectedTurnover1, dfd.expected_turnover_2 as expectedTurnover2, ' +
      'dfd.expected_turnover_3 as expectedTurnover3, dfd.total_potential as totalPotential ' +
      'from discovery d inner join prospects p on d.discovery_id  = p.discovery_id ' +
      'left outer join customers_industry_codes cic on cic.industry_code  = p.industry_code ' +
      'left join discovery_list_values dlv on p.country=dlv.discovery_list_values_id ' +
      'left join discovery_financial_data as dfd on d.discovery_id = dfd.discovery_id ' +
      `where d.discovery_id = '${discoveryId}'`;

    const results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    if (results.length > 0) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns customer request status for B.O validation
   * @returns
   */
  async checkCustomerRequestStatus(discoveryId: string) {
    const collection = this.getCollection(DISCOVERY_ENTITY);

    const QUERY =
      'select discovery_id as discoveryId from discovery ' +
      'where [discovery_id]= ? ' +
      "and new_customer_request_status = '5'";

    const QUERY_VALUES = [discoveryId];

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns rework status
   * @returns
   */
  async checkReworkStatus(discoveryId: string) {
    const collection = this.getCollection(DISCOVERY_ENTITY);

    const QUERY =
      'select discovery_id as discoveryId from discovery ' +
      'where [discovery_id]= ? ' +
      "and new_customer_request_status = '6'";

    const QUERY_VALUES = [discoveryId];

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns new customer creation request status
   * @returns
   */
  async checkNewCustomerCreationRequestStatus(discoveryId: string) {
    const collection = this.getCollection(DISCOVERY_ENTITY);

    const QUERY =
      'select discovery_id as discoveryId from discovery ' +
      'where [discovery_id]= ? ' +
      "and new_customer_request_status = '3'";

    const QUERY_VALUES = [discoveryId];

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns completed status
   * @returns
   */
  async checkCompletedStatus(discoveryId: string) {
    const collection = this.getCollection(DISCOVERY_ENTITY);

    const QUERY =
      'select discovery_id as discoveryId from discovery ' +
      'where [discovery_id]= ? ' +
      "and new_customer_request_status = '1'";

    const QUERY_VALUES = [discoveryId];

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns true/false based on not interested update
   * @returns
   */
  async updateNotInterested(discoveryId: string, isInterested: boolean) {
    const collection = this.getCollection(DISCOVERY_ENTITY);

    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const currentDate = getISOCurrentDate();

    const newCustomerRequestStatus = isInterested
      ? PROSPECTS_TYPE.INITIAL
      : PROSPECTS_TYPE.NOT_INTERESTED;

    const prospectObj = await collection
      .query(Q.where('discovery_id', discoveryId))
      .fetch();

    if (prospectObj.length > 0) {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await prospectObj[0].update((rec: any) => {
          rec.newCustomerRequestStatus = newCustomerRequestStatus;
          rec.sentDatetime = null;
          rec.prospectionDataUpdateTime = currentDate;
          rec.prospectionDataUpdateEmployeeNumber = employeeNo;
        });
      });
      return true;
    } else {
      return false;
    }
  }

  /**
   * Function returns true/false based on prospect modification update
   * @returns
   */
  async updateProspectModification(discoveryId: string) {
    const collection = this.getCollection(DISCOVERY_ENTITY);

    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const currentDate = getISOCurrentDate();

    const prospectObj = await collection
      .query(Q.where('discovery_id', discoveryId))
      .fetch();

    if (prospectObj.length > 0) {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await prospectObj[0].update((rec: any) => {
          rec.updateDate = currentDate;
          rec.sentDatetime = null;
          rec.modifiedBy = employeeNo;
          rec.prospectionDataUpdateTime = currentDate;
          rec.prospectionDataUpdateEmployeeNumber = employeeNo;
        });
      });
      return true;
    } else {
      return false;
    }
  }

  /**
   * Function for prospect data insertion
   * @returns
   */
  async insertProspectDiscoveryData(discoveryId: string, prospectData: any) {
    try {
      const collection = this.getCollection(DISCOVERY_ENTITY);
      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';

      const currentDate = getISOCurrentDate();

      const externalProspectNumber = `${prospectData.phoneNumber
        .slice(0, 15)
        .padStart(15, '0')}${getCurrentTimeForId()}`;

      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.discoveryId = discoveryId;
          rec.customerStatusCode = 'P';
          rec.createDate = currentDate;
          rec.createdBy = employeeNo;
          rec.modifiedBy = employeeNo;
          rec.updateDate = currentDate;
          rec.externalProspectNumber = externalProspectNumber;
          rec.businessType = 'C';
          rec.indirectProspect = '0';
          rec.sentDatetime = null;
        });
      });
      return true;
    } catch (error) {
      console.log('insertProspectDiscoveryData error :>> ', error);
      return false;
    }
  }

  /**
   * Function return Prospect Details/Expected Turnover/Employee Details for PL Overview
   * @returns
   */
  async getProspectDetailsExpectedTurnoverAndEmployeeDetails() {
    try {
      const collection = this.getCollection(DISCOVERY_ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const QUERY =
        "select distinct case when p.industry_code <> '' " +
        "or p.industry_code <> null then p.industry_code || ' - ' || cic.description_language_1 " +
        "else '' end as industryCode, p.affiliation_hierarchy_node || " +
        "coalesce(' - ' || chst.name_hier_l6, '') as customerHierarchy, " +
        "coalesce (e.first_name, '') || ' ' || coalesce(e.last_name, '') as fsr, " +
        "case when discovery_customer_attributes.priority = '1' then 'Low' " +
        "when discovery_customer_attributes.priority = '2' then 'Medium' " +
        "when discovery_customer_attributes.priority = '3' then 'High' " +
        "else '' end as priority, " +
        'dai.expected_turnover_1 as ice, dai.expected_turnover_2 as frozenBakery, ' +
        'dai.expected_turnover_3 as frozenFood, dai.expected_turnover_1 + expected_turnover_2 + expected_turnover_3 as total, ' +
        "coalesce (employees1.first_name, '') || ' ' || coalesce(employees1.last_name, '') as createdBy, " +
        "strftime('%d-%m-%Y', d.create_date) as createdDate, " +
        "coalesce (employees2.first_name, '') || ' ' || coalesce(employees2.last_name, '') as updatedBy, " +
        "strftime('%d-%m-%Y', d.prospection_data_update_time) as updatedDate, " +
        'd.prospect_number as prospectNumber, d.external_prospect_number as externalProspectNumber, ' +
        'd.customer_ship_to as customerShipTo, p.previous_customer_ship_to as previousCustomerShipTo ' +
        'from discovery d inner join prospects p on d.discovery_id = p.discovery_id left join employees ' +
        'as employees2 on d.prospection_data_update_employee_number = employees2.employee_number ' +
        'left join employees as employees1 on d.created_by = employees1.employee_number ' +
        'left join discovery_financial_data as dai on d.discovery_id = dai.discovery_id ' +
        'left join (select distinct(customer_hier_l6), name_hier_l6 from customer_hierarchies_ship_to) ' +
        'chst on chst.customer_hier_l6 = p.affiliation_hierarchy_node left outer join ' +
        'customers_industry_codes cic on cic.industry_code = p.industry_code left join ' +
        'employees e on p.employee_number = e.employee_number left join discovery_customer_attributes ' +
        'on discovery_customer_attributes.discovery_id = d.discovery_id where d.discovery_id = ?';

      const QUERY_VALUES = [discoveryId];

      let results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log(
        'getProspectDetailsExpectedTurnoverAndEmployeeDetails error :>> ',
        error,
      );
      return [];
    }
  }

  /**
   * Function stores customer data in discovery table before navigating to PLP
   * @returns
   */
  async storeCustomerDataInDiscovery(
    discoveryId: string,
    customerShipTo: string,
  ) {
    try {
      const collection = this.getCollection(DISCOVERY_ENTITY);

      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';

      const currentDate = getISOCurrentDate();

      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.discoveryId = discoveryId;
          rec.customerStatusCode = 'C';
          rec.createDate = currentDate;
          rec.createdBy = employeeNo;
          rec.prospectionDataUpdateTime = currentDate;
          rec.prospectionDataUpdateEmployeeNumber = employeeInfo;
          rec.newCustomerRequestStatus = '0';
          rec.customerShipTo = customerShipTo;
          rec.sentDatetime = null;
        });
      });
      return true;
    } catch (error) {
      console.log('storeCustomerDataInDiscovery error :>> ', error);
      return false;
    }
  }
  /**
   * Function for get prospect backoffice notes
   * @returns
   */
  async getSRNotes() {
    const prospectData = await this.getPLProspectInfo();
    const discoveryId = prospectData?.discoveryId
      ? prospectData.discoveryId
      : '';
    const collection = this.getCollection(DISCOVERY_ENTITY);

    const QUERY =
      'select sr_notes as srNotes ' +
      'from  discovery ' +
      `where discovery_id = "${discoveryId}" `;

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
   * Update PLP Ship to Discovery info
   * @returns
   */
  async updateProspectDiscoveryInfo(data: any) {
    const collection = this.getCollection(DISCOVERY_ENTITY);
    const prospectData = await this.getPLProspectInfo();
    const discoveryId = prospectData?.discoveryId
      ? prospectData.discoveryId
      : '';
    const prospectObj = await collection
      .query(Q.where('discovery_id', discoveryId))
      .fetch();
    try {
      if (prospectObj.length > 0) {
        const website = data?.website
          ? 'https://' + data.website
          : prospectObj.website;
        await OFFLINE_STORAGE.getDB().write(async () => {
          await prospectObj[0].update((rec: any) => {
            rec.webSite = website;
          });
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Prepoluate Prospect Basic info - BillTo data in PLP screen
   */
  async getPLPProspectBillToData() {
    const prospectData = await this.getPLProspectInfo();
    const discoveryId = prospectData?.discoveryId
      ? prospectData.discoveryId
      : '';

    const collection = this.getCollection(DISCOVERY_ENTITY);
    const QUERY =
      'select customer_bill_to, name1_bill_to as name1, ' +
      'name2_bill_to as name2, name3_bill_to as name3, ' +
      'name4_bill_to as name4, house_number_bill_to as houseNumber, ' +
      'address1_bill_to as address1, coalesce(street1_bill_to,"") as address2, ' +
      'coalesce(street2_bill_to,"") as address3, ' +
      'coalesce(street3_bill_to,"") as street3_bill_to, ' +
      'postal_code_bill_to as zipCode, coalesce(city_bill_to,"") as city, ' +
      'postal_box_bill_to as poBox, postal_code_box_bill_to as postalCodePOBox, ' +
      'city_box_bill_to as cityPOBox, country_bill_to as country, ' +
      'coalesce(mail_address_bill_to,"") as email, ' +
      'coalesce(phone1_bill_to,"") as phoneNumber, ' +
      'coalesce(phone2_bill_to,"") as mobileNumber, ' +
      'coalesce(fax_bill_to,"") as fax ' +
      'from discovery ' +
      `where discovery_id = '${discoveryId}' `;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }

  /**
   * Update PLP Bill to Discovery info
   * @returns
   */
  async updateProspectBillToDiscoveryInfo(prospectData: any) {
    const prospectInfo = await this.getPLProspectInfo();
    const discoveryId = prospectInfo?.discoveryId
      ? prospectInfo.discoveryId
      : '';
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const currentDate = getISOCurrentDate();

    const collection = this.getCollection(DISCOVERY_ENTITY);

    const prospectObj = await collection
      .query(Q.where('discovery_id', discoveryId))
      .fetch();

    if (prospectObj.length > 0) {
      console.log('prospectData', prospectData);
      const name1BillTo = prospectData?.name1 ? prospectData.name1 : '';
      const name2BillTo = prospectData?.name2 ? prospectData.name2 : '';
      const name3BillTo = prospectData?.name3 ? prospectData.name3 : '';
      const name4BillTo = prospectData?.name4 ? prospectData.name4 : '';
      const houseNumberBillTo = prospectData?.houseNumber
        ? prospectData.houseNumber
        : '';
      const address1BillTo = prospectData?.address1
        ? prospectData.address1
        : '';
      const street1BillTo = prospectData?.address2 ? prospectData.address2 : '';
      const street2BillTo = prospectData?.address3 ? prospectData.address3 : '';

      const postalCodeBillTo = prospectData?.zipCode
        ? prospectData.zipCode
        : '';
      const cityBillTo = prospectData?.city ? prospectData.city : '';
      const postalBoxBillTo = prospectData?.poBox ? prospectData.poBox : '';
      const postalCodeBoxBillTo = prospectData?.postalCodePOBox
        ? prospectData.postalCodePOBox
        : '';
      const cityBoxBillTo = prospectData?.cityPOBox
        ? prospectData.cityPOBox
        : '';
      const countryBillTo = prospectData?.country ? prospectData.country : '';
      const mailAddressBillTo = prospectData?.email ? prospectData.email : '';
      const phone1BillTo = prospectData?.phoneNumber
        ? prospectData.phoneNumber
        : '';
      const phone2BillTo = prospectData?.mobileNumber
        ? prospectData.mobileNumber
        : '';
      const faxBillTo = prospectData?.fax ? prospectData.fax : '';

      await OFFLINE_STORAGE.getDB().write(async () => {
        await prospectObj[0].update((rec: any) => {
          rec.name1BillTo = name1BillTo;
          rec.name2BillTo = name2BillTo;
          rec.name3BillTo = name3BillTo;
          rec.name4BillTo = name4BillTo;
          rec.houseNumberBillTo = houseNumberBillTo;
          rec.address1BillTo = address1BillTo;
          rec.street1BillTo = street1BillTo;
          rec.street2BillTo = street2BillTo;

          rec.postalCodeBillTo = postalCodeBillTo;
          rec.cityBillTo = cityBillTo;
          rec.postalBoxBillTo = postalBoxBillTo;
          rec.postalCodeBoxBillTo = postalCodeBoxBillTo;
          rec.cityBoxBillTo = cityBoxBillTo;
          rec.countryBillTo = countryBillTo;
          rec.mailAddressBillTo = mailAddressBillTo;
          rec.phone1BillTo = phone1BillTo;
          rec.phone2BillTo = phone2BillTo;
          rec.faxBillTo = faxBillTo;
          rec.sentDatetime = null;
          rec.updateDate = currentDate;
          rec.modifiedBy = employeeNo;
        });
      });
      return true;
    } else {
      return false;
    }
  }

  /**
   * Prepoluate Prospect Basic info - Delivery Address data in PLP screen
   */
  async getPLPProspectDeliveryAddressData() {
    const prospectData = await this.getPLProspectInfo();
    const discoveryId = prospectData?.discoveryId
      ? prospectData.discoveryId
      : '';

    const collection = this.getCollection(DISCOVERY_ENTITY);
    const QUERY =
      'select name1_diff_addr as name1, ' +
      'name2_diff_addr as name2, ' +
      'name3_diff_addr as name3, name4_diff_addr as name4, ' +
      'house_number_diff_addr as houseNumber, ' +
      'address1_diff_addr as address1, ' +
      'coalesce(street1_diff_addr, "") as address2, ' +
      'coalesce(street2_diff_addr, "") as address3, ' +
      'coalesce(street3_bill_to, "") as street3, ' +
      'postal_code_diff_addr as zipCode, ' +
      'coalesce(city_diff_addr, "") as city, ' +
      'postal_box_diff_addr as poBox, ' +
      'postal_code_box_diff_addr as postalCodePOBox, ' +
      'city_box_diff_addr as cityPOBox, ' +
      'country_diff_addr as country, ' +
      'coalesce(phone1_diff_addr, "") as phoneNumber, ' +
      'coalesce(phone2_diff_addr, "") as mobileNumber, ' +
      'coalesce(mail_address_diff_addr, "") as email, ' +
      'coalesce(fax_diff_addr, "") as fax ' +
      'from discovery ' +
      `where discovery_id = '${discoveryId}' `;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }

  /**
   * Update PLP Bill to Discovery info
   * @returns
   */
  async updateProspectDeliveryAddressInfo(prospectData: any) {
    const prospectInfo = await this.getPLProspectInfo();
    const discoveryId = prospectInfo?.discoveryId
      ? prospectInfo.discoveryId
      : '';
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const currentDate = getISOCurrentDate();

    const collection = this.getCollection(DISCOVERY_ENTITY);

    const prospectObj = await collection
      .query(Q.where('discovery_id', discoveryId))
      .fetch();

    if (prospectObj.length > 0) {
      console.log('prospectData', prospectData);
      const name1BillTo = prospectData?.name1 ? prospectData.name1 : '';
      const name2BillTo = prospectData?.name2 ? prospectData.name2 : '';
      const name3BillTo = prospectData?.name3 ? prospectData.name3 : '';
      const name4BillTo = prospectData?.name4 ? prospectData.name4 : '';
      const houseNumberBillTo = prospectData?.houseNumber
        ? prospectData.houseNumber
        : '';
      const address1BillTo = prospectData?.address1
        ? prospectData.address1
        : '';
      const street1BillTo = prospectData?.address2 ? prospectData.address2 : '';
      const street2BillTo = prospectData?.address3 ? prospectData.address3 : '';

      const postalCodeBillTo = prospectData?.zipCode
        ? prospectData.zipCode
        : '';
      const cityBillTo = prospectData?.city ? prospectData.city : '';
      const postalBoxBillTo = prospectData?.poBox ? prospectData.poBox : '';
      const postalCodeBoxBillTo = prospectData?.postalCodePOBox
        ? prospectData.postalCodePOBox
        : '';
      const cityBoxBillTo = prospectData?.cityPOBox
        ? prospectData.cityPOBox
        : '';
      const countryBillTo = prospectData?.country ? prospectData.country : '';
      const mailAddressBillTo = prospectData?.email ? prospectData.email : '';
      const phone1BillTo = prospectData?.phoneNumber
        ? prospectData.phoneNumber
        : '';
      const phone2BillTo = prospectData?.mobileNumber
        ? prospectData.mobileNumber
        : '';
      const faxBillTo = prospectData?.fax ? prospectData.fax : '';

      await OFFLINE_STORAGE.getDB().write(async () => {
        await prospectObj[0].update((rec: any) => {
          rec.name1DiffAddr = name1BillTo;
          rec.name2DiffAddr = name2BillTo;
          rec.name3DiffAddr = name3BillTo;
          rec.name4DiffAddr = name4BillTo;
          rec.houseNumberDiffAddr = houseNumberBillTo;
          rec.address1DiffAddr = address1BillTo;
          rec.street1DiffAddr = street1BillTo;
          rec.street2DiffAddr = street2BillTo;
          rec.postalCodeDiffAddr = postalCodeBillTo;
          rec.cityDiffAddr = cityBillTo;
          rec.postalBoxDiffAddr = postalBoxBillTo;
          rec.postalCodeBoxDiffAddr = postalCodeBoxBillTo;
          rec.cityBoxDiffAddr = cityBoxBillTo;
          rec.countryDiffAddr = countryBillTo;
          rec.mailAddressDiffAddr = mailAddressBillTo;
          rec.phone1DiffAddr = phone1BillTo;
          rec.phone2DiffAddr = phone2BillTo;
          rec.faxDiffAddr = faxBillTo;
          rec.sentDatetime = null;
          rec.updateDate = currentDate;
          rec.modifiedBy = employeeNo;
        });
      });
      return true;
    } else {
      return false;
    }
  }

  /**
   * Pre populate Customer Financial Info data
   */
  async getCustomerFinancialInfo() {
    try {
      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const collection = this.getCollection(DISCOVERY_ENTITY);
      const QUERY =
        'select dfd.tax_payer_account_number as taxPayerAccountNumber, ' +
        'dfd.sales_tax_identification_number as salesTaxIdentificationNumber, ' +
        'c.payment_method as paymentMethod, c.payment_term as paymentTerms, ' +
        "coalesce(dfd.delivery_note_type, '') as deliveryNoteType, " +
        'cai.expected_turnover_1 as expectedTurnover1, ' +
        'cai.expected_turnover_2 as expectedTurnover2, ' +
        'cai.expected_turnover_3 as expectedTurnover3, ' +
        'cai.expected_turnover_1 + cai.expected_turnover_2 + cai.expected_turnover_3 as totalPotential, ' +
        'dfd.invoice_rhythm as invoiceRhythm, dfd.rekap, ' +
        "coalesce(dfd.ta_minimum_turnover_explained, '0') as taMinimumTurnoverExplained, " +
        'dfd.pdf_invoicing as pdfInvoicing, ' +
        "coalesce(dfd.email_for_pdf_invoicing, '') as emailForPdfInvoicing " +
        'from discovery d inner join customers c on d.customer_ship_to = c.customer_ship_to ' +
        'inner join prospects p on d.discovery_id = p.discovery_id ' +
        'and p.sales_organization = c.sales_organization and p.distribution_channel = c.distribution_channel ' +
        'left join customers_additional_information cai on c.customer_ship_to = cai.customer_hierarchy_node ' +
        'and c.sales_organization = cai.sales_organization and c.distribution_channel = cai.distribution_channel ' +
        'left join discovery_financial_data dfd on d.discovery_id = dfd.discovery_id where d.discovery_id = ?';

      const QUERY_VALUES = [discoveryId];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      return results;
    } catch (error) {
      console.log('getCustomerFinancialInfo error', error);
    }
  }

  /**
   * Function returns true/false based on prospect backoffice notes modification
   * @returns
   */
  async updateSRNotes(notes: string) {
    const prospectData = await this.getPLProspectInfo();
    const discoveryId = prospectData?.discoveryId
      ? prospectData.discoveryId
      : '';
    const collection = this.getCollection(DISCOVERY_ENTITY);

    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const currentDate = getISOCurrentDate();

    const prospectObj = await collection
      .query(Q.where('discovery_id', discoveryId))
      .fetch();
    if (prospectObj.length > 0) {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await prospectObj[0].update((rec: any) => {
          rec.srNotes = notes;
          rec.sentDatetime = null;
          rec.prospectionDataUpdateTime = currentDate;
          rec.prospectionDataUpdateEmployeeNumber = employeeNo;
        });
      });
      return true;
    } else {
      return false;
    }
  }

  /**
   * Update Sepa Prospect Overwrite info
   * @returns boolean
   */
  async updateSepaOverwriteInfo() {
    const collection = this.getCollection(DISCOVERY_ENTITY);
    const prospectData = await this.getPLProspectInfo();
    const discoveryId = prospectData?.discoveryId
      ? prospectData.discoveryId
      : '';

    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const currentDate = getISOCurrentDate();
    const prospectObj = await collection
      .query(Q.where('discovery_id', discoveryId))
      .fetch();
    try {
      if (prospectObj.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await prospectObj[0].update((rec: any) => {
            rec.sentDatetime = null;
            rec.prospectionDataUpdateTime = currentDate;
            rec.prospectionDataUpdateEmployeeNumber = employeeNo;
          });
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Update New_Customer_Request_Status
   * @returns boolean
   */
  async updateNewCustomerRequestStatus() {
    try {
      const collection = this.getCollection(DISCOVERY_ENTITY);
      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
      const currentDate = getISOCurrentDate();
      const prospectObj = await collection
        .query(Q.where('discovery_id', discoveryId))
        .fetch();

      try {
        if (prospectObj.length > 0) {
          await OFFLINE_STORAGE.getDB().write(async () => {
            await prospectObj[0].update((rec: any) => {
              rec.newCustomerRequestStatus = '1';
              rec.updateDate = currentDate;
              rec.modifiedBy = employeeNo;
              rec.sentDatetime = null;
              rec.customerCreationRequestedBy = employeeNo;
              rec.requestedDatetime = currentDate;
            });
          });
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.log('nested updateNewCustomerRequestStatus error :>> ', error);
        return false;
      }
    } catch (error) {
      console.log('updateNewCustomerRequestStatus error :>> ', error);
      return false;
    }
  }

  /**
   * PLP -> Trade asset request TA Wish data for preview
   */
  async getTradeAssetWishPreviewData(agreementNumber: string) {
    try {
      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';
      const collection = this.getCollection(DISCOVERY_ENTITY);
      const QUERY =
        'SELECT DISTINCT Discovery_New_Trade_Assets_Wished.TA_Description AS taDescription, ' +
        'Discovery_New_Trade_Assets_Wished.Material_Number AS materialNumber, ' +
        'Discovery_New_Trade_Assets_Wished.Quantity AS quantity, ' +
        'Discovery_New_Trade_Assets_Wished.Expected_Turnover AS expectedTurnover, ' +
        'Discovery_List_Values.Description_Language_1 AS design, ' +
        'Discovery_New_Trade_Assets_Wished.Price_Tag AS price, ' +
        "COALESCE(Discovery_Trade_Assets.Justification,'') As justification " +
        'FROM Discovery ' +
        'LEFT JOIN Discovery_Trade_Assets ON Discovery.Discovery_Id = Discovery_Trade_Assets.Discovery_Id ' +
        'LEFT JOIN Discovery_New_Trade_Assets_Wished ON Discovery.Discovery_Id = Discovery_New_Trade_Assets_Wished.Discovery_Id AND ' +
        'Discovery_New_Trade_Assets_Wished.TA_Loan_Agreement_Number = Discovery_Trade_Assets.TA_Loan_Agreement_Number ' +
        'LEFT JOIN Discovery_List_Values ON Discovery_List_Values.Discovery_List_Values_Id = Discovery_New_Trade_Assets_Wished.Design ' +
        `WHERE Discovery.Discovery_Id ='${discoveryId}' ` +
        `AND Discovery_New_Trade_Assets_Wished.TA_Loan_Agreement_Number = '${agreementNumber}' `;

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getTradeAssetWishRequest error :>> ', error);
      return [];
    }
  }

  /**
   * PLP -> Trade asset request TA Take over data for preview
   */
  async getTradeAssetTakeOverPreviewData(agreementNumber: string) {
    try {
      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';
      const collection = this.getCollection(DISCOVERY_ENTITY);
      const QUERY =
        "SELECT DISTINCT COALESCE(Discovery_Previous_Owner_Trade_Assets.Previous_customer_Ship_to, '') AS previousCustomerShipTo, " +
        "COALESCE(Materials.Description_Language_1, '') AS materialDescription, " +
        "COALESCE(Serial_Number, '') AS serialNumber, " +
        "COALESCE(Expected_Turnover, '') AS expectedTurnoverTa, " +
        "CASE WHEN Discovery_Previous_Owner_Trade_Assets.Price_Tag IS NULL THEN '' " +
        "WHEN Discovery_Previous_Owner_Trade_Assets.Price_Tag = 0 THEN '' " +
        'ELSE Discovery_Previous_Owner_Trade_Assets.Price_Tag ' +
        'END AS price, ' +
        "COALESCE(Discovery_Trade_Assets.Justification,'') As justification " +
        'FROM Discovery ' +
        'LEFT JOIN Discovery_Previous_Owner_Trade_Assets ON Discovery.Discovery_Id = Discovery_Previous_Owner_Trade_Assets.Discovery_Id ' +
        'LEFT JOIN Discovery_Trade_Assets ON Discovery.Discovery_Id = Discovery_Trade_Assets.Discovery_Id And ' +
        'Discovery_Trade_Assets.TA_Loan_Agreement_Number = Discovery_Previous_Owner_Trade_Assets.TA_Loan_Agreement_Number ' +
        'LEFT JOIN Materials ON Materials.Material_Number = ' +
        "substr('000000000000000000' || Discovery_Previous_Owner_Trade_Assets.Material_Number, length(Discovery_Previous_Owner_Trade_Assets.Material_Number) + 1 , 18) " +
        'AND Materials.Sales_Organization = Discovery_Previous_Owner_Trade_Assets.Previous_Customer_Sales_Organization ' +
        'AND Materials.Distribution_Channel = Discovery_Previous_Owner_Trade_Assets.Previous_Customer_Distribution_Channel ' +
        `WHERE Discovery.Discovery_Id ='${discoveryId}' ` +
        `AND Discovery_Previous_Owner_Trade_Assets.TA_Loan_Agreement_Number = '${agreementNumber}' ` +
        "AND Discovery_Previous_Owner_Trade_Assets.TOO = '1' ";

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getTradeAssetTakeOverPreviewData error :>> ', error);
      return [];
    }
  }

  /**
   * SWF -> Remote prospect check
   */
  async checkIsRemoteProspect(customerShipTo: string) {
    try {
      const collection = this.getCollection(DISCOVERY_ENTITY);

      const QUERY =
        'select discovery_id from discovery where prospect_number = ?';

      const QUERY_VALUES = [customerShipTo];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log('checkIsRemoteProspect error :>> ', error);
      return true;
    }
  }

  /**
   * PLP -> Is prospect data exists
   */
  async checkIsProspectDataExist(discoveryId: string) {
    try {
      const collection = this.getCollection(DISCOVERY_ENTITY);

      const QUERY = 'select * from discovery where discovery_id = ?';

      const QUERY_VALUES = [discoveryId];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('checkIsProspectDataExist error :>> ', error);
      return false;
    }
  }
}
