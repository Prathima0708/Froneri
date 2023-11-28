
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class SalesDealsCustomerShipToAggregated extends Model {
	static table = 'sales_deals_customer_ship_to_aggregated';

	@field('customer_ship_to') customerShipTo!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('material_number') materialNumber!: string;
	@field('value_of_condition') valueOfCondition!: number;
	@field('valid_from') validFrom!: string;
	@field('valid_to') validTo!: string;
	@field('material_group_description') materialGroupDescription!: string;
	@field('group_number') groupNumber!: string;
	@field('condition_type') conditionType!: string;
	@field('material_group_1') materialGroup1!: string;
	@field('customer_hierarchy_node') customerHierarchyNode!: string;
	@field('material_hierarchy_node') materialHierarchyNode!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default SalesDealsCustomerShipToAggregated;
