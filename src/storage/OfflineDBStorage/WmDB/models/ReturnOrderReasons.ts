
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class ReturnOrderReasons extends Model {
	static table = 'return_order_reasons';

	@field('return_order_reason') returnOrderReason!: string;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('hide') hide!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default ReturnOrderReasons;
