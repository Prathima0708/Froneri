
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersIndustryCodes extends Model {
	static table = 'customers_industry_codes';

	@field('industry_code') industryCode!: string;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('meal_cost') mealCost!: number;
	@field('id_customer_channel') idCustomerChannel!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomersIndustryCodes;
