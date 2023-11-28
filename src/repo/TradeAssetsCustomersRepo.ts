import BaseRepo from './BaseRepo';
import TradeAssetsCustomers from 'src/storage/OfflineDBStorage/WmDB/models/TradeAssetsCustomers';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import {TextsService} from 'src/services/TextsService';
import {CLAIMS_MATERIAL_TYPES} from 'src/utils/DbConst';

const ENTITY = OFFLINE_STORAGE.MODEL.TRADE_ASSETS_CUSTOMERS;

export class TradeAssetsCustomersRepo extends BaseRepo<TradeAssetsCustomers> {
  /**
   * Function returns Trade assets of customer
   * @returns
   */
  async getCustomerTradeAssets() {
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

    const textsService = new TextsService();
    const msgActiveText = await textsService.getTextsValue('MSG_ACTIVE');
    const msgInActiveText = await textsService.getTextsValue('MSG_INACTIVE');
    const msgWinterlagerExternText = await textsService.getTextsValue(
      'MSG_WINTERLAGER_EXTERN',
    );
    const msgWinterlagerVzText = await textsService.getTextsValue(
      'MSG_WINTERLAGER_VZ',
    );
    const msgTransportPendingText = await textsService.getTextsValue(
      'MSG_TRANSPORT_PENDING',
    );
    console.log(
      'msgActiveText',
      msgActiveText,
      msgInActiveText,
      msgWinterlagerExternText,
      msgWinterlagerVzText,
      msgTransportPendingText,
    );

    const QUERY =
      'SELECT CAST(Trade_Assets_Customers.Material_Number AS INTEGER) AS materialNumber, ' +
      "COALESCE(Materials.Description_Language_1, '') AS materialDescription, " +
      'Trade_Assets_Customers.serial_number as serialNumber, ' +
      'Trade_Assets_Customers.Construction_Year AS constructionYear, ' +
      'CASE Trade_Assets_Customers.Status1 ' +
      `WHEN '1' THEN "${msgActiveText}" ` +
      `WHEN '2' THEN "${msgInActiveText}" ` +
      `WHEN '3' THEN "${msgWinterlagerExternText}" ` +
      `WHEN '4' THEN "${msgWinterlagerVzText}" ` +
      `WHEN '5' THEN "${msgTransportPendingText}" ` +
      "ELSE '' " +
      'END AS status1, ' +
      'Trade_Assets_Customers.Status2 as status2, ' +
      'CAST(Trade_Assets_Customers.Equipment_Number AS TEXT) AS equipmentNumber, ' +
      'Trade_Assets_Customers.Batch_Number as batchNumber, ' +
      'Trade_Assets_Customers.Manufacturer_Model as manufacturerModel, ' +
      'Trade_Assets_Customers.manufacturer_serial_number as manufacturerSerialNumber, ' +
      'CAST(COALESCE(Trade_Assets_Minimum_Turnover.Minimum_Turnover, 0) AS TEXT) AS targetTurnover, ' +
      'CAST(COALESCE(Trade_Assets_Minimum_Turnover.Price, 0) AS TEXT) AS price, ' +
      'Trade_Assets_Customers.Installed_Date AS installedDate, ' +
      'Trade_Assets_Customers.Brand as brand, ' +
      'CAST(1.0 AS REAL) AS quantity, ' +
      'Trade_Assets_Customers.Status1 AS status ' +
      'FROM Trade_Assets_Customers ' +
      'LEFT JOIN Materials ' +
      'ON Trade_Assets_Customers.Material_Number = Materials.Material_Number ' +
      'AND Trade_Assets_Customers.Sales_Organization = Materials.Sales_Organization ' +
      'AND Trade_Assets_Customers.Distribution_Channel = Materials.Distribution_Channel ' +
      'LEFT JOIN Trade_Assets_Minimum_Turnover ' +
      'ON Trade_Assets_Customers.Material_Number = Trade_Assets_Minimum_Turnover.Material_Number ' +
      `WHERE Trade_Assets_Customers.Customer_Ship_To = '${customerShipTo}' ` +
      `AND Trade_Assets_Customers.Sales_Organization = '${salesOrganization}' ` +
      `AND Trade_Assets_Customers.Distribution_Channel = '${distributionChannel}' ` +
      'ORDER BY Trade_Assets_Customers.Material_Number';

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }

