
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class DeliveryOvercostReasons extends Model {
	static table = 'delivery_overcost_reasons';

	@field('id_delivery_overcost_reason') idDeliveryOvercostReason!: number;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('hide') hide!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default DeliveryOvercostReasons;
