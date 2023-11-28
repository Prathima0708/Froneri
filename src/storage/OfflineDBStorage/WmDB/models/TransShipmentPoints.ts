
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TransShipmentPoints extends Model {
	static table = 'trans_shipment_points';

	@field('tsp_number') tspNumber!: string;
	@field('rdc_number') rdcNumber!: string;
	@field('name') name!: string;
	@field('description') description!: string;
	@field('customer_number') customerNumber!: string;
	@field('self_collector_default_route') selfCollectorDefaultRoute!: string;
	@field('plant_status') plantStatus!: string;
	@field('route_planning_cut_off_time') routePlanningCutOffTime!: string;
	@field('order_taking_cut_off_time') orderTakingCutOffTime!: string;
	@field('country') country!: string;
	@field('postal_code') postalCode!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TransShipmentPoints;
