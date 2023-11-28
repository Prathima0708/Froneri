
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersSalesOffices extends Model {
	static table = 'customers_sales_offices';

	@field('sales_office_code') salesOfficeCode!: string;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('primary_rtm_employee_number_1') primaryRtmEmployeeNumber1!: string;
	@field('secondary_rtm_employee_number_1') secondaryRtmEmployeeNumber1!: string;
	@field('primary_rtm_employee_number_2') primaryRtmEmployeeNumber2!: string;
	@field('secondary_rtm_employee_number_2') secondaryRtmEmployeeNumber2!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomersSalesOffices;
