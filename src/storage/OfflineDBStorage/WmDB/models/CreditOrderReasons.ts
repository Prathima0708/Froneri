
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CreditOrderReasons extends Model {
	static table = 'credit_order_reasons';

	@field('id_credit_order_reason') idCreditOrderReason!: number;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CreditOrderReasons;
