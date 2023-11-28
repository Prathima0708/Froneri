
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersPaymentMethods extends Model {
	static table = 'customers_payment_methods';

	@field('payment_method') paymentMethod!: string;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('discovery_relevant') discoveryRelevant!: string;
	@field('sepa_mandatory') sepaMandatory!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomersPaymentMethods;
