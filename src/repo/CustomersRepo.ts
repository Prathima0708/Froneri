import BaseRepo from './BaseRepo';
import Customers from 'src/storage/OfflineDBStorage/WmDB/models/Customers';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import {formatDate, getISOCurrentDate} from 'src/utils/CommonUtil';

import {CUSTOMER_TYPES} from 'src/utils/Constant';
import {generateAccentString} from 'src/utils/Util';

const ENTITY = OFFLINE_STORAGE.MODEL.CUSTOMERS;

const DISCOVERY_ENTITY = OFFLINE_STORAGE.MODEL.DISCOVERY;

export class CustomersRepo extends BaseRepo<Customers> {
  /**
   * Function return final result of customer search
   * @param {start} number
   * @param {limit} number
   * @param {filterType} string
   * @param {filterObj} any
   */
  async searchOfflineCustomers(
    start: number,
    limit: number,
    customerType: string,
    filterObj: any,
  ) {
    let results: any = {results: [], totalCount: 0};
    if (customerType === CUSTOMER_TYPES.ALL) {
      results = await this.searchAll(start, limit, customerType, filterObj);
    } else if (customerType === CUSTOMER_TYPES.PROSPECT) {
      results = await this.searchProspects(
        start,
        limit,
        customerType,
        filterObj,
      );
    } else {
      results = await this.searchCustomers(
        start,
        limit,
        customerType,
        filterObj,
      );
    }

    return results;
  }
  /***
   * Function returns  All array
   *
   */
  async searchAll(
    start: number,
    limit: number,
    customerType: string,
    filterObj: any,
  ) {
    //  Customers Query ....

    const customersCollection = this.getCollection(ENTITY);

    const {CUSTOMERS_BASE_QUERY} = await this.getCustomerBaseQuery();

    const CUSTOMERS_FILTER_QUERY = await this.getCustomersFilterQuery(
      customerType,
      filterObj,
    );

    // Prospects Query starts...

    const {PROSPECTS_BASE_QUERY} = await this.getProspectBaseQuery();

    const PROSPECTS_FILTER_QUERY = await this.getProspectsFilterQuery(
      filterObj,
    );

    const LIMIT_QUERY = ` ORDER BY Name1 ASC limit ${limit} offset ${start}`;

    // get the customer results
    const QUERY =
      'select * from ( ' +
      CUSTOMERS_BASE_QUERY +
      CUSTOMERS_FILTER_QUERY +
      ' UNION ' +
      PROSPECTS_BASE_QUERY +
      PROSPECTS_FILTER_QUERY +
      ' ) ' +
      LIMIT_QUERY;

    let results = await customersCollection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    //get the total count

    const COUNT_QUERY =
      'select COUNT(*) AS totalCount from ( ' +
      CUSTOMERS_BASE_QUERY +
      CUSTOMERS_FILTER_QUERY +
      ' UNION ' +
      PROSPECTS_BASE_QUERY +
      PROSPECTS_FILTER_QUERY +
      ' ) ';
    let totalCountResults = await customersCollection
      .query(Q.unsafeSqlQuery(COUNT_QUERY))
      .unsafeFetchRaw();
    console.log('the all total count', totalCountResults);

    let totalCount = 0;
    if (totalCountResults.length > 0) {
      totalCount = totalCountResults[0].totalCount;
    }

    return {results, totalCount: totalCount};
  }

  /***
   * Function returns only the customers array
   *
   */
  async searchCustomers(
    start: number,
    limit: number,
    customerType: string,
    filterObj: any,
  ) {
    // delegatedEmployeeNo = '0000000015';
    //delegatedEmployeeTerritoryId = '0099111608';

    const collection = this.getCollection(ENTITY);

    const {CUSTOMERS_BASE_QUERY, CUSTOMERS_BASE_TOTAL_QUERY} =
      await this.getCustomerBaseQuery();

    const CUSTOMERS_FILTER_QUERY = await this.getCustomersFilterQuery(
      customerType,
      filterObj,
    );

    // also add start & limit
    let LIMIT_QUERY = ` ORDER BY name1 ASC limit ${limit} offset ${start} `;

    // get the customer results
    const QUERY = CUSTOMERS_BASE_QUERY + CUSTOMERS_FILTER_QUERY + LIMIT_QUERY;
    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    //get the total count
    const COUNT_QUERY = CUSTOMERS_BASE_TOTAL_QUERY + CUSTOMERS_FILTER_QUERY;
    let totalCountResults = await collection
      .query(Q.unsafeSqlQuery(COUNT_QUERY))
      .unsafeFetchRaw();

    let totalCount = 0;
    if (totalCountResults.length > 0) {
      totalCount = totalCountResults[0].totalCount;
    }

    return {results, totalCount};
  }

  /***
   * Function returns only the customers array
   *
   */
  async searchProspects(
    start: number,
    limit: number,
    customerType: string,
    filterObj: any,
  ) {
    const collection = this.getCollection(DISCOVERY_ENTITY);

    const {PROSPECTS_BASE_QUERY, PROSPECTS_BASE_TOTAL_QUERY} =
      await this.getProspectBaseQuery();

    const PROSPECTS_FILTER_QUERY = await this.getProspectsFilterQuery(
      filterObj,
    );

    const LIMIT_QUERY = ` ORDER BY Name1 ASC limit ${limit} offset ${start}`;

    // get the results

    // get the customer results
    const QUERY = PROSPECTS_BASE_QUERY + PROSPECTS_FILTER_QUERY + LIMIT_QUERY;
    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    //get the total count
    const COUNT_QUERY = PROSPECTS_BASE_TOTAL_QUERY + PROSPECTS_FILTER_QUERY;
    let totalCountResults = await collection
      .query(Q.unsafeSqlQuery(COUNT_QUERY))
      .unsafeFetchRaw();

    let totalCount = 0;
    if (totalCountResults.length > 0) {
      totalCount = totalCountResults[0].totalCount;
    }

    return {results, totalCount};
  }

