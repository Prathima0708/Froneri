
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomerPreferenceReasons extends Model {
	static table = 'customer_preference_reasons';

	@field('id_customer_preference_reason') idCustomerPreferenceReason!: number;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('reason_type') reasonType!: string;
	@field('reason_used_for') reasonUsedFor!: string;
	@field('hide') hide!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomerPreferenceReasons;
