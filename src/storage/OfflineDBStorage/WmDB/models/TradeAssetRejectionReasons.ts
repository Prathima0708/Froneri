
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TradeAssetRejectionReasons extends Model {
	static table = 'trade_asset_rejection_reasons';

	@field('id_trade_asset_rejection_reason') idTradeAssetRejectionReason!: number;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TradeAssetRejectionReasons;
