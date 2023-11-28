
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersPayer extends Model {
	static table = 'customers_payer';

	@field('customer_ship_to') customerShipTo!: string;
	@field('customer_payer') customerPayer!: string;
	@field('name1_payer') name1Payer!: string;
	@field('name2_payer') name2Payer!: string;
	@field('name3_payer') name3Payer!: string;
	@field('street3_payer') street3Payer!: string;
	@field('address1_payer') address1Payer!: string;
	@field('house_number_payer') houseNumberPayer!: string;
	@field('postal_code_payer') postalCodePayer!: string;
	@field('city_payer') cityPayer!: string;
	@field('fax_payer') faxPayer!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('phone1_payer') phone1Payer!: string;
	@field('phone2_payer') phone2Payer!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomersPayer;
