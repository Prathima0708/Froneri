
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TurnoverAggregatedCustomersMaterials extends Model {
	static table = 'turnover_aggregated_customers_materials';

	@field('customer_ship_to') customerShipTo!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('material_number') materialNumber!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TurnoverAggregatedCustomersMaterials;