  async getCustomerBaseQuery() {
    const todaysCurrentDate = getISOCurrentDate();
    const todayDateOnly = todaysCurrentDate.split(' ')[0];

    const delegatedEmployeeInfo = await this.getLoggedInDelegatedEmployeeInfo();
    let delegatedEmployeeNo =
      delegatedEmployeeInfo.length > 0
        ? delegatedEmployeeInfo[0].employeeNumber
        : '';

    let empAndDelegatedTerritoryStr =
      await this.getEmployeeAndDelegatedTerritoryStr();

    if (delegatedEmployeeNo != '') {
      empAndDelegatedTerritoryStr =
        `"${delegatedEmployeeNo}"` + ' , ' + empAndDelegatedTerritoryStr;
    }
    console.log('empAndDelegatedTerritoryStr', empAndDelegatedTerritoryStr);
    // Base Query to get customer results

    const CUSTOMERS_BASE_QUERY =
      'SELECT DISTINCT 0 AS Sel, ' +
      '"" AS employeeNo, ' +
      'COALESCE(Customers.Sales_Representative, "") AS salesRepresentative, ' +
      'Customers_Additional_Information.End_Customer_Business_DateTime as endCustomerBusinessDatetime, ' +
      'COALESCE(Customers.Customer_Ship_To, "") AS customer_ship_to, ' +
      'Customers.name1 as name1, Customers.name2, Customers.name3, Customers.postal_code, ' +
      'Customers.city, COALESCE(Customers.Industry_Code, "") AS Industry_Code, ' +
      'Customers.address1, CAST(Customers.Trade_Assets_Amount AS REAL) AS Amount_Trade_Assets, ' +
      'Customers.ABC_Classification as abc_classification, COALESCE(Distributors.Description_Language_1, "") AS Distributor, ' +
      'Customers.last_visit_datetime, ' +
      'Customers.Sales_Organization as sales_organization, ' +
      'Customers.Distribution_Channel as distribution_channel, ' +
      'CASE WHEN Color IS NOT NULL THEN COLOR ' +
      'ELSE "" END AS Color, ' +
      '"C" AS status_type, Discovery.Discovery_Id AS Discovery_ID, ' +
      'Customers.ID_Territory AS ID_Territory, ' +
      '"0" AS New_Customer_Request_Status, ' +
      'COALESCE(Customers.Sales_Responsible, "") AS Sales_Responsible, ' +
      'COALESCE(Customers.Sales_Manager, "") AS Sales_Manager, "" AS Created_By, ' +
      'COALESCE(Customers.Street3, "") AS street3, ' +
      'COALESCE(Customers.Customer_Group_15, "") AS customer_group_15, ' +
      'CAST(Customers_Turnover_Information.Total_Last_Year AS REAL) AS Total_Last_Year, ' +
      'CAST(Customers_Turnover_Information.Total_YTD_Current_Year AS REAL) AS Total_YTD_Current_Year, ' +
      'CAST(Customers_Turnover_Information.Total_YTD_Last_Year AS REAL) AS Total_YTD_Last_Year, ' +
      'CAST(Customers_Turnover_Information.Total_Difference AS REAL) AS Total_Difference, ' +
      'CAST(Customers_Turnover_Information.ICE_Total_Last_Year AS REAL) AS ICE_Total_Last_Year, ' +
      'CAST(Customers_Turnover_Information.ICE_YTD_Current_Year AS REAL) AS ICE_YTD_Current_Year, ' +
      'CAST(Customers_Turnover_Information.ICE_YTD_Last_Year AS REAL) AS ICE_YTD_Last_Year, ' +
      'CAST(Customers_Turnover_Information.ICE_Difference AS REAL) AS ICE_Difference, ' +
      'CAST(Customers_Turnover_Information.Frozen_Bakery_Total_Last_Year AS REAL) AS Frozen_Bakery_Total_Last_Year, ' +
      'CAST(Customers_Turnover_Information.Frozen_Bakery_YTD_Current_Year AS REAL) AS Frozen_Bakery_YTD_Current_Year, ' +
      'CAST(Customers_Turnover_Information.Frozen_Bakery_YTD_Last_Year AS REAL) AS Frozen_Bakery_YTD_Last_Year, ' +
      'CAST(Customers_Turnover_Information.Frozen_Bakery_Difference AS REAL) AS Frozen_Bakery_Difference, ' +
      'CAST(Customers_Turnover_Information.Frozen_Food_Total_Last_Year AS REAL) AS Frozen_Food_Total_Last_Year, ' +
      'CAST(Customers_Turnover_Information.Frozen_Food_YTD_Current_Year AS REAL) AS Frozen_Food_YTD_Current_Year, ' +
      'CAST(Customers_Turnover_Information.Frozen_Food_YTD_Last_Year AS REAL) AS Frozen_Food_YTD_Last_Year, ' +
      'CAST(Customers_Turnover_Information.Frozen_Food_Difference AS REAL) AS Frozen_Food_Difference, ' +
      'CASE WHEN (Customers.Last_Visit_DateTime IS NULL ' +
      'OR Customers.Last_Visit_DateTime IS NOT NULL) ' +
      'AND COALESCE(Customers_ABC_Classifications.Visit_Threshold_Days, 0) = 0 THEN 0 ' +
      'WHEN (julianday("now") - julianday(Customers.Last_Visit_DateTime)) > Customers_ABC_Classifications.Visit_Threshold_Days THEN 1 ' +
      'ELSE 0 END AS Visit_Threshold, ' +
      'Customers.delegated, ' +
      'Customers.remote ' +
      // 'COALESCE(customers.Latitude,"0") AS latitude, ' +
      // 'COALESCE(customers.Longitude,"0") AS longitude ' +
      'FROM Customers ' +
      'LEFT JOIN Customers_Segregation ON Customers.Customer_Group_15 = Customers_Segregation.Customer_Group_15 ' +
      'INNER JOIN Customers_Route_Customer_Assignment ON Customers.Customer_Ship_To = Customers_Route_Customer_Assignment.Customer_Ship_To ' +
      'AND Customers.Sales_Organization = Customers_Route_Customer_Assignment.Sales_Organization ' +
      'AND Customers.Distribution_Channel = Customers_Route_Customer_Assignment.Distribution_Channel ' +
      'LEFT OUTER JOIN Customers_Additional_Information  ON Customers.Customer_Ship_To = Customers_Additional_Information.Customer_Hierarchy_Node ' +
      'AND Customers.Distribution_Channel = Customers_Additional_Information.Distribution_Channel ' +
      'AND Customers.Sales_Organization = Customers_Additional_Information.Sales_Organization ' +
      'LEFT JOIN Customer_Hierarchies_Ship_To AS CHS  ON Customers.Customer_Ship_To = CHS.Customer_Ship_To ' +
      'AND Customers.Sales_Organization = CHS.Sales_Organization ' +
      'AND Customers.Distribution_Channel = CHS.Distribution_Channel ' +
      'LEFT JOIN Turnover_Aggregated_Customers_Materials As TACM ON ' +
      'Customers.Customer_Ship_To  = TACM.Customer_Ship_To ' +
      'AND Customers.Sales_Organization = TACM.Sales_Organization ' +
      'AND Customers.Distribution_Channel = TACM.Distribution_Channel ' +
      'LEFT JOIN Turnover_Aggregated_Month TAM ON Customers.Customer_Ship_To = TAM.Customer_Ship_To ' +
      'LEFT JOIN Customers_ABC_Classifications  ON Customers.ABC_Classification = Customers_ABC_Classifications.ABC_Classification ' +
      'LEFT JOIN Discovery  ON Discovery.Customer_Ship_To = Customers.Customer_Ship_To ' +
      'LEFT JOIN Prospects  ON Discovery.Discovery_Id = Prospects.Discovery_Id ' +
      'AND Customers.Sales_Organization = Prospects.Sales_Organization ' +
      'AND Customers.Distribution_Channel = Prospects.Distribution_Channel ' +
      'AND Prospects.Delete_Prospect <> "1" ' +
      'LEFT JOIN  Discovery_Customer_Attributes  ON Discovery.Discovery_ID = Discovery_Customer_Attributes.Discovery_ID ' +
      'LEFT JOIN Distributors  ON Distributors.ID_Distributors = Discovery_Customer_Attributes.ID_Distributors ' +
      'LEFT JOIN Customers_Turnover_Information  ON Customers.Customer_Ship_To = Customers_Turnover_Information.Customer_Ship_To ' +
      'AND Customers.Sales_Organization = Customers_Turnover_Information.Sales_Organization ' +
      'AND Customers.Distribution_Channel = Customers_Turnover_Information.Distribution_Channel ' +
      'WHERE ' +
      `strftime("%Y-%m-%d", Customers_Route_Customer_Assignment.Valid_From_DateTime) <="${todayDateOnly}" ` +
      `AND strftime("%Y-%m-%d", Customers_Route_Customer_Assignment.Valid_To_DateTime) >="${todayDateOnly}" AND ` +
      'Active_In_TESS = "1" ' +
      `AND Customers.ID_Territory IN (${empAndDelegatedTerritoryStr} )`;

    // CUSTOMER BASE QUERY TO GET TOTAL COUNT
    const CUSTOMERS_BASE_TOTAL_QUERY =
      'SELECT COUNT(DISTINCT Customers.Customer_Ship_To) AS totalCount ' +
      'FROM Customers ' +
      'LEFT JOIN Customers_Segregation ON Customers.Customer_Group_15 = Customers_Segregation.Customer_Group_15 ' +
      'INNER JOIN Customers_Route_Customer_Assignment ON Customers.Customer_Ship_To = Customers_Route_Customer_Assignment.Customer_Ship_To ' +
      'AND Customers.Sales_Organization = Customers_Route_Customer_Assignment.Sales_Organization ' +
      'AND Customers.Distribution_Channel = Customers_Route_Customer_Assignment.Distribution_Channel ' +
      'LEFT OUTER JOIN Customers_Additional_Information  ON Customers.Customer_Ship_To = Customers_Additional_Information.Customer_Hierarchy_Node ' +
      'AND Customers.Distribution_Channel = Customers_Additional_Information.Distribution_Channel ' +
      'AND Customers.Sales_Organization = Customers_Additional_Information.Sales_Organization ' +
      'LEFT JOIN Customer_Hierarchies_Ship_To AS CHS  ON Customers.Customer_Ship_To = CHS.Customer_Ship_To ' +
      'AND Customers.Sales_Organization = CHS.Sales_Organization ' +
      'AND Customers.Distribution_Channel = CHS.Distribution_Channel ' +
      'LEFT JOIN Turnover_Aggregated_Customers_Materials As TACM ON ' +
      'Customers.Customer_Ship_To  = TACM.Customer_Ship_To ' +
      'AND Customers.Sales_Organization = TACM.Sales_Organization ' +
      'AND Customers.Distribution_Channel = TACM.Distribution_Channel ' +
      'LEFT JOIN Turnover_Aggregated_Month TAM ON Customers.Customer_Ship_To = TAM.Customer_Ship_To ' +
      'LEFT JOIN Customers_ABC_Classifications  ON Customers.ABC_Classification = Customers_ABC_Classifications.ABC_Classification ' +
      'LEFT JOIN Discovery  ON Discovery.Customer_Ship_To = Customers.Customer_Ship_To ' +
      'LEFT JOIN Prospects  ON Discovery.Discovery_Id = Prospects.Discovery_Id ' +
      'AND Customers.Sales_Organization = Customers.Sales_Organization ' +
      'AND Customers.Distribution_Channel = Customers.Distribution_Channel ' +
      'AND Prospects.Delete_Prospect <> "1" ' +
      'LEFT JOIN  Discovery_Customer_Attributes  ON Discovery.Discovery_ID = Discovery_Customer_Attributes.Discovery_ID ' +
      'LEFT JOIN Distributors  ON Distributors.ID_Distributors = Discovery_Customer_Attributes.ID_Distributors ' +
      'LEFT JOIN Customers_Turnover_Information  ON Customers.Customer_Ship_To = Customers_Turnover_Information.Customer_Ship_To ' +
      'AND Customers.Sales_Organization = Customers_Turnover_Information.Sales_Organization ' +
      'AND Customers.Distribution_Channel = Customers_Turnover_Information.Distribution_Channel ' +
      'WHERE ' +
      `strftime("%Y-%m-%d", Customers_Route_Customer_Assignment.Valid_From_DateTime) <="${todayDateOnly}" ` +
      `AND strftime("%Y-%m-%d", Customers_Route_Customer_Assignment.Valid_To_DateTime) >="${todayDateOnly}" AND ` +
      'Active_In_TESS = "1" ' +
      `AND Customers.ID_Territory IN (${empAndDelegatedTerritoryStr} )`;

    return {CUSTOMERS_BASE_QUERY, CUSTOMERS_BASE_TOTAL_QUERY};
  }

