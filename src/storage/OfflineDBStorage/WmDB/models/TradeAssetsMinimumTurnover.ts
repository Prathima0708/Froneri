
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TradeAssetsMinimumTurnover extends Model {
	static table = 'trade_assets_minimum_turnover';

	@field('material_number') materialNumber!: string;
	@field('minimum_turnover') minimumTurnover!: number;
	@field('price') price!: number;
	@field('brand') brand!: string;
	@field('cost_center') costCenter!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TradeAssetsMinimumTurnover;
