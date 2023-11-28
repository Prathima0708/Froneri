
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class FreeItemReasons extends Model {
	static table = 'free_item_reasons';

	@field('id_free_item_reason') idFreeItemReason!: number;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('hit_promo_relevant') hitPromoRelevant!: string;
	@field('hide') hide!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default FreeItemReasons;
