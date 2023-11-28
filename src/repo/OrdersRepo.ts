import BaseRepo from './BaseRepo';
import Orders from 'src/storage/OfflineDBStorage/WmDB/models/Orders';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import LanguagesService from 'src/services/LanguagesService';
import {TextsService} from 'src/services/TextsService';

const ENTITY = OFFLINE_STORAGE.MODEL.ORDERS;

export class OrdersRepo extends BaseRepo<Orders> {
  /**
   * Function returns last order details
   * @returns
   */
  async getLastOrder(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    const collection = this.getCollection(ENTITY);
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

    const QUERY =
      'select orders.creation_datetime as creationDatetime, ' +
      'orders.delivery_datetime as deliveryDatetime, ' +
      'case orders.origin_order ' +
      "when '15' then ? " +
      "when '16' then ? " +
      "when '17' then ? " +
      "when '18' then ? " +
      "when '10' then ? " +
      "when '13' then ? " +
      "when '11' then ? " +
      "when '19' then ? " +
      "when '12' then ? " +
      "when '14' then ? " +
      'end as originOrder,' +
      'orders.net_amount as netAmount ' +
      'from orders where ' +
      'orders.customer_ship_to = ? ' +
      'and orders.sales_organization = ? ' +
      'and orders.distribution_channel = ? ' +
      'order by orders.creation_datetime desc limit 1';

    const VALUES = [
      msgOriginSap,
      msgOriginEdi,
      msgOriginWeb,
      msgOriginMobile,
      msgOriginTelesales,
      msgOriginSalesRep,
      msgOriginFax,
      msgOriginFax,
      msgOriginVoic,
      msgOriginOthers,
      customerShipTo,
      salesOrganization,
      distributionChannel,
    ];

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY, VALUES))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns order history details
   * @returns []
   */
  async getCustomerOrderHistory() {
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
      'select distinct ' +
      'orders.customer_ship_to as customerShipTo, ' +
      'orders.sales_organization as salesOrganization, ' +
      'orders.distribution_channel as distributionChannel, ' +
      'orders.name1_ship_to as name1, ' +
      'orders.name2_ship_to as name2, ' +
      'customers.sort_code as sortCode, ' +
      'orders.postal_code_ship_to as postalCode, ' +
      'orders.call_place_number as callPlaceNumber, ' +
      'orders.city_ship_to as city, ' +
      'customers.active_in_rca as activeInRca, ' +
      'coalesce(customers.sales_office, "") as salesOffice, ' +
      'case orders.house_number_ship_to ' +
      'when "" then orders.address_ship_to ' +
      'else orders.address_ship_to || " " || orders.house_number_ship_to ' +
      'end as address1, ' +
      'orders.id_order as idOrder, ' +
      'orders.creation_datetime as creationDateTime, ' +
      'orders.delivery_datetime as deliveryDateTime, ' +
      'orders.route as route, ' +
      'orders.origin_order as originOrder, ' +
      'orders.net_amount as netAmount, ' +
      'orders.sequence_route as sequenceRoute, ' +
      'orders.sent_datetime as sentDatetime, ' +
      'orders.order_type as orderType, ' +
      'trade_asset_rejection_reasons.description_language_1 as taRejectionReason, ' +
      // 'workflow_events.description_language1 as approvalrejectionreason, ' +
      'orders.order_reason as orderReason, ' +
      'coalesce(orders.sap_document_number, "") as sapDocumentNumber, ' +
      'orders.tess_order_type as tessOrderType, ' +
      'coalesce(orders.logistic_status,"") as logisticStatus, ' +
      'orders.tess_order_sub_type as tessOrderSubType, ' +
      'orders.po_number as poNumber, ' +
      'customers_abc_classifications.description_language_1 as abcclassification, ' +
      'orders.print_status as printStatus, ' +
      'orders.on_line_payment as onlinePayment, ' +
      'orders.external_order as externalOrder, ' +
      'coalesce(orders.order_status, "") as orderStatus, ' +
      'orders.picking_plant_number as pickingPlantNumber, ' +
      'orders.delivering_plant_number as deliveringPlantNumber, ' +
      'coalesce(orders.delivery, "") as delivery, ' +
      'orders.employee_number as employeeNumber, ' +
      'employees.last_name || " " || employees.first_name as employeeName, ' +
      'case when color is not null then color else "" end as color, ' +
      'coalesce(orders.sap_blocking, "") as sapBlocking, ' +
      'orders.self_collector as selfCollector, ' +
      'orders.quantity as quantity, ' +
      'coalesce(orders.confirmation_required, "0") as confirmationRequired, ' +
      'customers.overdue as overdue ' +
      'from orders ' +
      'left outer join customers  on orders.customer_ship_to = customers.customer_ship_to ' +
      'and orders.sales_organization = customers.sales_organization ' +
      'and orders.distribution_channel = customers.distribution_channel ' +
      'left join customers_segregation  on customers.customer_group_15 = customers_segregation.customer_group_15 ' +
      'left outer join call_centers  on orders.id_call_center = call_centers.id_call_center ' +
      'left outer join customers_abc_classifications  on customers.abc_classification = customers_abc_classifications.abc_classification ' +
      'left outer join events  on orders.id_order = events.id_object ' +
      // 'left outer join workflow_events  on events.id_workflow_event = workflow_events.id_workflow_event ' +
      'left outer join trade_asset_rejection_reasons  on orders.id_trade_asset_rejection_reason = trade_asset_rejection_reasons.id_trade_asset_rejection_reason ' +
      'left outer join order_lines  on order_lines.id_order = orders.id_order ' +
      'left join employees  on orders.employee_number = employees.employee_number ' +
      'where 1=1 ' +
      `and customers.customer_ship_to = '${customerShipTo}' ` +
      `and customers.sales_organization = '${salesOrganization}' ` +
      `and customers.distribution_channel = '${distributionChannel}' ` +
      'and orders.order_status <> "0" ' +
      'order by orders.name1_ship_to, ' +
      'orders.creation_datetime desc limit 5';

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }

  /**
   * Function returns order lines / Material info of specific order
   * @returns
   */
  async getOrderHistoryOrderLinesInfo(idOrder: string) {
    const collection = this.getCollection(ENTITY);

    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const languagesData = await LanguagesService.getLanguagesData();
    const languageIndex = languagesData.find(
      (languageData: any) => languageData.language === employeeInfo[0].language,
    )?.indexLanguage;

    const QUERY =
      'select order_lines.material_number as materialNumber, ' +
      `materials.description_language_1 || " " ||  ${languageIndex}  as materialDescription, ` +
      'order_lines.total_quantity as totalQuantity, ' +
      'order_lines.regular_quantity as regularQuantity, ' +
      'order_lines.free_quantity as freeQuantity, ' +
      'order_lines.sales_unit as salesUnit, ' +
      'order_lines.net_amount as netAmount ' +
      'from orders  ' +
      'inner join order_lines  on orders.id_order = order_lines.id_order ' +
      'inner join materials  on order_lines.material_number = materials.material_number ' +
      'and orders.sales_organization = materials.sales_organization ' +
      'and orders.distribution_channel = materials.distribution_channel ' +
      `where orders.id_order = '${idOrder}'`;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }

  /**
   * Function returns claims order lists
   * @returns
   */
  async getClaimsOrderLists(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    try {
      const collection = this.getCollection(ENTITY);
      console.log(
        'customer...',
        customerShipTo,
        salesOrganization,
        distributionChannel,
      );
      const QUERY =
        'SELECT ' +
        "Employees.Last_Name || ' ' || Employees.First_Name as employeeName, " +
        'Orders.Creation_DateTime as creationDateTime, ' +
        'Orders.Delivery_DateTime as deliveryDateTime, ' +
        'Orders.Route, ' +
        'Orders.Sequence_Route AS sequence, ' +
        'Orders.Gross_Amount as grossAmount, ' +
        'Orders.Net_Amount as netAmount, ' +
        "coalesce(Orders.SAP_Document_Number, '') AS SAPDocumentNumber, " +
        'Orders.PO_Number as poNumber, ' +
        'Orders.Origin_Order As origin ' +
        'FROM Orders ' +
        'LEFT Join ' +
        'Employees ' +
        'On Orders.Employee_Number = Employees.Employee_Number ' +
        `WHERE Orders.Customer_Ship_To = '${customerShipTo}' AND ` +
        `Orders.Sales_Organization = '${salesOrganization}' AND ` +
        `Orders.Distribution_Channel = '${distributionChannel}' ` +
        // "AND strftime('%Y-%m-%d',orders.delivery_datetime) >= strftime('%Y-%m-%d', DATE('now', '-1 month')) " +
        // "and strftime('%Y-%m-%d',orders.delivery_datetime)  <=  strftime('%Y-%m-%d','now') " +
        "AND coalesce(Orders.sap_document_number,'') <>'' " +
        'ORDER BY Delivery_Datetime DESC';

      let results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getClaimsOrderLists error >> ', error);
      return [];
    }
  }

  /**
   * Function returns claims order lists lines
   * @returns
   */
  async getClaimsOrderListLines(orderNumber: any) {
    try {
      const collection = this.getCollection(ENTITY);
      const languagesData = await LanguagesService.getLanguagesData();
      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const languageIndex = languagesData.find(
        (languageData: any) =>
          languageData.language === employeeInfo[0].language,
      )?.indexLanguage;
      const QUERY =
        "select '' as search, " +
        'ABS(Order_lines.Material_Number) as materialNumber, ' +
        `description_language_${languageIndex} as materialDescription, ` +
        "'' as productGroup, " +
        '(Order_lines.total_quantity) as quantity, ' +
        '(order_lines.sales_unit) as salesUnit, ' +
        'CAST(coalesce(order_lines.Net_Amount, 0) AS DECIMAL(10, 2)) AS price ' +
        'from Orders ' +
        'INNER JOIN Order_Lines ON Orders.Id_Order = Order_Lines.id_order ' +
        'INNER JOIN Materials ON Materials.Material_Number = Order_lines.Material_Number ' +
        'And Orders.Sales_organization = Materials.Sales_organization ' +
        'And Orders.Distribution_channel = Materials.Distribution_channel ' +
        `WHERE SUBSTR(SAP_DOCUMENT_NUMBER, LENGTH(SAP_DOCUMENT_NUMBER) - 7, 8) = '${orderNumber}' `;
      console.log(QUERY);
      let results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getClaimsOrderListLines error >> ', error);
      return [];
    }
  }
}
