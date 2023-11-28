
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersSoldTo extends Model {
	static table = 'customers_sold_to';

	@field('customer_ship_to') customerShipTo!: string;
	@field('customer_sold_to') customerSoldTo!: string;
	@field('name1_sold_to') name1SoldTo!: string;
	@field('name2_sold_to') name2SoldTo!: string;
	@field('name3_sold_to') name3SoldTo!: string;
	@field('street3_sold_to') street3SoldTo!: string;
	@field('address1_sold_to') address1SoldTo!: string;
	@field('house_number_sold_to') houseNumberSoldTo!: string;
	@field('postal_code_sold_to') postalCodeSoldTo!: string;
	@field('city_sold_to') citySoldTo!: string;
	@field('fax_sold_to') faxSoldTo!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('phone1_sold_to') phone1SoldTo!: string;
	@field('phone2_sold_to') phone2SoldTo!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomersSoldTo;
