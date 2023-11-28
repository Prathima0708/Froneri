
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TradeAssetPickupOrderReasons extends Model {
	static table = 'trade_asset_pickup_order_reasons';

	@field('ta_pickup_order_reason') taPickupOrderReason!: string;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('order_type') orderType!: string;
	@field('hide') hide!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TradeAssetPickupOrderReasons;
