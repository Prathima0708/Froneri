
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class DeliveriesAggregatedShipToMaterials extends Model {
	static table = 'deliveries_aggregated_ship_to_materials';

	@field('customer_ship_to') customerShipTo!: string;
	@field('material_number') materialNumber!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('latest_delivery_datetime') latestDeliveryDatetime!: string;
	@field('first_delivery_datetime') firstDeliveryDatetime!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default DeliveriesAggregatedShipToMaterials;