  /**
   * Function returns Service Workflow
   * @returns
   */
  async getServiceWorkflowTradeAssets(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
    start: number,
    limit: number,
    searchText: string,
  ) {
    try {
      const collection = this.getCollection(ENTITY);

      const textsService = new TextsService();
      const msgActiveText = await textsService.getTextsValue('MSG_ACTIVE');
      const msgInActiveText = await textsService.getTextsValue('MSG_INACTIVE');
      const msgWinterlagerExternText = await textsService.getTextsValue(
        'MSG_WINTERLAGER_EXTERN',
      );
      const msgWinterlagerVzText = await textsService.getTextsValue(
        'MSG_WINTERLAGER_VZ',
      );
      const msgTransportPendingText = await textsService.getTextsValue(
        'MSG_TRANSPORT_PENDING',
      );

      let FILTER_QUERY = '';

      if (searchText && searchText.trim() !== '') {
        FILTER_QUERY += ` and (trade_assets_customers.material_number like '%${searchText}%' or materials.description_language_1 like '%${searchText}%' or equipmentNumber like '%${searchText}%') `;
      }

      const QUERY =
        'SELECT CAST(Trade_Assets_Customers.Material_Number AS INTEGER) AS materialNumber, ' +
        "COALESCE(Materials.Description_Language_1, '') AS materialDescription, " +
        'Trade_Assets_Customers.serial_number as serialNumber, ' +
        'Trade_Assets_Customers.Construction_Year AS constructionYear, ' +
        'CASE Trade_Assets_Customers.Status1 ' +
        `WHEN '1' THEN "${msgActiveText}" ` +
        `WHEN '2' THEN "${msgInActiveText}" ` +
        `WHEN '3' THEN "${msgWinterlagerExternText}" ` +
        `WHEN '4' THEN "${msgWinterlagerVzText}" ` +
        `WHEN '5' THEN "${msgTransportPendingText}" ` +
        "ELSE '' " +
        'END AS status1, ' +
        'Trade_Assets_Customers.Status2 as status2, ' +
        'CAST(Trade_Assets_Customers.Equipment_Number AS TEXT) AS equipmentNumber, ' +
        'Trade_Assets_Customers.Batch_Number as batchNumber, ' +
        'Trade_Assets_Customers.Manufacturer_Model as manufacturerModel, ' +
        'Trade_Assets_Customers.manufacturer_serial_number as manufacturerSerialNumber, ' +
        'CAST(COALESCE(Trade_Assets_Minimum_Turnover.Minimum_Turnover, 0) AS TEXT) AS targetTurnover, ' +
        'CAST(COALESCE(Trade_Assets_Minimum_Turnover.Price, 0) AS TEXT) AS price, ' +
        'Trade_Assets_Customers.Installed_Date AS installedDate, ' +
        'Trade_Assets_Customers.Brand as brand, ' +
        'CAST(1.0 AS REAL) AS quantity, ' +
        'Trade_Assets_Customers.Status1 AS status ' +
        'FROM Trade_Assets_Customers ' +
        'LEFT JOIN Materials ' +
        'ON Trade_Assets_Customers.Material_Number = Materials.Material_Number ' +
        'AND Trade_Assets_Customers.Sales_Organization = Materials.Sales_Organization ' +
        'AND Trade_Assets_Customers.Distribution_Channel = Materials.Distribution_Channel ' +
        'LEFT JOIN Trade_Assets_Minimum_Turnover ' +
        'ON Trade_Assets_Customers.Material_Number = Trade_Assets_Minimum_Turnover.Material_Number ' +
        `WHERE Trade_Assets_Customers.Customer_Ship_To = '${customerShipTo}' ` +
        `AND Trade_Assets_Customers.Sales_Organization = '${salesOrganization}' ` +
        `AND Trade_Assets_Customers.Distribution_Channel = '${distributionChannel}' ` +
        FILTER_QUERY +
        'ORDER BY Trade_Assets_Customers.Material_Number';

      const LIMIT_QUERY = ` LIMIT ${limit} OFFSET ${start}`;

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY + LIMIT_QUERY))
        .unsafeFetchRaw();

      const countData = await collection
        .query(Q.unsafeSqlQuery(QUERY + LIMIT_QUERY))
        .unsafeFetchRaw();

