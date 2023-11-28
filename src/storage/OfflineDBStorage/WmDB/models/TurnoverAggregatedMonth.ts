
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TurnoverAggregatedMonth extends Model {
	static table = 'turnover_aggregated_month';

	@field('customer_ship_to') customerShipTo!: string;
	@field('id_turnover_group') idTurnoverGroup!: string;
	@field('month') month!: number;
	@field('type') type!: string;
	@field('turnover_value') turnoverValue!: number;
	@field('weight_value') weightValue!: number;
	@field('internal_transfer_price_value') internalTransferPriceValue!: number;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TurnoverAggregatedMonth;
