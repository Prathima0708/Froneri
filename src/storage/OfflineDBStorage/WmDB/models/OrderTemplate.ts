
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class OrderTemplate extends Model {
	static table = 'order_template';

	@field('id_order_template') idOrderTemplate!: string;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('type') type!: string;
	@field('is_exclusive') isExclusive!: string;
	@field('is_generic') isGeneric!: string;
	@field('id_promotion') idPromotion!: number;
	@field('start_datetime') startDatetime!: number;
	@field('end_datetime') endDatetime!: number;
	@field('specific_text') specificText!: string;
	@field('confirmation_call_required') confirmationCallRequired!: string;
	@field('sort_as_in_template') sortAsInTemplate!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default OrderTemplate;
