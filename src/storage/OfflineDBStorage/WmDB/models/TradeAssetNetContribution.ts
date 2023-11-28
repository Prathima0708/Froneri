
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TradeAssetNetContribution extends Model {
	static table = 'trade_asset_net_contribution';

	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('expected_turnover_from') expectedTurnoverFrom!: number;
	@field('expected_turnover_to') expectedTurnoverTo!: number;
	@field('ncc_mc_percentage') nccMcPercentage!: number;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TradeAssetNetContribution;
