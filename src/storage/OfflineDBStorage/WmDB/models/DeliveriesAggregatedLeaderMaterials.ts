
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class DeliveriesAggregatedLeaderMaterials extends Model {
	static table = 'deliveries_aggregated_leader_materials';

	@field('customer_ship_to') customerShipTo!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('material_number') materialNumber!: string;
	@field('lastn_deliveries') lastNDeliveries!: number;
	@field('last_delivery') lastDelivery!: number;
	@field('sales_unit') salesUnit!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default DeliveriesAggregatedLeaderMaterials;