  async getProspectBaseQuery() {
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

    if (delegatedEmployeeNo != '') {
      empAndDelegatedTerritoryStr =
        `"${delegatedEmployeeNo}"` + ' , ' + empAndDelegatedTerritoryStr;
    }
    console.log('empAndDelegatedTerritoryStr', empAndDelegatedTerritoryStr);

    let PROSPECTS_BASE_QUERY =
      'SELECT DISTINCT 0 AS Sel, ' +
      'COALESCE(P.Employee_Number, "") AS employeeNo, ' +
      '"" as salesRepresentative, ' +
      'NULL as endCustomerBusinessDatetime, ' +
      'COALESCE(D.Prospect_Number, "") AS customer_ship_to, ' +
      'P.Name1 as name1, COALESCE(P.Name2, "") AS name2, ' +
      'COALESCE(P.Name3, "") AS name3, ' +
      'P.Postal_Code as postal_code, P.City as city, "" as Industry_Code, P.Address1 as address1, ' +
      'NULL AS Amount_Trade_Assets, ' +
      'COALESCE(Discovery_Customer_Attributes.ABC_Classification, "") AS abc_classification, ' +
      'COALESCE(Distributors.Description_Language_1, "") AS Distributor, ' +
      '(SELECT Updated_DateTime AS last_visit_datetime ' +
      'FROM Prospect_Visit_Notes N ' +
      'WHERE N.Discovery_ID = D.Discovery_ID ' +
      'ORDER BY last_visit_datetime DESC limit 1) as last_visit_datetime, ' +
      '"" as sales_organization, "" as distribution_channel, ' +
      '"" AS Color, "P" AS status_type, ' +
      'COALESCE(D.Discovery_Id, "") AS Discovery_ID, ' +
      'COALESCE(P.ID_Territory, "") AS ID_Territory, ' +
      'COALESCE(D.New_Customer_Request_Status, "0") AS New_Customer_Request_Status, ' +
      '"" AS Sales_Responsible,  "" AS Sales_Manager, ' +
      'COALESCE(D.Created_By, "") AS Created_By, ' +
      '"" AS street3, "" AS customer_group_15, ' +
      'NULL AS Total_Last_Year, ' +
      'NULL AS Total_YTD_Current_Year, ' +
      'NULL AS Total_YTD_Last_Year, ' +
      'NULL AS Total_Difference, ' +
      'NULL AS ICE_Total_Last_Year, ' +
      'NULL AS ICE_YTD_Current_Year, ' +
      'NULL AS ICE_YTD_Last_Year, ' +
      'NULL AS ICE_Difference, ' +
      'NULL AS Frozen_Bakery_Total_Last_Year, ' +
      'NULL AS Frozen_Bakery_YTD_Current_Year, ' +
      'NULL AS Frozen_Bakery_YTD_Last_Year, ' +
      'NULL AS Frozen_Bakery_Difference, ' +
      'NULL AS Frozen_Food_Total_Last_Year, ' +
      'NULL AS Frozen_Food_YTD_Current_Year, ' +
      'NULL AS Frozen_Food_YTD_Last_Year, ' +
      'NULL AS Frozen_Food_Difference, ' +
      '"" AS Visit_Threshold, P.delegated, ' +
      '"0" as remote ' +
      // 'COALESCE(P.Latitude,"0") AS latitude, ' +
      // 'COALESCE(P.Longitude,"0") AS longitude ' +
      'FROM Discovery D ' +
      'INNER JOIN Prospects P  ON D.Discovery_Id = P.Discovery_Id ' +
      'LEFT JOIN Prospect_Visit_Notes N  ON N.Discovery_ID = D.Discovery_ID ' +
      'LEFT JOIN Discovery_Customer_Attributes ON D.Discovery_ID = Discovery_Customer_Attributes.Discovery_ID ' +
      'LEFT JOIN Distributors  ON Distributors.ID_Distributors = Discovery_Customer_Attributes.ID_Distributors ' +
      'WHERE D.Customer_Status_Code = "P" AND  D.Indirect_Prospect = "0" ' +
      'AND (P.Delete_Prospect <> "1" ' +
      `AND (D.Created_By = "${employeeNo}" ` +
      `OR P.ID_Territory IN ( ${empAndDelegatedTerritoryStr} ) ` +
      `OR P.Employee_Number = "${employeeNo}" )) `;

    let PROSPECTS_BASE_TOTAL_QUERY =
      'SELECT COUNT(DISTINCT D.Discovery_ID) AS totalCount ' +
      'FROM Discovery D ' +
      'INNER JOIN Prospects P  ON D.Discovery_Id = P.Discovery_Id ' +
      'LEFT JOIN Prospect_Visit_Notes N  ON N.Discovery_ID = D.Discovery_ID ' +
      'LEFT JOIN Discovery_Customer_Attributes ON D.Discovery_ID = Discovery_Customer_Attributes.Discovery_ID ' +
      'LEFT JOIN Distributors  ON Distributors.ID_Distributors = Discovery_Customer_Attributes.ID_Distributors ' +
      'WHERE D.Customer_Status_Code = "P" AND  D.Indirect_Prospect = "0" ' +
      'AND (P.Delete_Prospect <> "1" ' +
      `AND (D.Created_By = "${employeeNo}" ` +
      `OR P.ID_Territory IN ( ${empAndDelegatedTerritoryStr} ) ` +
      `OR P.Employee_Number = "${employeeNo}" )) `;

    return {PROSPECTS_BASE_QUERY, PROSPECTS_BASE_TOTAL_QUERY};
  }

