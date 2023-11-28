
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomerBusinessReasons extends Model {
	static table = 'customer_business_reasons';

	@field('id_customer_business_reason') idCustomerBusinessReason!: number;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('hide') hide!: string;
	@field('indirect_prospect') indirectProspect!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomerBusinessReasons;
