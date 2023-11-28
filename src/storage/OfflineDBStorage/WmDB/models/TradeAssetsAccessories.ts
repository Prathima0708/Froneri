
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TradeAssetsAccessories extends Model {
	static table = 'trade_assets_accessories';

	@field('trade_asset_number') tradeAssetNumber!: string;
	@field('accessory_number') accessoryNumber!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TradeAssetsAccessories;