  async getCustomersFilterQuery(customerType: string, filterObj: any) {
    let CUSTOMERS_FILTER_QUERY = '';
    const todaysCurrentDate = getISOCurrentDate();
    const todayDateOnly = todaysCurrentDate.split(' ')[0];
    // append below query with Base Query if customerType is Direct
    if (customerType === CUSTOMER_TYPES.DIRECT) {
      CUSTOMERS_FILTER_QUERY =
        CUSTOMERS_FILTER_QUERY +
        ' and Customers.Street3 <> "" AND Customers.Street3 = Customers.Customer_Ship_To ';
    }

    //append below query with Base Query if customerType is Indirect
    if (customerType === CUSTOMER_TYPES.INDIRECT) {
      CUSTOMERS_FILTER_QUERY =
        CUSTOMERS_FILTER_QUERY +
        ' and Customers.Street3 <> "" AND Customers.Street3 <> Customers.Customer_Ship_To AND Customers.customer_group_15 == "" ';
    }

    // append below query  if multi search text is not empty
    if (filterObj && filterObj.multiSearchText.length > 0) {
      const multiSearchText = filterObj.multiSearchText.trim();
      const accentList = generateAccentString(multiSearchText);
      let name1AccentString = '';
      let name2AccentString = '';
      let name3AccentString = '';
      let addressAccentString = '';
      let cityAccentString = '';
      accentList.forEach((item, index) => {
        if (index === accentList.length - 1) {
          name1AccentString =
            name1AccentString + ` Customers.Name1 LIKE "%${item}%"  `;
          name2AccentString =
            name2AccentString + ` Customers.Name2 LIKE "%${item}%"  `;
          name3AccentString =
            name3AccentString + ` Customers.Name3 LIKE "%${item}%"  `;
          addressAccentString =
            addressAccentString + ` Customers.Address1 LIKE "%${item}%"  `;
          cityAccentString =
            cityAccentString + ` Customers.City LIKE "%${item}%"  `;
        } else {
          name1AccentString =
            name1AccentString + ` Customers.Name1 LIKE "%${item}%" OR `;
          name2AccentString =
            name2AccentString + ` Customers.Name2 LIKE "%${item}%" OR `;
          name3AccentString =
            name3AccentString + ` Customers.Name3 LIKE "%${item}%" OR `;
          addressAccentString =
            addressAccentString + ` Customers.Address1 LIKE "%${item}%" OR `;
          cityAccentString =
            cityAccentString + ` Customers.City LIKE "%${item}%" OR `;
        }
      });

      CUSTOMERS_FILTER_QUERY =
        CUSTOMERS_FILTER_QUERY +
        ` AND ((Customers.External_Address like "%${multiSearchText}%") ` +
        `OR (( ${name1AccentString} OR ${name2AccentString} OR ${name3AccentString}) ` +
        `OR ( ${addressAccentString}) ` +
        `OR Customers.Postal_Code LIKE "${multiSearchText}%" ` +
        `OR Customers.Customer_Ship_To LIKE "%${multiSearchText}%" ` +
        `OR (${cityAccentString}))) `;
    }

    // append below query  if name is not empty
    if (filterObj && filterObj.name.length > 0) {
      const name = filterObj.name.trim();
      const accentList = generateAccentString(name);
      let name1AccentString = '';
      let name2AccentString = '';
      let name3AccentString = '';
      accentList.forEach((item, index) => {
        if (index === accentList.length - 1) {
          name1AccentString =
            name1AccentString + ` Customers.Name1 LIKE "%${item}%"  `;
          name2AccentString =
            name2AccentString + ` Customers.Name2 LIKE "%${item}%"  `;
          name3AccentString =
            name3AccentString + ` Customers.Name3 LIKE "%${item}%"  `;
        } else {
          name1AccentString =
            name1AccentString + ` Customers.Name1 LIKE "%${item}%" OR `;
          name2AccentString =
            name2AccentString + ` Customers.Name2 LIKE "%${item}%" OR `;
          name3AccentString =
            name3AccentString + ` Customers.Name3 LIKE "%${item}%" OR `;
        }
      });

      CUSTOMERS_FILTER_QUERY =
        CUSTOMERS_FILTER_QUERY +
        ` AND ( ${name1AccentString} OR ${name2AccentString} OR ${name3AccentString}) `;
    }

    // append below query  if address is not empty
    if (filterObj && filterObj.address.length > 0) {
      const address = filterObj.address.trim();
      const accentList = generateAccentString(address);
      let addressAccentString = '';

      accentList.forEach((item, index) => {
        if (index === accentList.length - 1) {
          addressAccentString =
            addressAccentString + ` Customers.Address1 LIKE "%${item}%"  `;
        } else {
          addressAccentString =
            addressAccentString + ` Customers.Address1 LIKE "%${item}%" OR `;
        }
      });

      CUSTOMERS_FILTER_QUERY =
        CUSTOMERS_FILTER_QUERY + ` AND ( ${addressAccentString} ) `;
    }

    // append below query  if postalCode is not empty
    if (filterObj && filterObj.postalCode.length > 0) {
      const postalCode = filterObj.postalCode.trim();
      CUSTOMERS_FILTER_QUERY =
        CUSTOMERS_FILTER_QUERY +
        ` AND Customers.Postal_Code LIKE "${postalCode}%" `;
    }

    // append below query  if city is not empty
    if (filterObj && filterObj.city.length > 0) {
      const city = filterObj.city.trim();
      const accentList = generateAccentString(city);
      let cityAccentString = '';

      accentList.forEach((item, index) => {
        if (index === accentList.length - 1) {
          cityAccentString =
            cityAccentString + ` Customers.City LIKE "%${item}%"  `;
        } else {
          cityAccentString =
            cityAccentString + ` Customers.City LIKE "%${item}%" OR `;
        }
      });

      CUSTOMERS_FILTER_QUERY =
        CUSTOMERS_FILTER_QUERY + ` AND ( ${cityAccentString} ) `;
    }

    // append below query if inActiveCustomerOnly is true
    if (filterObj?.inActiveCustomerOnly) {
      CUSTOMERS_FILTER_QUERY = CUSTOMERS_FILTER_QUERY + ' ';
    } else {
      CUSTOMERS_FILTER_QUERY =
        CUSTOMERS_FILTER_QUERY +
        ` AND (strftime("%Y-%m-%d", Customers_Additional_Information.End_Customer_Business_DateTime) >= "${todayDateOnly}" ` +
        ' OR Customers_Additional_Information.End_Customer_Business_DateTime IS NULL) ';
    }

    if (filterObj && filterObj.visitedFrom != '' && filterObj.visitedTo != '') {
      const visitedFrom = formatDate(filterObj.visitedFrom);
      const visitedTo = formatDate(filterObj.visitedTo);

      CUSTOMERS_FILTER_QUERY =
        CUSTOMERS_FILTER_QUERY +
        `AND ((strftime("%Y-%m-%d", Last_Visit_Datetime) >="${visitedFrom}" AND (strftime("%Y-%m-%d", Last_Visit_Datetime) <="${visitedTo}" ) ` +
        ` ${
          filterObj?.isNoLastVisitDate ? 'OR Last_Visit_Datetime IS NULL ' : ''
        })) `;
    }

    // append below query if industry code / outlet is not empty
    if (filterObj && filterObj.outlet.length > 0) {
      const industryCode = filterObj.outlet[0].industryCode;
      CUSTOMERS_FILTER_QUERY =
        CUSTOMERS_FILTER_QUERY +
        `AND Customers.Industry_Code LIKE "${industryCode}%" `;
    }

    // append below query if abcClassification is not empty
    if (filterObj && filterObj.abcClassification.length > 0) {
      // pass value separated by comma(,)
      const abcClassifications = filterObj.abcClassification.map(
        (item: any) => `"${item.abcClassification}"`,
      );
      const separatedByComma = abcClassifications.join(', ');
      console.log('separatedByComma', separatedByComma);

      CUSTOMERS_FILTER_QUERY =
        CUSTOMERS_FILTER_QUERY +
        `AND Customers.ABC_Classification IN (${separatedByComma}) `;
    }

    // append below query if product group is not empty
    if (filterObj && filterObj.productGroup.length > 0) {
      // pass value separated by comma(,)
      console.log('filterObj.productGroup', filterObj.productGroup);
      const productGroup = filterObj.productGroup[0].idTurnoverGroup;
      CUSTOMERS_FILTER_QUERY =
        CUSTOMERS_FILTER_QUERY +
        `AND TAM.ID_Turnover_Group = "${productGroup}" `;
    }

    // append below query if customer Hierarchy  is not empty
    if (filterObj && filterObj.customerHierarchy.length > 0) {
      console.log('filterObj.productGroup', filterObj.customerHierarchy);
      // pass value separated by comma(,)
      const customerHierarchy = filterObj.customerHierarchy[0].customerHierL6;
      CUSTOMERS_FILTER_QUERY =
        CUSTOMERS_FILTER_QUERY +
        `AND CHS.Customer_Hier_L6 = "${customerHierarchy}" `;
    }

    // append below query if product material  is not empty
    if (filterObj && filterObj.productMaterial.length > 0) {
      // pass value separated by comma(,)
      const productMaterial = filterObj.productMaterial;
      CUSTOMERS_FILTER_QUERY =
        CUSTOMERS_FILTER_QUERY +
        `AND TACM.Material_Number IN ("${productMaterial}") `;
    }

    // append below query if distributor  is not empty
    if (filterObj && filterObj.distributor.length > 0) {
      // pass value separated by comma(,)
      // if(filterObj.distributor[0])
      if (filterObj.distributor[0].idDistributors !== 0) {
        const distributors = filterObj.distributor.map(
          (item: any) => `${item.idDistributors}`,
        );
        const separatedByComma = distributors.join(', ');
        CUSTOMERS_FILTER_QUERY =
          CUSTOMERS_FILTER_QUERY +
          `AND Distributors.ID_Distributors IN (${separatedByComma}) `;
      }
    }

    // append below query if scooping is true
    if (filterObj?.scooping) {
      CUSTOMERS_FILTER_QUERY =
        CUSTOMERS_FILTER_QUERY +
        'AND Discovery_Customer_Attributes.Scooping = "1"';
    }
    console.log('CUSTOMERS_FILTER_QUERY', CUSTOMERS_FILTER_QUERY);
    return CUSTOMERS_FILTER_QUERY;
  }

