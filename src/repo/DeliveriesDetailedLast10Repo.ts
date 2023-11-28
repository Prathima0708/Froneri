import BaseRepo from './BaseRepo';
import DeliveriesDetailedLast10 from 'src/storage/OfflineDBStorage/WmDB/models/DeliveriesDetailedLast10';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import {TextsService} from 'src/services/TextsService';
import {ParametersValuesService} from 'src/services/ParametersValuesService';
import {TURNOVER_GROUPS} from 'src/utils/DbConst';

const ENTITY = OFFLINE_STORAGE.MODEL.DELIVERIES_DETAILED_LAST_10;

export class DeliveriesDetailedLast10Repo extends BaseRepo<DeliveriesDetailedLast10> {
  /**
   * Function returns last 10 delivery of sales turnover
   * @returns
   */
  async getLast10Deliveries() {
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

    const parametersValuesService = new ParametersValuesService();
    const turnoverInformationInCustomerExportFromTessMobile =
      await parametersValuesService.getParameterValue(
        'Turnover_Information_In_Customer_Export_From_Tess_Mobile',
      );

    const textsService = new TextsService();
    const msgOriginSap = await textsService.getTextsValue('MSG_ORIGIN_SAP');
    const msgOriginEdi = await textsService.getTextsValue('MSG_ORIGIN_EDI');
    const msgOriginWeb = await textsService.getTextsValue('MSG_ORIGIN_WEB');
    const msgOriginMobile = await textsService.getTextsValue(
      'MSG_ORIGIN_MOBILE',
    );
    const msgOriginTelesales = await textsService.getTextsValue(
      'MSG_ORIGIN_TELESALES',
    );
    const msgOriginSalesRep = await textsService.getTextsValue(
      'MSG_ORIGIN_SALES_REP',
    );
    const msgOriginFax = await textsService.getTextsValue('MSG_ORIGIN_FAX');
    const msgOriginVoic = await textsService.getTextsValue('MSG_ORIGIN_VOIC');
    const msgOriginOthers = await textsService.getTextsValue(
      'MSG_ORIGIN_OTHERS',
    );

    const additionalCondition =
      turnoverInformationInCustomerExportFromTessMobile == '2'
        ? `and TG.Reporting_Turnover_Type = '${TURNOVER_GROUPS.ICE_CREAM}' `
        : '';

    const QUERY =
      'SELECT DISTINCT TG.Description_Language_1 AS turnoverGroup, ' +
      'M.Description_Language_1 AS description, ' +
      'CAST(DDL.material_number AS INTEGER) AS materialNumber, ' +
      "COALESCE(DDL.deliveries_ly, '0') AS deliveriesLY, " +
      "COALESCE(DDL.deliveries_ytd_ly, '0') AS deliveriesYTDLY, " +
      "COALESCE(DDL.deliveries_ytd_cy, '0') AS deliveriesYTDCY, " +
      '[Type] AS type, ' +
      'CASE COALESCE(O.Origin_Order, DDL.ID_Order) ' +
      `WHEN 15 THEN '${msgOriginSap}' ` +
      `WHEN 16 THEN '${msgOriginEdi}' ` +
      `WHEN 17 THEN '${msgOriginWeb}' ` +
      `WHEN 18 THEN '${msgOriginMobile}' ` +
      `WHEN 10 THEN '${msgOriginTelesales}' ` +
      `WHEN 13 THEN '${msgOriginSalesRep}' ` +
      `WHEN 11 THEN '${msgOriginFax}' ` +
      `WHEN 19 THEN '${msgOriginFax}' ` +
      `WHEN 12 THEN '${msgOriginVoic}' ` +
      `WHEN 14 THEN '${msgOriginOthers}' ` +
      'END AS originOrder, ' +
      'DATE(DDL.Delivery_DateTime) AS deliveryDate, ' +
      'CASE [Type] ' +
      "WHEN 'B' THEN 0 " +
      'ELSE DDL.Quantity ' +
      'END AS quantity ' +
      'FROM Deliveries_Detailed_Last_10 DDL ' +
      'INNER JOIN materials M ON M.material_number = DDL.material_number ' +
      'AND M.sales_organization = DDL.sales_organization ' +
      'AND M.distribution_channel = DDL.distribution_channel ' +
      "AND M.material_type = 'FERT' " +
      'LEFT JOIN orders O ON DDL.id_order = O.sap_document_number ' +
      'LEFT JOIN Turnover_Groups_Material_Hierarchies TGMH ON TGMH.Material_Hierarchy_Node IN (M.Material_Hierarchy_Node_L2,M.Material_Hierarchy_Node_L3,M.Material_Hierarchy_Node_L4,M.Material_Hierarchy_Node_L5) ' +
      'LEFT JOIN TurnOver_Groups TG ON TG.Id_Turnover_Group = TGMH.Id_Turnover_Group ' +
      `WHERE DDL.Customer_Ship_To = '${customerShipTo}' ` +
      `AND DDL.Sales_Organization = '${salesOrganization}' ` +
      `AND DDL.Distribution_Channel = '${distributionChannel}' ` +
      "AND [Type] IN ('A', 'B') " +
      additionalCondition +
      'ORDER BY [Type]';

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }
}
