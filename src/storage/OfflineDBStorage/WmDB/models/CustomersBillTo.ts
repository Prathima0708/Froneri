
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersBillTo extends Model {
	static table = 'customers_bill_to';

	@field('customer_ship_to') customerShipTo!: string;
	@field('customer_bill_to') customerBillTo!: string;
	@field('name1_bill_to') name1BillTo!: string;
	@field('name2_bill_to') name2BillTo!: string;
	@field('name3_bill_to') name3BillTo!: string;
	@field('street1_bill_to') street1BillTo!: string;
	@field('street2_bill_to') street2BillTo!: string;
	@field('street3_bill_to') street3BillTo!: string;
	@field('address1_bill_to') address1BillTo!: string;
	@field('house_number_bill_to') houseNumberBillTo!: string;
	@field('postal_code_bill_to') postalCodeBillTo!: string;
	@field('city_bill_to') cityBillTo!: string;
	@field('phone1_bill_to') phone1BillTo!: string;
	@field('phone2_bill_to') phone2BillTo!: string;
	@field('fax_bill_to') faxBillTo!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('name4_bill_to') name4BillTo!: string;
	@field('postal_box_bill_to') postalBoxBillTo!: string;
	@field('postal_code_box_bill_to') postalCodeBoxBillTo!: string;
	@field('city_box_bill_to') cityBoxBillTo!: string;
	@field('country_bill_to') countryBillTo!: string;
	@field('mail_address_bill_to') mailAddressBillTo!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomersBillTo;