  async getProspectsFilterQuery(filterObj: any) {
    let FILTER_QUERY = '';
    const todaysCurrentDate = getISOCurrentDate();
    const todayDateOnly = todaysCurrentDate.split(' ')[0];
    // append below query  if multi search text is not empty
    if (filterObj && filterObj.multiSearchText.length > 0) {
      const multiSearchText = filterObj.multiSearchText.trim();
      const accentList = generateAccentString(multiSearchText);
      let name1AccentString = '';
      let addressAccentString = '';
      let cityAccentString = '';
      accentList.forEach((item, index) => {
        if (index === accentList.length - 1) {
          name1AccentString = name1AccentString + ` P.Name1 LIKE "%${item}%"  `;

          addressAccentString =
            addressAccentString + ` P.Address1 LIKE "%${item}%"  `;
          cityAccentString = cityAccentString + ` P.City LIKE "%${item}%"  `;
        } else {
          name1AccentString =
            name1AccentString + ` P.Name1 LIKE "%${item}%" OR `;

          addressAccentString =
            addressAccentString + ` P.Address1 LIKE "%${item}%" OR `;
          cityAccentString = cityAccentString + ` P.City LIKE "%${item}%" OR `;
        }
      });

      FILTER_QUERY =
        FILTER_QUERY +
        ` AND (( ${name1AccentString} OR ${addressAccentString} OR P.Postal_Code LIKE "${multiSearchText}%" OR D.Prospect_Number LIKE "%${multiSearchText}%" OR ${cityAccentString})) `;
    }

    // append below query  if name is not empty
    if (filterObj && filterObj.name.length > 0) {
      const name = filterObj.name.trim();
      const accentList = generateAccentString(name);
      let name1AccentString = '';
      accentList.forEach((item, index) => {
        if (index === accentList.length - 1) {
          name1AccentString = name1AccentString + ` P.Name1 LIKE "%${item}%"  `;
        } else {
          name1AccentString =
            name1AccentString + ` P.Name1 LIKE "%${item}%" OR `;
        }
      });

      FILTER_QUERY = FILTER_QUERY + ` AND ( ${name1AccentString} ) `;
    }

    // append below query  if address is not empty
    if (filterObj && filterObj.address.length > 0) {
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

      FILTER_QUERY = FILTER_QUERY + ` AND ( ${addressAccentString} ) `;
    }

    // append below query  if postalCode is not empty
    if (filterObj && filterObj.postalCode.length > 0) {
      const postalCode = filterObj.postalCode.trim();
      FILTER_QUERY = FILTER_QUERY + ` AND P.Postal_Code LIKE "${postalCode}%" `;
    }

    // append below query  if city is not empty
    if (filterObj && filterObj.city.length > 0) {
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

      FILTER_QUERY = FILTER_QUERY + ` AND ( ${cityAccentString} ) `;
    }

    // append below query if last visit date is true
    if (filterObj && filterObj.visitedFrom != '' && filterObj.visitedTo != '') {
      const visitedFrom = formatDate(filterObj.visitedFrom);
      const visitedTo = formatDate(filterObj.visitedTo);
      console.log('visit From & visit to', visitedFrom, visitedTo);

      FILTER_QUERY =
        FILTER_QUERY +
        ` AND ((strftime("%Y-%m-%d", Updated_DateTime) >= "${visitedFrom}" AND (strftime("%Y-%m-%d", Updated_DateTime) <= "${visitedTo}" ) ` +
        ` ${
          filterObj?.isNoLastVisitDate ? 'OR Updated_DateTime IS NULL ' : ''
        })) `;
    }

    // append below query if industry code / outlet is not empty
    if (filterObj && filterObj.outlet.length > 0) {
      const industryCode = filterObj.outlet[0].industryCode;
      FILTER_QUERY =
        FILTER_QUERY + ` AND P.Industry_Code LIKE "${industryCode}%" `;
    }

    // append below query if abcClassification is not empty
    if (filterObj && filterObj.abcClassification.length > 0) {
      // pass value separated by comma(,)
      const abcClassifications = filterObj.abcClassification.map(
        (item: any) => `"${item.abcClassification}"`,
      );
      const separatedByComma = abcClassifications.join(', ');
      FILTER_QUERY =
        FILTER_QUERY +
        ` AND Discovery_Customer_Attributes.ABC_Classification IN (${separatedByComma}) `;
    }

    // append below query if priority is not empty
    if (filterObj && filterObj.priority.length > 0) {
      const priority = filterObj.priority[0].value;
      FILTER_QUERY =
        FILTER_QUERY +
        ` AND Discovery_Customer_Attributes.Priority = "${priority}" `;
    }

    // append below query if distributor  is not empty
    if (filterObj && filterObj.distributor.length > 0) {
      if (filterObj.distributor[0].idDistributors !== 0) {
        // pass value separated by comma(,)
        const distributors = filterObj.distributor.map(
          (item: any) => `${item.idDistributors}`,
        );
        const separatedByComma = distributors.join(', ');
        FILTER_QUERY =
          FILTER_QUERY +
          ` AND Distributors.ID_Distributors IN (${separatedByComma}) `;
      }
    }

    // append below query if scooping is true
    if (filterObj?.scooping) {
      FILTER_QUERY =
        FILTER_QUERY + ' AND Discovery_Customer_Attributes.Scooping = "1"';
    }

    return FILTER_QUERY;
  }

