
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersPaymentTerms extends Model {
	static table = 'customers_payment_terms';

	@field('payment_term') paymentTerm!: string;
	@field('payment_term_alert') paymentTermAlert!: string;
	@field('cash_on_delivery') cashOnDelivery!: string;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('cash_payment_term') cashPaymentTerm!: string;
	@field('credit_card') creditCard!: string;
	@field('hide') hide!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomersPaymentTerms;
