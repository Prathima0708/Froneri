
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class OrdersAggregated extends Model {
	static table = 'orders_aggregated';

	@field('customer_ship_to') customerShipTo!: string;
	@field('type') type!: string;
	@field('net_amount') netAmount!: number;
	@field('gross_amount') grossAmount!: number;
	@field('net_weight') netWeight!: number;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default OrdersAggregated;
