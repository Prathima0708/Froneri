
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class NoOrderReasons extends Model {
	static table = 'no_order_reasons';

	@field('no_order_reasonsid_no_order_reason') noOrderReasonsidNoOrderReason!: number;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('default') default!: string;
	@field('hide') hide!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default NoOrderReasons;