  async getCustomerInfo(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    const collection = this.getCollection(ENTITY);

    const QUERY =
      'select customers.customer_ship_to as customerShipTo, ' +
      'customers.sales_organization as salesOrganization, ' +
      'customers.distribution_channel as distributionChannel, customer_sold_to as customerSoldTo, ' +
      "coalesce(picking_plant_number,'') as pickingPlantNumber, " +
      "coalesce(delivering_plant_number,'') as deliveringPlantNumber, " +
      'telesales_text_1 as telesalesText1, telesales_text_2 as telesalesText2, ' +
      'telesales_text_3 telesalesText3, telesales_text_4 as telesalesText4, ' +
      'active_in_tess as activeInTess, active_in_rca as activeInRca, ' +
      'contact1_name as contact1Name, contact1_phone_1 as contact1Phone1, ' +
      'contact2_name as contact2Name, contact2_phone_1 as contact2Phone1, ' +
      'phone1, phone2, payment_term as paymentTerm, ' +
      'alert_for_cash_on_delivery as alertForCashOnDelivery, ' +
      'cash_on_delivery as cashOnDelivery, ' +
      'purchase_order_information as purchaseOrderInformation, ' +
      "coalesce(name1,'') as name1, " +
      "coalesce(name2,'') as name2, " +
      "coalesce(name3,'') as name3, " +
      "coalesce(address1,'') as address1, " +
      "coalesce(house_number,'') as houseNumber, " +
      "coalesce(postal_code,'') as postalCode, " +
      "coalesce(city,'') as city, last_call_datetime as lastCallDatetime, " +
      'last_order_datetime as lastOrderDatetime, ' +
      // 'call_type, ' +
      'price_group as priceGroup, industry_code as industryCode, ' +
      'abc_classification as abcClassification, trade_assets_volume as tradeAssetsVolume, ' +
      'trade_assets_amount as tradeAssetsAmount, delivery_overcost as deliveryOvercost, ' +
      'id_customer_classification_1 as idCustomerClassification1, ' +
      'id_customer_classification_2 as idCustomerClassification2, ' +
      'communication_language as communicationLanguage, update_datetime as updateDatetime, ' +
      'sort_code as sortCode, picking_text_1 as pickingText1, ' +
      'shipping_text_1 as shippingText1, shipping_text_2 as shippingText2, ' +
      'id_region as idRegion, id_call_center as idCallCenter, ' +
      'travelling_customer as travellingCustomer, region, ' +
      'blocked_for_order_taking as blockedForOrderTaking, sales_office as salesOffice, ' +
      'shipping_condition as shippingCondition, weight_limit as weightLimit, ' +
      'customers.customer_payer as customerPayer, ' +
      'customer_order_by as customerOrderBy, customer_bill_to as customerBillTo, ' +
      "coalesce(street1,'') as street1, " +
      "coalesce(street2,'') as street2, " +
      "coalesce(street3,'') as street3, " +
      'sales_group as salesGroup, customer_pricing_procedure as customerPricingProcedure, ' +
      'customer_informed_cash_payment as customerInformedCashPayment, contact1_phone_2 as contact1Phone2, ' +
      'contact2_phone_2 as contact2Phone2, contact1_description as contact1Description, ' +
      'contact2_description as contact2Description, last_visit_datetime as lastVisitDatetime, ' +
      'last_activity_datetime as lastActivityDatetime, customer_group_6 as customerGroup6, ' +
      // 'customers.blocked_reason, ' +
      'customer_group_1 as customerGroup1, id_territory as idTerritory, ' +
      // 'customer_group, ' +
      'country, ' +
      'last_order_employee_number as lastOrderEmployeeNumber, ' +
      'last_order_order_type as lastOrderOrderType, ' +
      'last_order_tess_order_sub_type as lastOrderTessOrderSubType, ' +
      'last_order_tess_order_reason as lastOrderTessOrderReason, ' +
      'last_order_total_amount as lastOrderTotalAmount, ' +
      'pricing_color as pricingColor, latitude, ' +
      'longitude, shipping_text_3 as shippingText3, ' +
      'shipping_text_4 as shippingText4, ' +
      // 'siret, ' +
      'name4, postal_box as postalBox, ' +
      'postal_code_box as postalCodeBox, ' +
      'city_box as cityBox, payment_method as paymentMethod, ' +
      'customer_group_5 as customerGroup5, customer_group_12 as customerGroup12, ' +
      'alert_long_time_no_order as alertLongTimeNoOrder, ' +
      'days_long_time_no_order as daysLongTimeNoOrder, ' +
      'bank_account_number_encrypted as bankAccountNumberEncrypted, ' +
      'bank_name_encrypted as bankNameEncrypted, ' +
      'contact1_mail_address as contact1MailAddress, ' +
      'contact2_mail_address as contact2MailAddress, ' +
      'fax, mail_address as mailAddress, ' +
      'customer_group_15 as customerGroup15, ' +
      'sales_representative as salesRepresentative, ' +
      'sales_manager as salesManager, key_account_manager as keyAccountManager, ' +
      'sales_responsible as salesResponsible, customer_price_group as customerPriceGroup,' +
      'customers_financial_information.vat_registration_number_encrypted as vatRegistrationNumber, ' +
      'remote, overdue ' +
      'from customers left join ' +
      'customers_financial_information on ' +
      'customers_financial_information.customer_ship_to = customers.customer_ship_to and ' +
      'customers_financial_information.sales_organization = customers.sales_organization and ' +
      'customers_financial_information.distribution_channel =customers.distribution_channel ' +
      'where customers.customer_ship_to=? ' +
      'and customers.sales_organization=? ' +
      'and customers.distribution_channel=? ' +
      "and active_in_tess ='1'";

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

  async getCustomerWholeSaleInfo() {
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

    let BASE_QUERY =
      'select case when customers.external_address <> "" then customers.street3 || " / " || customers.external_address ' +
      'else customers.street3 end as wholesaler from customers where  ' +
      `customers.customer_ship_to = "${customerShipTo}" and ` +
      `customers.sales_organization = "${salesOrganization}" and ` +
      `customers.distribution_channel = "${distributionChannel}" `;

    let results = await collection
      .query(Q.unsafeSqlQuery(BASE_QUERY))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /***
   * Function returns existing customer data
   *
   */
  async getExistingCustomerData(
    prevCustomerShipTo: string,
    salesOrganization?: string,
    distributionChannel?: string,
  ) {
    const collection = this.getCollection(ENTITY);

    let QUERY =
      "select c.industry_code as professionalCode, c.sales_organization || '-' || c.distribution_channel as salesAreaValue, " +
      'cic.description_language_1 as description, ' +
      'c.address1 as address, c.postal_code as zipCode, ' +
      'c.city as city, ch.customer_hier_l6 as customerHierL6, ' +
      "coalesce(ch.name_hier_l6,'') || coalesce(' ' || ch.customer_hier_l6,'') " +
      'as affiliationHierarchyNode, dlv.discovery_list_values_id as country, ' +
      'c.house_number as street, c.active_in_tess as activeInTess ' +
      'from customers c inner join customer_hierarchies_ship_to ch on ' +
      'c.customer_ship_to = ch.customer_ship_to left join ' +
      'discovery_list_values dlv on c.country=dlv.item_value ' +
      'left outer join customers_industry_codes cic on ' +
      `cic.industry_code = c.industry_code where c.customer_ship_to = '${prevCustomerShipTo}' `;

    if (salesOrganization && distributionChannel) {
      QUERY += `and c.sales_organization = '${salesOrganization}' and c.distribution_channel = '${distributionChannel}'`;
    }

    const results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /***
   * Function returns basic and contact details of customer
   *
   */
  async getBasicAndContactDetails(
    prevCustomerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    const collection = this.getCollection(ENTITY);

    const QUERY =
      'select c.name3, c.contact1_name as contact1Name, c.contact1_phone_1 as contact1Phone1, ' +
      'c.contact1_phone_2 as contact1Phone2, c.contact1_mail_address as contact1MailAddress, ' +
      'c.contact2_name as contact2Name, c.contact2_phone_1 as contact2Phone1, ' +
      'c.contact2_phone_2 as contact2Phone2, c.contact2_mail_address as contact2MailAddress, ' +
      'c.payment_method as paymentMethod, c.payment_term as paymentTerms, ' +
      'cai.expected_turnover_1 as expectedTurnover1, cai.expected_turnover_2 as expectedTurnover2, ' +
      'cai.expected_turnover_3 as expectedTurnover3, cai.expected_turnover_4 as expectedTurnover4, ' +
      'c.abc_classification as abcClassification, c.street1, c.street2, c.street3, ' +
      'c.postal_box as postalBox, c.postal_code_box as postalCodeBox, c.city_box as cityBox ' +
      'from customers c left join discovery_list_values dlv on c.country = dlv.item_value left outer ' +
      'join customers_industry_codes cic on cic.industry_code = c.industry_code ' +
      'left join customers_additional_information cai on c.customer_ship_to = ' +
      'cai.customer_hierarchy_node and c.sales_organization=cai.sales_organization ' +
      'and c.distribution_channel = cai.distribution_channel where c.customer_ship_to = ? ' +
      'and c.sales_organization = ? and c.distribution_channel = ?';

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

  /***
   * Function returns customer information based on discoveryId for overview screen
   *
   */
  async getCustomerDetailsExpectedTurnoverAndEmployeeDetails() {
    try {
      const collection = this.getCollection(ENTITY);
      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const QUERY =
        "select case when customers.industry_code <> '' " +
        'or customers.industry_code <> null then customers.industry_code ' +
        "|| ' - ' || cic.description_language_1 else '' end as industryCode, " +
        "name_hier_l6 || ' - ' || customer_hier_l6 as customerHierarchy, " +
        "coalesce (e.first_name, '') || ' ' || coalesce(e.last_name, '') as fsr, " +
        'dai.expected_turnover_1 as ice, dai.expected_turnover_2 as frozenBakery, ' +
        'dai.expected_turnover_3 as frozenFood, dai.expected_turnover_1 + ' +
        'expected_turnover_2 + expected_turnover_3 as total, ' +
        "coalesce (employees1.first_name, '') || ' ' || coalesce(employees1.last_name, '') as createdBy, " +
        "strftime('%d-%m-%Y', discovery.create_date) as createdDate, " +
        "coalesce (employees2.first_name, '') || ' ' || coalesce(employees2.last_name, '') as updatedBy, " +
        "strftime('%d-%m-%Y', discovery.prospection_data_update_time) as updatedDate, " +
        'discovery.prospect_number as prospectNumber, discovery.external_prospect_number as externalProspectNumber, ' +
        'discovery.customer_ship_to as customerShipTo, prospects.previous_customer_ship_to as previousCustomerShipTo ' +
        'from customers inner join customer_hierarchies_ship_to on customer_hierarchies_ship_to.customer_ship_to ' +
        '= customers.customer_ship_to and customer_hierarchies_ship_to.sales_organization = customers.sales_organization ' +
        'and customer_hierarchies_ship_to.distribution_channel = customers.distribution_channel ' +
        'left outer join customers_industry_codes cic on customers.industry_code = cic.industry_code ' +
        'left join discovery on discovery.customer_ship_to = customers.customer_ship_to ' +
        'left join prospects on discovery.discovery_id = prospects.discovery_id ' +
        'and prospects.sales_organization = customers.sales_organization ' +
        'and prospects.distribution_channel = customers.distribution_channel ' +
        'left join employees e on prospects.employee_number = e.employee_number ' +
        'left join employees as employees2 on discovery.prospection_data_update_employee_number = employees2.employee_number ' +
        'left join employees as employees1 on discovery.created_by = employees1.employee_number ' +
        'left join customers_additional_information as dai on (discovery.customer_ship_to = dai.customer_hierarchy_node ' +
        'and prospects.distribution_channel = dai.distribution_channel and prospects.sales_organization = dai.sales_organization) ' +
        'where discovery.discovery_id = ?';

      const QUERY_VALUES = [discoveryId];
      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log(
        'getCustomerDetailsExpectedTurnoverAndEmployeeDetails error :>> ',
        error,
      );
      return [];
    }
  }

  /**
   * Prepoluate Customer Basic info - ShipTo data in PLP screen
   */
  async getPLPCustomerShipToData() {
    const prospectData = await this.getPLProspectInfo();
    const customerShipTo = prospectData?.customerShipTo
      ? prospectData.customerShipTo
      : '';
    const salesOrganization = prospectData?.salesOrganization
      ? prospectData.salesOrganization
      : '';
    const distributionChannel = prospectData?.distributionChannel
      ? prospectData.distributionChannel
      : '';
    const collection = this.getCollection(ENTITY);
    const QUERY =
      'select customers.industry_code as outlet, ' +
      'cic.description_language_1 as description, ' +
      'name_hier_l6 || " - " || customer_hier_l6 as customerHierarchy, ' +
      'customers.name1, customers.name2, customers.name3, customers.name4, ' +
      'customers.house_number as houseNumber, customers.address1, customers.street1 as address2, ' +
      'customers.street2 as address3, customers.street3 as coOrStreet3, customers.postal_code as zipCode, ' +
      'customers.city, customers.postal_box as poBox, customers.country, ' +
      'customers.mail_address as email, customers.phone2 as mobileNumber, ' +
      'customers.phone1 as phoneNumber, customers.fax, discovery.web_site as website, ' +
      'coalesce(customers.latitude,0) as latitude, ' +
      'coalesce(customers.longitude,0) as longitude, ' +
      'prospects.shop_number_or_filial_number as shopNumber, ' +
      'prospects.kanton, prospects.channel_type as distributionChannel, ' +
      'customers.communication_language as language, ' +
      'prospects.previous_customer_ship_to as previousCustomerShipTo ' +
      'from customers ' +
      'inner join customer_hierarchies_ship_to ' +
      'on customer_hierarchies_ship_to.customer_ship_to = customers.customer_ship_to ' +
      'and customer_hierarchies_ship_to.sales_organization = customers.sales_organization ' +
      'and customer_hierarchies_ship_to.distribution_channel = customers.distribution_channel ' +
      'left join discovery ' +
      'on discovery.customer_ship_to = customers.customer_ship_to ' +
      'left join prospects ' +
      'on discovery.discovery_id = prospects.discovery_id ' +
      'and prospects.sales_organization = customers.sales_organization ' +
      'and prospects.distribution_channel = customers.distribution_channel ' +
      'left outer join customers_industry_codes cic on ' +
      `cic.industry_code = customers.industry_code ` +
      `where customers.customer_ship_to = '${customerShipTo}' ` +
      `and customers.sales_organization = '${salesOrganization}' ` +
      `and customers.distribution_channel = '${distributionChannel}' `;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }

  /**
   * Prepoluate Customer Attribute info
   */
  async getPLPCustomerAttibuteInfoData() {
    const prospectData = await this.getPLProspectInfo();
    const discoveryId = prospectData?.discoveryId
      ? prospectData.discoveryId
      : '';
    console.log('discoveryId', discoveryId);
    const collection = this.getCollection(ENTITY);
    const QUERY =
      'select customers.abc_classification as abcClassification, ' +
      'discovery_customer_attributes.priority, ' +
      'cai.start_customer_business_datetime as startCustomerBusinessDatetime, ' +
      'cai.id_customer_business_reason_start as idCustomerBusinessReasonStart, ' +
      'discovery_customer_attributes.canvasser_employee_number as canvasserEmployeeNumber, ' +
      "case when customers.street3 <> '' and customers.street3 <> customers.customer_ship_to then 1 else 0 end as indirectCustomer, " +
      "case when customers.street3 <> '' and customers.street3 <> customers.customer_ship_to then customers.street3 else '' end as wholesalerCustomerNumber, " +
      'discovery_customer_attributes.id_distributors as idDistributors,  ' +
      'discovery_customer_attributes.scooping,  ' +
      'discovery_customer_attributes.key_account_gln_code as keyAccountGlnCode,  ' +
      'discovery_customer_attributes.owner_deputy_first_name as ownerDeputyFirstName,  ' +
      'discovery_customer_attributes.owner_deputy_last_name as ownerDeputyLastName ' +
      'from customers ' +
      'inner join discovery ' +
      'on customers.customer_ship_to = discovery.customer_ship_to ' +
      'inner join prospects ' +
      'on discovery.discovery_id = prospects.discovery_id ' +
      'and prospects.sales_organization = customers.sales_organization ' +
      'and prospects.distribution_channel = customers.distribution_channel ' +
      "and prospects.delete_prospect <> '1'  " +
      'left join customers_additional_information cai ' +
      'on  customers.customer_ship_to = cai.customer_hierarchy_node  ' +
      'and  customers.sales_organization=cai.sales_organization  ' +
      'and customers.distribution_channel =cai.distribution_channel ' +
      'left join discovery_customer_attributes ' +
      'on discovery.discovery_id = discovery_customer_attributes.discovery_id ' +
      `where discovery.discovery_id = '${discoveryId}' `;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }

  /**
   * PLP -> SEPA Customer Available info
   */
  async getPLPSepaCustomerAgreementAvailableInfo() {
    const prospectData = await this.getPLProspectInfo();
    const discoveryId = prospectData?.discoveryId
      ? prospectData.discoveryId
      : '';
    console.log('discoveryId', discoveryId);
    const collection = this.getCollection(ENTITY);
    const QUERY =
      'select ds.signature_customer as customerSignature, ds.mandate_reference_number as mandateReferenceNumber, ' +
      'ds.sepa_agreement_number as agreementNumber, c.customer_ship_to as customerNo, ' +
      "COALESCE (ds.account_holder_name, '') as nameOfAccountHolder, " +
      'c.name1,c.name2,c.name3, c.house_number as houseNumber, c.address1 as street, c.city, c.postal_code as postalCode, c.customer_ship_to as generateAgreementNo, ' +
      "ds.bank_name as bankName, case COALESCE(ds.bic,'') " +
      "when '' then cbi.iban_encrypted else ds.bic end as bic, " +
      "case COALESCE(ds.iban,'') when '' then cbi.iban_bic_encrypted " +
      "else ds.iban end as ibanNumber, case when ds.sepa_signed_datetime is null then '' " +
      'else ds.sepa_signed_datetime end as signedDate, ' +
      "case when ds.sepa_status = '0' then 'Open' " +
      "when ds.sepa_status = '1' then 'Signed without Finalization' " +
      "when ds.sepa_status is null then 'Open' " +
      "else 'Signed With Finalize' end as status, ds.sepa_status as sepaStatus, " +
      "COALESCE(ds.form_type, '1') as agreementType " +
      'from customers c ' +
      'inner join discovery d  on c.customer_ship_to = d.customer_ship_to ' +
      'left join discovery_sepa ds  on d.discovery_id = ds.discovery_id ' +
      'left join customers_banks_information cbi  on c.customer_ship_to=cbi.customer_ship_to ' +
      'and c.sales_organization = cbi.sales_organization and c.distribution_channel = cbi.distribution_channel ' +
      `where d.discovery_id = '${discoveryId}' `;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }

  /**
   * PLP -> SEPA Customer Not Available info
   */
  async getPLPSepaCustomerAgreementNotAvailableInfo() {
    try {
      const prospectData = await this.getPLProspectInfo();
      const collection = this.getCollection(ENTITY);
      const customerNumber = prospectData?.customerShipTo
        ? prospectData.customerShipTo
        : '';
      const QUERY =
        'SELECT name1, name2, name3, house_number as houseNumber, address1 as street, city, postal_code as postalCode, ' +
        "'Open' AS status, '0' as sepaStatus, '1' as agreementType, customer_ship_to as customerNo, customer_ship_to as generateAgreementNo " +
        `FROM Customers WHERE Customer_Ship_To = '${customerNumber}'`;

      let results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      return results;
    } catch (e) {
      console.log('getPLPSepaCustomerAgreementNotAvailableInfo error >> ', e);
      return [];
    }
  }

  async getCustomerTerritoryInfo() {
    try {
      const collection = this.getCollection(DISCOVERY_ENTITY);
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
        "select emp1.first_name || ' ' || emp1.last_name as 'salesRepresentative', " +
        "emp2.first_name || ' ' || emp2.last_name as 'salesManager', " +
        "emp3.first_name || ' ' || emp3.last_name as 'keyAccountManager', " +
        "emp4.first_name || ' ' || emp4.last_name as 'salesResponsible' " +
        'from customers c left join sales_representatives emp1 on ' +
        'c.sales_representative = emp1.employee_number ' +
        "and c.sales_representative <> '' " +
        'left join employees emp2 on c.sales_manager = emp2.employee_number ' +
        "and c.sales_manager <> '' " +
        'left join employees emp3 on c.key_account_manager = emp3.employee_number ' +
        "and c.key_account_manager <> '' " +
        'left join sales_representatives emp4 on c.sales_responsible = emp4.employee_number ' +
        "and c.sales_responsible <> '' " +
        'where c.customer_ship_to = ? ' +
        'and c.sales_organization = ? ' +
        'and c.distribution_channel = ? ';

      const QUERY_VALUES = [
        customerShipTo,
        salesOrganization,
        distributionChannel,
      ];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();
      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getCustomerTerritoryInfo error :>> ', error);
      return [];
    }
  }

  /**
   * PLP -> Trade asset charge off preview
   */
  async getTradeAssetChargeOffData(agreementNumber: string) {
    try {
      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const collection = this.getCollection(ENTITY);
      const QUERY =
        'SELECT DISTINCT Discovery_Trade_Assets.TA_Loan_Agreement_Number AS agreementNumber, discovery_trade_assets_charge_off.id, ' +
        "COALESCE(customers.Customer_Ship_To, '') AS customerNumber, " +
        "COALESCE(customers.Name1, '') AS name1, " +
        "COALESCE(customers.Name2, '') AS name2, " +
        "COALESCE(customers.Name3, '') AS name3, " +
        "COALESCE(customers.Address1, '') AS street1, " +
        "COALESCE(customers.Name4, '') AS addressStreet2, " +
        "COALESCE(Discovery_Financial_Data.Tax_Payer_Account_Number, '') AS taxNumber, " +
        'customers.Postal_Code AS postalCode, ' +
        'customers.City AS city, ' +
        'customers.House_Number AS houseNumber, ' +
        "COALESCE(customers.Delivery_Fee, '') AS deliveryFee, " +
        "COALESCE(Materials.Description_Language_1, '') AS description, " +
        "COALESCE(Discovery_Trade_Assets_Charge_Off.Material_Number, '') AS materialNumber, " +
        "COALESCE(Serial_Number, '') AS serialNumber, " +
        "COALESCE(Discovery_Trade_Assets_Charge_Off.Residual_Value, '') AS residualValue, " +
        'Discovery_Trade_Assets_Charge_Off.Const_date AS installationDate, ' +
        "COALESCE(Discovery_Trade_Assets.Justification, '') AS justification, " +
        'discovery_trade_assets_charge_off.ta_charge_off_status AS taChargeOff ' +
        'FROM Customers ' +
        'INNER JOIN Discovery ON Customers.Customer_Ship_To = Discovery.Customer_Ship_To ' +
        'INNER JOIN Prospects ON (Discovery.Discovery_Id = Prospects.Discovery_Id ' +
        'AND Customers.Sales_Organization = Prospects.Sales_Organization ' +
        'AND Customers.Distribution_Channel = Prospects.Distribution_Channel) ' +
        'LEFT JOIN Discovery_Financial_Data ON Discovery_Financial_Data.Discovery_Id = Discovery.Discovery_Id ' +
        'LEFT JOIN Discovery_Trade_Assets_Charge_Off ON Discovery.Discovery_Id = Discovery_Trade_Assets_Charge_Off.Discovery_Id ' +
        'LEFT JOIN Materials ON Materials.Material_Number = ' +
        "substr('000000000000000000' || Discovery_Trade_Assets_Charge_Off.Material_Number, " +
        'length(Discovery_Trade_Assets_Charge_Off.material_number) + 1, 18) ' +
        'AND Materials.Sales_Organization = Customers.Sales_Organization ' +
        'AND Materials.Distribution_Channel = Customers.Distribution_Channel ' +
        'LEFT JOIN Discovery_Trade_Assets ON Discovery_Trade_Assets.Discovery_Id = Discovery_Trade_Assets_Charge_Off.Discovery_Id  ' +
        'AND Discovery_Trade_Assets.TA_Loan_Agreement_Number = Discovery_Trade_Assets_Charge_Off.TA_LOAN_Agreement_Number ' +
        `WHERE Discovery.Discovery_Id = '${discoveryId}' ` +
        `AND Discovery_Trade_Assets_Charge_Off.TA_Loan_Agreement_Number = '${agreementNumber}' ` +
        " AND Discovery_Trade_Assets_Charge_Off.TA_Charge_Off_status ='1' ";

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getTradeAssetChargeOffData error :>> ', error);
      return [];
    }
  }

  /**
   * PLP -> Trade asset request customer preview data
   */
  async getTaRequestCustomerPreviewData() {
    try {
      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const collection = this.getCollection(ENTITY);
      const QUERY =
        'SELECT DISTINCT customers.Customer_Ship_To AS customerNumber, ' +
        "COALESCE(customers.Name1, '') AS name1, " +
        "COALESCE(customers.Name2, '') AS name2, " +
        "COALESCE(customers.Name3, '') AS name3, " +
        "COALESCE(customers.Address1, '') AS street1, " +
        "COALESCE(customers.Name4, '') AS addressStreet2, " +
        'customers.Postal_Code AS postalCode, ' +
        'customers.City AS city, ' +
        'customers.House_Number AS houseNumber, ' +
        "COALESCE(customers.Delivery_Fee, '') AS deliveryFee " +
        'FROM Customers ' +
        'INNER JOIN Discovery ON Customers.Customer_Ship_To = Discovery.Customer_Ship_To ' +
        'INNER JOIN Prospects ON (Discovery.Discovery_Id = Prospects.Discovery_Id ' +
        'AND Customers.Sales_Organization = Prospects.Sales_Organization ' +
        'AND Customers.Distribution_Channel = Prospects.Distribution_Channel) ' +
        'LEFT JOIN Discovery_Financial_Data ON Discovery_Financial_Data.Discovery_Id = Discovery.Discovery_Id ' +
        `WHERE Discovery.Discovery_Id = '${discoveryId}' `;

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getTaRequestCustomerPreviewData error :>> ', error);
      return [];
    }
  }

  /**
   * SWF -> Remote customer check
   */
  async checkIsRemoteCustomer(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    try {
      const collection = this.getCollection(DISCOVERY_ENTITY);

      const QUERY =
        'select customer_ship_to from customers where customer_ship_to = ? and sales_organization = ? and distribution_channel = ?';

      const QUERY_VALUES = [
        customerShipTo,
        salesOrganization,
        distributionChannel,
      ];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log('checkIsRemoteCustomer error :>> ', error);
      return true;
    }
  }

  /**
   * TA -> Fetch customer info
   */
  async fetchCustomerInfo(customerShipTo: string) {
    try {
      const collection = this.getCollection(DISCOVERY_ENTITY);

      const QUERY =
        'select customer_ship_to as customerShipTo, sales_organization as salesOrganization, distribution_channel as distributionChannel ' +
        `from customers where customer_ship_to like '%${customerShipTo}%'`;

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('fetchCustomerInfo error :>> ', error);
      return [];
    }
  }

  /**
   * TA -> Fetch customer info
   */
  async fetchCustomerDetail(
    customerShipTo: string,
    salesOrganisation: string,
    distributionChannel: string,
  ) {
    try {
      const collection = this.getCollection(DISCOVERY_ENTITY);

      const QUERY = `select  
        customer_ship_to as customerNumber, 
        sales_organization || ' ' || distribution_channel  as salesArea, 
        name1, 
        name2, 
        name3, 
        street1, 
        street2, 
        street3, 
        address1, 
        postal_code , 
        phone1 as phone, 
        fax, 
        mail_address as email, 
        picking_plant_number as rdc, 
        delivering_plant_number as tsp 
        from customers 
        where customer_ship_to ='${customerShipTo}' 
        and sales_organization ='${salesOrganisation}' 
        and distribution_channel ='${distributionChannel}'`;

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('fetchCustomerInfo error :>> ', error);
      return [];
    }
  }

  /**
   * TA -> Fetch communication language and country code of customer
   */
  async fetchLanguageAndCountryCodeOfCustomer(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    try {
      const collection = this.getCollection(DISCOVERY_ENTITY);

      const QUERY = `select communication_language as language, country from customers 
        where customer_ship_to ='${customerShipTo}' 
        and sales_organization ='${salesOrganization}' 
        and distribution_channel ='${distributionChannel}'`;

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('fetchLanguageAndCountryCodeOfCustomer error :>> ', error);
      return [];
    }
  }
}