      return {results, totalCount: countData.length};
    } catch (error) {
      console.log('getServiceWorkflowTradeAssets error :>> ', error);
      return {results: [], totalCount: 0};
    }
  }

  /**
   * Function returns Trade assets of previous customer
   * @returns
   */
  async getTradeAssets(
    prevCustomerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    const collection = this.getCollection(ENTITY);

    const QUERY =
      'select trade_assets_customers.serial_number as serialNumber, ' +
      'trade_assets_customers.material_number as materialNumber, ' +
      'trade_assets_customers.sales_organization as salesOrganization, ' +
      'trade_assets_customers.distribution_channel as distributionChannel, ' +
      'coalesce(discovery_new_trade_assets_wished.price_tag, ' +
      "coalesce(discovery_previous_owner_trade_assets.price_tag,'')) as priceTag " +
      'from trade_assets_customers left join materials on ' +
      'trade_assets_customers.material_number = materials.material_number and ' +
      'trade_assets_customers.sales_organization = materials.sales_organization ' +
      'and trade_assets_customers.distribution_channel = materials.distribution_channel ' +
      'left join discovery_new_trade_assets_wished on trade_assets_customers.manufacturer_model ' +
      '= discovery_new_trade_assets_wished.ta_loan_agreement_number left join ' +
      'discovery_previous_owner_trade_assets on trade_assets_customers.manufacturer_model = ' +
      'discovery_previous_owner_trade_assets.ta_loan_agreement_number and ' +
      'trade_assets_customers.serial_number = discovery_previous_owner_trade_assets.serial_number ' +
      'where trade_assets_customers.customer_ship_to = ? ' +
      'and trade_assets_customers.sales_organization = ? and ' +
      'trade_assets_customers.distribution_channel = ? and trade_assets_customers.material_number ' +
      '|| trade_assets_customers.serial_number || trade_assets_customers.customer_ship_to not in ' +
      '(select discovery_previous_owner_trade_assets.material_number || ' +
      'discovery_previous_owner_trade_assets.serial_number || ' +
      'discovery_previous_owner_trade_assets.previous_customer_ship_to from ' +
      "discovery_previous_owner_trade_assets where discovery_previous_owner_trade_assets.too = '1' " +
      'and discovery_previous_owner_trade_assets.previous_customer_ship_to is not null) ' +
      'order by  trade_assets_customers.material_number';

    const QUERY_VALUES = [
      prevCustomerShipTo,
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
  }

  /**
   * Function returns Trade assets of previous customer in PLP TA Charge off
   * @returns
   */
  async getPreviousCustomerTAChargeOff() {
    try {
      const collection = this.getCollection(ENTITY);

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
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const QUERY =
        "select coalesce(trade_assets_customers.material_number, '') " +
        "as materialNumber, coalesce(replace(materials.description_language_1, ';', ''), " +
        "'') as description, coalesce(trade_assets_customers.serial_number, '') as serialNumber, " +
        "'0' as taChargeOff, '' as residualValue, strftime('%d-%m-%Y', trade_assets_customers.construction_year) as constructionDate " +
        'from trade_assets_customers left join materials on trade_assets_customers.material_number ' +
        '= materials.material_number and trade_assets_customers.sales_organization = ' +
        'materials.sales_organization and trade_assets_customers.distribution_channel = ' +
        'materials.distribution_channel where trade_assets_customers.customer_ship_to = ? ' +
        'and trade_assets_customers.sales_organization = ? ' +
        'and trade_assets_customers.distribution_channel = ? ' +
        'and trade_assets_customers.material_number || trade_assets_customers.serial_number ' +
        'not in (select discovery_trade_assets_charge_off.material_number || discovery_trade_assets_charge_off.serial_number ' +
        'from discovery_trade_assets_charge_off where discovery_trade_assets_charge_off.discovery_id = ? and ' +
        "discovery_trade_assets_charge_off.ta_charge_off_status = '1')";

      const QUERY_VALUES = [
        customerShipTo,
        salesOrganization,
        distributionChannel,
        discoveryId,
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
      console.log('getTradeAssetsOfPreviousCustomer error :>> ', error);
      return [];
    }
  }

  /**
   * Function returns Trade assets of previous customer in PLP TA Request
   * @returns
   */
  async getTaTakeoverOfPreviousCustomerInTaRequest(customerShipTo: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const QUERY =
        "select coalesce(replace(materials.description_language_1, ';', ''), " +
        "'') as description, trade_assets_customers.serial_number as serialNumber, " +
        "'1' as taTransfer, '' as expectedTurnoverTa, '' as followUpAction, " +
        'trade_assets_customers.material_number as materialNumber, ' +
        'coalesce(discovery_new_trade_assets_wished.price_tag, ' +
        "coalesce(discovery_previous_owner_trade_assets.price_tag,'')) as priceTag " +
        'from trade_assets_customers left join materials on trade_assets_customers.material_number = materials.material_number ' +
        'and trade_assets_customers.sales_organization = materials.sales_organization ' +
        'and trade_assets_customers.distribution_channel = materials.distribution_channel ' +
        'left join discovery_new_trade_assets_wished on trade_assets_customers.manufacturer_model = ' +
        'discovery_new_trade_assets_wished.ta_loan_agreement_number left join discovery_previous_owner_trade_assets ' +
        'on trade_assets_customers.manufacturer_model = discovery_previous_owner_trade_assets.ta_loan_agreement_number ' +
        'and trade_assets_customers.serial_number = discovery_previous_owner_trade_assets.serial_number ' +
        'where trade_assets_customers.customer_ship_to = ? and trade_assets_customers.material_number ' +
        '|| trade_assets_customers.serial_number || trade_assets_customers.customer_ship_to not in (select ' +
        'discovery_previous_owner_trade_assets.material_number || discovery_previous_owner_trade_assets.serial_number ' +
        '|| discovery_previous_owner_trade_assets.previous_customer_ship_to from discovery_previous_owner_trade_assets ' +
        "where discovery_previous_owner_trade_assets.too = '1' " +
        'and discovery_previous_owner_trade_assets.previous_customer_ship_to is not null) ' +
        'order by trade_assets_customers.material_number';

      const QUERY_VALUES = [customerShipTo];

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
        'getTradeAssetsOfPreviousCustomerInTaRequest error :>> ',
        error,
      );
      return [];
    }
  }

  /**
   * Function returns Service Workflow
   * @returns
   */
  async getServiceWorkflowOfflineTradeAssets(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
    idServiceRequestCustomer: string,
  ) {
    try {
      const collection = this.getCollection(ENTITY);

      const QUERY = `select
      *
  from
      (
          select
              1 as selection,
              CAST(trade_assets_customers.material_number as DECIMAL(10,2)) as materialNumber,
              coalesce(materials.description_language_1, '') as materialDescription,
              trade_assets_customers.serial_number,
              coalesce(trade_assets_customers.equipment_number, '') as equipmentNumber,
              trade_assets_customers.installed_date as installedDate
          from
              trade_assets_customers 
              inner join customers_claims_workflow_claims_data  on trade_assets_customers.material_number = customers_claims_workflow_claims_data.material_number
              and trade_assets_customers.equipment_number = customers_claims_workflow_claims_data.equipment_number
              left join materials  on trade_assets_customers.material_number = materials.material_number
              and trade_assets_customers.sales_organization = materials.sales_organization
              and trade_assets_customers.distribution_channel = materials.distribution_channel
          where
              trade_assets_customers.customer_ship_to = '${customerShipTo}'
              and trade_assets_customers.sales_organization = '${salesOrganization}'
              and trade_assets_customers.distribution_channel = '${distributionChannel}'
              and customers_claims_workflow_claims_data.claim_settlement_product_type = '${CLAIMS_MATERIAL_TYPES.TA_MATERIALS}'
              and customers_claims_workflow_claims_data.id_service_request_customer = '${idServiceRequestCustomer}' 
          union
          select
              0 as selection,
             trade_assets_customers.material_number as materialNumber,
              coalesce(materials.description_language_1, '') as materialDescription,
              trade_assets_customers.serial_number,
              coalesce(trade_assets_customers.equipment_number, '') as equipmentNumber,
              trade_assets_customers.installed_date as installedDate
          from
              trade_assets_customers 
              left join materials  on trade_assets_customers.material_number = materials.material_number
              and trade_assets_customers.sales_organization = materials.sales_organization
              and trade_assets_customers.distribution_channel = materials.distribution_channel
          where
              trade_assets_customers.customer_ship_to ='${customerShipTo}'
              and trade_assets_customers.sales_organization ='${salesOrganization}'
              and trade_assets_customers.distribution_channel = '${distributionChannel}'
              and trade_assets_customers.material_number + trade_assets_customers.equipment_number not in (
                  select
                      trade_assets_customers.material_number + trade_assets_customers.equipment_number
                  from
                      trade_assets_customers 
                      inner join customers_claims_workflow_claims_data  on trade_assets_customers.material_number = customers_claims_workflow_claims_data.material_number
                      and trade_assets_customers.equipment_number = customers_claims_workflow_claims_data.equipment_number
                      left join materials  on trade_assets_customers.material_number = materials.material_number
                      and trade_assets_customers.sales_organization = materials.sales_organization
                      and trade_assets_customers.distribution_channel = materials.distribution_channel
                  where
                      trade_assets_customers.customer_ship_to = '${customerShipTo}'
                      and trade_assets_customers.sales_organization = '${salesOrganization}'
                      and trade_assets_customers.distribution_channel ='${distributionChannel}'
                      and customers_claims_workflow_claims_data.claim_settlement_product_type = '${CLAIMS_MATERIAL_TYPES.TA_MATERIALS}'
                      and customers_claims_workflow_claims_data.id_service_request_customer = '${idServiceRequestCustomer}'
              )
      ) result
  order by
      result.materialNumber
  `;

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      const countData = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      return {results, totalCount: countData.length};
    } catch (error) {
      console.log('getServiceWorkflowOfflineTradeAssets error :>> ', error);
      return {results: [], totalCount: 0};
    }
  }

  /**
   * Function returns service request types dropdown data
   * @returns
   */
  async getSalesUnitTypeDropdownData() {
    try {
      const collection = this.getCollection(ENTITY);

      let QUERY = `select  
      unit_of_measure as unitOfMeasure ,description_language_1 as unitOfMeasureDesc  
      from  units_of_measures`;

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getSalesUnitTypeDropdownData error :>> ', error);
      return [];
    }
  }
}
