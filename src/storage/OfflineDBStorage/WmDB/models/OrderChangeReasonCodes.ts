
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class OrderChangeReasonCodes extends Model {
	static table = 'order_change_reason_codes';

	@field('order_change_reason_code') orderChangeReasonCode!: string;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('default') default!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default OrderChangeReasonCodes;
