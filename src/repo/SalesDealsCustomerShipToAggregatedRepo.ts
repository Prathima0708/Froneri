import BaseRepo from './BaseRepo';
import SalesDealsCustomerShipToAggregated from 'src/storage/OfflineDBStorage/WmDB/models/SalesDealsCustomerShipToAggregated';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';

const ENTITY = OFFLINE_STORAGE.MODEL.SALES_DEALS_CUSTOMER_SHIP_TO_AGGREGATED;

export class SalesDealsCustomerShipToAggregatedRepo extends BaseRepo<SalesDealsCustomerShipToAggregated> {
  /**
   * Function returns rebate/promotion conditions
   * @returns
   */
  async getSalesDealsConditions() {
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
      "select distinct sales_deals_customer_ship_to_aggregated.group_number as 'group', " +
      'sales_deals_customer_ship_to_aggregated.condition_type as conditionType, valid_from as validFrom, valid_to as validTo, ' +
      "cast(value_of_condition as decimal(10,2)) || case when pricing_procedure.value_type = '%' then ' %' else '' end as rebate, " +
      "coalesce(customer_hierarchy_node, '') as customerHierarchyNode," +
      "case when sales_deals_customer_ship_to_aggregated.material_hierarchy_node <> '' " +
      'then sales_deals_customer_ship_to_aggregated.material_hierarchy_node || "-" || ' +
      "coalesce(material_hierarchy.description_language_1, '') " +
      "when sales_deals_customer_ship_to_aggregated.material_group_1 <> '' " +
      "then sales_deals_customer_ship_to_aggregated.material_group_1  || '-' || + coalesce(material_group_description, '') " +
      'else sales_deals_customer_ship_to_aggregated.material_number || "-" || materials.description_language_1 ' +
      'end as materialNumberMaterialGroup1 from sales_deals_customer_ship_to_aggregated ' +
      'left join materials on materials.material_number = sales_deals_customer_ship_to_aggregated.material_number ' +
      'and materials.sales_organization = sales_deals_customer_ship_to_aggregated.sales_organization ' +
      'and materials.distribution_channel = sales_deals_customer_ship_to_aggregated.distribution_channel ' +
      'left join material_hierarchy on sales_deals_customer_ship_to_aggregated.material_hierarchy_node = material_hierarchy.material_hierarchy_node ' +
      'left join pricing_procedure on sales_deals_customer_ship_to_aggregated.condition_type = pricing_procedure.condition_type ' +
      'where sales_deals_customer_ship_to_aggregated.customer_ship_to = ? ' +
      'and sales_deals_customer_ship_to_aggregated.sales_organization = ? ' +
      'and sales_deals_customer_ship_to_aggregated.distribution_channel = ? ' +
      "and sales_deals_customer_ship_to_aggregated.value_of_condition > 0 and group_number <> ''";

    const VALUES = [customerShipTo, salesOrganization, distributionChannel];

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY, VALUES))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }
}
