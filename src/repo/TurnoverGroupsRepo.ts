import BaseRepo from './BaseRepo';
import TurnoverGroups from 'src/storage/OfflineDBStorage/WmDB/models/TurnoverGroups';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import {ParametersValuesService} from 'src/services/ParametersValuesService';
import {TURNOVER_GROUPS} from 'src/utils/DbConst';
import {TextsService} from 'src/services/TextsService';

const ENTITY = OFFLINE_STORAGE.MODEL.TURNOVER_GROUPS;

export class TurnoverGroupsRepo extends BaseRepo<TurnoverGroups> {
  /**
   * Function returns Product Group
   * @returns
   */
  async getProductGroup() {
    const TurnoverGroupsCollection = this.getCollection(ENTITY);

    let results = await TurnoverGroupsCollection.query(
      Q.unsafeSqlQuery(
        'SELECT ID_Turnover_Group as idTurnoverGroup, ' +
          'Description_Language_1 As descriptionLanguage, ' +
          'Reporting_Turnover_Type as reportingTurnoverType ' +
          'FROM Turnover_Groups ',
      ),
    ).unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns Turnover Details
   * @returns
   */
  async getTurnoverDetails(customerShipTo: string) {
    const TurnoverGroupsCollection = this.getCollection(ENTITY);
    const parametersValuesService = new ParametersValuesService();
    const parameterValue = await parametersValuesService.getParameterValue(
      'Turnover_Information_In_Customer_Export_From_Tess_Mobile',
    );

    let additionalCondition =
      parameterValue === '2'
        ? `and tg.reporting_turnover_type = "${TURNOVER_GROUPS.ICE_CREAM}" `
        : '';

    const QUERY =
      "select coalesce(round(sum(case when type = 'A' then turnover_value " +
      'end), 0), 0) as ytdCY,' +
      "coalesce(round(sum(case when type = 'B' then turnover_value " +
      'end), 0), 0) as ytdLY,' +
      "coalesce(round(sum(case when type = 'C' then turnover_value " +
      'end), 0), 0) as totalLY, ' +
      "round(coalesce(sum(case when type = 'A' then turnover_value " +
      "end) - sum(case when type = 'B' then turnover_value " +
      'end), 0), 0) as growthCHF, ' +
      "round(coalesce(sum(case when type = 'A' then turnover_value " +
      "end) - sum(case when type = 'B' then turnover_value " +
      "end), 0) / coalesce(sum(case when type = 'B' then turnover_value " +
      'end), 2) * 100 ) as growthPercentage from ' +
      "(select coalesce(ta.type, '') as type," +
      "coalesce(ta.turnover_value, '0') as turnover_value," +
      'tg.id_turnover_group ' +
      'from turnover_groups tg ' +
      'left join turnover_groups_material_hierarchies tgmh on tg.id_turnover_group = tgmh.id_turnover_group ' +
      'left join material_hierarchy on tgmh.material_hierarchy_node = material_hierarchy.material_hierarchy_node ' +
      'left join turnover_aggregated ta on tg.id_turnover_group = ta.id_turnover_group ' +
      'and tgmh.material_hierarchy_node = ta.material_hierarchy_node ' +
      "and ta.customer_ship_to = ? and type <> 'G' " +
      additionalCondition +
      ') as result';

    // For testing
    // const VALUES = ['0020335268'];
    const VALUES = [customerShipTo];

    let results = await TurnoverGroupsCollection.query(
      Q.unsafeSqlQuery(QUERY, VALUES),
    ).unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * get Trade Assets Profitability
   */
  async getTradeAssetsProfitability() {
    const collection = this.getCollection(ENTITY);
    const customerInfo: any = await this.getCLCustomerInfo();
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';

    const QUERY =
      'select distinct output.customer_ship_to as customerShipTo, ' +
      'cast(max(case when output.col = "customer_turnover_12months" then output.val end) as decimal(16,2)) as turnoverOfLast12Months, ' +
      'max(case when output.col = "target_turnover" then output.val end) as targetTurnover, ' +
      'cast(case when ifnull(max(case when output.col = "customer_turnover_12months" then output.val end),0) = 0 then 0 ' +
      'else case when ifnull(max(case when output.col = "target_turnover" then output.val end),0) = 0 then 0 ' +
      'else cast((max(case when output.col = "customer_turnover_12months" then output.val end) / max(case when output.col = "target_turnover" then output.val end) * 100) as decimal(16,2)) end end as char) + "%" as profitability, ' +
      'cai.start_customer_business_datetime as businessStartDate, ' +
      'max(case when output.col = "expected_turnover_ice" then output.val end) as expectedTurnoverIceCream, ' +
      'customers.trade_assets_amount as numberOfTradeAssets ' +
      'from (select customer_ship_to, turnover as col, turnover_value as val ' +
      'from (select distinct ta.customer_ship_to, "customer_turnover_12months" as turnover, ' +
      'sum(ifnull(ta.turnover_value, 0)) as turnover_value, ' +
      'customers.trade_assets_amount ' +
      'from turnover_groups tg  ' +
      'inner join turnover_groups_material_hierarchies tgmh  ' +
      'on tg.id_turnover_group = tgmh.id_turnover_group ' +
      'left join material_hierarchy  ' +
      'on tgmh.material_hierarchy_node = material_hierarchy.material_hierarchy_node  ' +
      'left join turnover_aggregated ta  ' +
      'on tg.id_turnover_group = ta.id_turnover_group and tgmh.material_hierarchy_node = ta.material_hierarchy_node  ' +
      'inner join  customers  ' +
      'on customers.customer_ship_to = ta.customer_ship_to  ' +
      'where ta.customer_ship_to is not null ' +
      'and  customers.active_in_tess = "1"  and tg.reporting_turnover_type = "1" ' +
      'and  ta.type = "g" ' +
      'group by ta.customer_ship_to, customers.trade_assets_amount, customers.trade_assets_amount ' +
      'union ' +
      'select distinct trade_assets_customers.customer_ship_to, "target_turnover" as turnover, ' +
      'ifnull(sum(trade_assets_minimum_turnover.minimum_turnover),0) as minimum_turnover, ' +
      'customers.trade_assets_amount from trade_assets_customers  ' +
      'inner join customers ' +
      'on trade_assets_customers.customer_ship_to = customers.customer_ship_to ' +
      'and trade_assets_customers.sales_organization = customers.sales_organization ' +
      'and trade_assets_customers.distribution_channel = customers.distribution_channel  ' +
      'left join trade_assets_minimum_turnover ' +
      'on trade_assets_customers.material_number = trade_assets_minimum_turnover.material_number ' +
      'group by trade_assets_customers.customer_ship_to, customers.trade_assets_amount ' +
      'union  ' +
      'select distinct customers.customer_ship_to, "expected_turnover_ice" as turnover, ' +
      'ifnull(sum(ifnull(discovery_new_trade_assets_wished.expected_turnover,0) + ifnull(discovery_previous_owner_trade_assets.expected_turnover,0)),0) as expected_turnover, ' +
      'customers.trade_assets_amount from customers ' +
      'left join  discovery ' +
      'on customers.customer_ship_to = discovery.customer_ship_to ' +
      'left join  prospects ' +
      'on discovery.discovery_id = prospects.discovery_id ' +
      'and customers.sales_organization = prospects.sales_organization ' +
      'and  customers.distribution_channel = prospects.distribution_channel ' +
      'left join  discovery_trade_assets ' +
      'on  discovery.discovery_id = discovery_trade_assets.discovery_id ' +
      'and  discovery_trade_assets.deleted <> "1" ' +
      'left join  discovery_new_trade_assets_wished ' +
      'on  discovery.discovery_id = discovery_new_trade_assets_wished.discovery_id ' +
      'and  discovery_new_trade_assets_wished.ta_loan_agreement_number = discovery_trade_assets.ta_loan_agreement_number ' +
      'left join  discovery_previous_owner_trade_assets ' +
      'on  discovery.discovery_id = discovery_previous_owner_trade_assets.discovery_id ' +
      'and  discovery_previous_owner_trade_assets.ta_loan_agreement_number = discovery_trade_assets.ta_loan_agreement_number ' +
      'group by   customers.customer_ship_to,   customers.trade_assets_amount ) t ) output ' +
      'inner join customers  on customers.customer_ship_to = output.customer_ship_to ' +
      'left join   customers_additional_information cai ' +
      'on  output.customer_ship_to  = cai.customer_hierarchy_node  ' +
      `where  output.customer_ship_to = '${customerShipTo}' ` +
      'group by output.customer_ship_to, customers.trade_assets_amount, cai.start_customer_business_datetime';

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }

  /**
   * get Trade Assets All Turnover Details
   */
  async getAllTurnoverDetails() {
    const TurnoverGroupsCollection = this.getCollection(ENTITY);

    const customerInfo: any = await this.getCLCustomerInfo();
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';

    const parametersValuesService = new ParametersValuesService();
    const turnoverDisplayingType =
      await parametersValuesService.getParameterValue(
        'Turnover_Displaying_Type',
      );
    const turnoverInformationInCustomerExportFromTessMobile =
      await parametersValuesService.getParameterValue(
        'Turnover_Information_In_Customer_Export_From_Tess_Mobile',
      );

    let additionalCondition;

    if (turnoverDisplayingType === '' || turnoverDisplayingType === '1') {
      additionalCondition =
        "coalesce(TA.Turnover_Value, '0') AS Turnover_Value,";
    } else if (turnoverDisplayingType === '2') {
      additionalCondition = "coalesce(TA.NPS_Value, '0') AS Turnover_Value,";
    } else if (turnoverDisplayingType === '3') {
      additionalCondition = "coalesce(TA.GPS_Value, '0') AS Turnover_Value,";
    } else {
      additionalCondition = '';
    }

    let additionalCondition2 =
      turnoverInformationInCustomerExportFromTessMobile === '2'
        ? `where tg.Reporting_Turnover_Type = '${TURNOVER_GROUPS.ICE_CREAM}' `
        : '';

    let additionalCondition3;

    if (turnoverDisplayingType === '' || turnoverDisplayingType === '1') {
      additionalCondition3 =
        'coalesce(TA.Turnover_VAlue - TA.Indirect_Turnover_Value,0) As Direct_Turnover_Value,';
    } else if (turnoverDisplayingType === '2') {
      additionalCondition3 =
        'coalesce(TA.NPS_Value - TA.Indirect_NPS_Value,0) As Direct_Turnover_Value,';
    } else if (turnoverDisplayingType === '3') {
      additionalCondition3 =
        'coalesce(TA.GPS_Value - TA.Indirect_GPS_Value,0) As Direct_Turnover_Value,';
    } else {
      additionalCondition3 = '';
    }

    let additionalCondition4;

    if (turnoverDisplayingType === '' || turnoverDisplayingType === '1') {
      additionalCondition4 =
        "coalesce(TA.Turnover_Value, '0') AS Indirect_Turnover_Value,";
    } else if (turnoverDisplayingType === '2') {
      additionalCondition4 =
        "coalesce(TA.NPS_Value, '0') AS Indirect_Turnover_Value,";
    } else if (turnoverDisplayingType === '3') {
      additionalCondition4 =
        "coalesce(TA.GPS_Value, '0') AS Indirect_Turnover_Value,";
    } else {
      additionalCondition4 = '';
    }

    console.log('additionalCondition :>> ', additionalCondition);
    console.log('additionalCondition2 :>> ', additionalCondition2);
    console.log('additionalCondition3 :>> ', additionalCondition3);
    console.log('additionalCondition4 :>> ', additionalCondition4);

    const QUERY =
      'SELECT typeTurnover, ' +
      'iDTurnoverGroup, ' +
      'descriptionLanguage, ' +
      'description, ' +
      'materialHierarchyNode, ' +
      "coalesce(ROUND(MAX(CASE WHEN TYPE = 'A' THEN Turnover_Value END), 0), 0) AS ytdCY, " +
      "coalesce(ROUND(MAX(CASE WHEN TYPE = 'B' THEN Turnover_Value END), 0), 0) AS ytdLY, " +
      "coalesce(ROUND(MAX(CASE WHEN TYPE = 'C' THEN Turnover_Value END), 0), 0) AS totalLY, " +
      "coalesce(ROUND(MAX(CASE WHEN TYPE = 'H' THEN Turnover_Value END), 0), 0) AS totalYearBeforePreviousYear, " +
      "ROUND(coalesce(MAX(CASE WHEN TYPE = 'A' THEN Turnover_Value END) - MAX(CASE WHEN TYPE = 'B' THEN Turnover_Value END), 0), 0) AS growthCHF, " +
      "CASE WHEN coalesce(MAX(CASE WHEN TYPE = 'B' THEN Turnover_Value END),0) = 0 THEN 0 ELSE " +
      "ROUND(coalesce(MAX(CASE WHEN TYPE = 'A' THEN Turnover_Value END) - MAX(CASE WHEN TYPE = 'B' THEN Turnover_Value END), 0) / MAX(CASE WHEN TYPE = 'B' THEN Turnover_Value END) * 100, 2) END AS growthPercentage " +
      'FROM (SELECT TG.ID_Turnover_Group as iDTurnoverGroup, ' +
      'TG.Description_Language_1 AS descriptionLanguage, ' +
      `coalesce(Material_Hierarchy.Description_Language_1, '') AS description, ` +
      'TGMH.Material_Hierarchy_Node as materialHierarchyNode, ' +
      "coalesce(TA.Type,'') As Type, " +
      `${additionalCondition}` +
      "'Total_Turnover' As typeTurnover " +
      'FROM turnover_groups TG ' +
      'LEFT JOIN Turnover_Groups_Material_Hierarchies TGMH ON TG.ID_Turnover_Group = TGMH.ID_Turnover_Group ' +
      'LEFT JOIN Material_Hierarchy ON TGMH.Material_Hierarchy_Node = Material_Hierarchy.Material_Hierarchy_Node ' +
      'LEFT JOIN Turnover_Aggregated TA ON tg.ID_Turnover_Group = TA.ID_Turnover_Group ' +
      'AND TGMH.Material_Hierarchy_Node = TA.Material_Hierarchy_Node ' +
      `AND TA.customer_Ship_to = '${customerShipTo}' ` +
      "AND Type <> 'G' " +
      `${additionalCondition2}` +
      ') As result ' +
      'GROUP BY result.typeTurnover, ' +
      'result.iDTurnoverGroup, ' +
      'result.descriptionLanguage, ' +
      'result.description, ' +
      'result.materialHierarchyNode ' +
      'UNION ' +
      'SELECT typeTurnover, ' +
      'iDTurnoverGroup, ' +
      'descriptionLanguage, ' +
      'description, ' +
      'materialHierarchyNode, ' +
      "coalesce(ROUND(MAX(CASE WHEN TYPE = 'A' THEN Direct_Turnover_Value END), 0), 0) AS ytdCY, " +
      "coalesce(ROUND(MAX(CASE WHEN TYPE = 'B' THEN Direct_Turnover_Value END), 0), 0) AS ytdLY, " +
      "coalesce(ROUND(MAX(CASE WHEN TYPE = 'C' THEN Direct_Turnover_Value END), 0), 0) AS totalLY, " +
      "coalesce(ROUND(MAX(CASE WHEN TYPE = 'H' THEN Direct_Turnover_Value END), 0), 0) AS totalYearBeforePreviousYear, " +
      "ROUND(coalesce(MAX(CASE WHEN TYPE = 'A' THEN Direct_Turnover_Value END) - MAX(CASE WHEN TYPE = 'B' THEN Direct_Turnover_Value END), 0), 0) AS growthCHF, " +
      "CASE WHEN coalesce(MAX(CASE WHEN TYPE = 'B' THEN Direct_Turnover_Value END),0) = 0 THEN 0 ELSE " +
      "ROUND(coalesce(MAX(CASE WHEN TYPE = 'A' THEN Direct_Turnover_Value END) - MAX(CASE WHEN TYPE = 'B' THEN Direct_Turnover_Value END), 0) / MAX(CASE WHEN TYPE = 'B' THEN Direct_Turnover_Value END) * 100, 2) END AS growthPercentage " +
      'FROM (SELECT TG.ID_Turnover_Group as iDTurnoverGroup, ' +
      'TG.Description_Language_1 AS descriptionLanguage, ' +
      `coalesce(Material_Hierarchy.Description_Language_1, '') AS description, ` +
      'TGMH.Material_Hierarchy_Node as materialHierarchyNode, ' +
      "coalesce(TA.Type,'') As Type, " +
      `${additionalCondition3} ` +
      "'Direct_Turnover' As typeTurnover " +
      'FROM turnover_groups TG ' +
      'LEFT JOIN Turnover_Groups_Material_Hierarchies TGMH ON TG.ID_Turnover_Group = TGMH.ID_Turnover_Group ' +
      'LEFT  JOIN Material_Hierarchy ON TGMH.Material_Hierarchy_Node = Material_Hierarchy.Material_Hierarchy_Node ' +
      'LEFT JOIN Turnover_Aggregated TA ON tg.ID_Turnover_Group = TA.ID_Turnover_Group ' +
      'AND TGMH.Material_Hierarchy_Node = TA.Material_Hierarchy_Node ' +
      `AND TA.customer_Ship_to = '${customerShipTo}' ` +
      "AND Type <> 'G' " +
      `${additionalCondition2}` +
      ') As result ' +
      'GROUP BY result.typeTurnover, ' +
      'result.iDTurnoverGroup, ' +
      'result.descriptionLanguage, ' +
      'result.description, ' +
      'result.materialHierarchyNode ' +
      'UNION ' +
      'SELECT typeTurnover, ' +
      'iDTurnoverGroup, ' +
      'descriptionLanguage, ' +
      'description, ' +
      'materialHierarchyNode, ' +
      "coalesce(ROUND(MAX(CASE WHEN TYPE = 'A' THEN Indirect_Turnover_Value END), 0), 0) AS ytdCY, " +
      "coalesce(ROUND(MAX(CASE WHEN TYPE = 'B' THEN Indirect_Turnover_Value END), 0), 0) AS ytdLY, " +
      "coalesce(ROUND(MAX(CASE WHEN TYPE = 'C' THEN Indirect_Turnover_Value END), 0), 0) AS totalLY, " +
      "coalesce(ROUND(MAX(CASE WHEN TYPE = 'H' THEN Indirect_Turnover_Value END), 0), 0) AS totalYearBeforePreviousYear, " +
      "ROUND(coalesce(MAX(CASE WHEN TYPE = 'A' THEN Indirect_Turnover_Value END) - MAX(CASE WHEN TYPE = 'B' THEN Indirect_Turnover_Value END), 0), 0) AS growthCHF, " +
      "CASE WHEN coalesce(MAX(CASE WHEN TYPE = 'B' THEN Indirect_Turnover_Value END),0) = 0 THEN 0 ELSE " +
      "ROUND(coalesce(MAX(CASE WHEN TYPE = 'A' THEN Indirect_Turnover_Value END) - MAX(CASE WHEN TYPE = 'B' THEN Indirect_Turnover_Value END), 0) / MAX(CASE WHEN TYPE = 'B' THEN Indirect_Turnover_Value END) * 100, 2) END AS growthPercentage " +
      'FROM (SELECT TG.ID_Turnover_Group as iDTurnoverGroup, ' +
      'TG.Description_Language_1 AS descriptionLanguage, ' +
      `coalesce(Material_Hierarchy.Description_Language_1, '') AS description, ` +
      'TGMH.Material_Hierarchy_Node as materialHierarchyNode, ' +
      "coalesce(TA.Type,'') As Type, " +
      `${additionalCondition4} ` +
      "'Indirect_Turnover' As typeTurnover " +
      'FROM turnover_groups TG ' +
      'LEFT JOIN Turnover_Groups_Material_Hierarchies TGMH ON TG.ID_Turnover_Group = TGMH.ID_Turnover_Group ' +
      'LEFT  JOIN Material_Hierarchy ON TGMH.Material_Hierarchy_Node = Material_Hierarchy.Material_Hierarchy_Node ' +
      'LEFT JOIN Turnover_Aggregated TA ON tg.ID_Turnover_Group = TA.ID_Turnover_Group ' +
      'AND TGMH.Material_Hierarchy_Node = TA.Material_Hierarchy_Node ' +
      `AND TA.customer_Ship_to = '${customerShipTo}' ` +
      "AND Type <> 'G' " +
      `${additionalCondition2}` +
      ') As result ' +
      'GROUP BY result.typeTurnover, ' +
      'result.iDTurnoverGroup, ' +
      'result.descriptionLanguage, ' +
      'result.description, ' +
      'result.materialHierarchyNode ' +
      'ORDER BY result.typeTurnover, ' +
      'result.iDTurnoverGroup';

    let results = await TurnoverGroupsCollection.query(
      Q.unsafeSqlQuery(QUERY),
    ).unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns Turnover group dropdown
   */
  async getTurnoverGroupDropdown() {
    const collection = this.getCollection(ENTITY);
    const textsService = new TextsService();
    const msgAll = await textsService.getTextsValue('MSG_ALL');

    const parametersValuesService = new ParametersValuesService();
    const parameterValue = await parametersValuesService.getParameterValue(
      'Turnover_Information_In_Customer_Export_From_Tess_Mobile',
    );

    let additionalCondition =
      parameterValue === '2'
        ? `WHERE Reporting_Turnover_Type = "${TURNOVER_GROUPS.ICE_CREAM}" `
        : '';

    const QUERY =
      'SELECT 0 AS idTurnoverGroup, ' +
      `'${msgAll}' AS descriptionLanguage, ` +
      '0 AS reportingTurnoverType ' +
      'UNION ' +
      'SELECT ID_Turnover_Group AS idTurnoverGroup, ' +
      "CASE WHEN Description_Language_1 = '' THEN CAST(ID_Turnover_Group AS VARCHAR) " +
      'ELSE Description_Language_1 ' +
      'END AS descriptionLanguage, ' +
      'Reporting_Turnover_Type ' +
      'FROM Turnover_Groups ' +
      `${additionalCondition}`;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }
}
