
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersDifferentDeliveryAddress extends Model {
	static table = 'customers_different_delivery_address';

	@field('customer_ship_to') customerShipTo!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('customer_diff_addr') customerDiffAddr!: string;
	@field('name1_diff_addr') name1DiffAddr!: string;
	@field('name2_diff_addr') name2DiffAddr!: string;
	@field('name3_diff_addr') name3DiffAddr!: string;
	@field('street1_diff_addr') street1DiffAddr!: string;
	@field('street2_diff_addr') street2DiffAddr!: string;
	@field('street3_diff_addr') street3DiffAddr!: string;
	@field('address1_diff_addr') address1DiffAddr!: string;
	@field('house_number_diff_addr') houseNumberDiffAddr!: string;
	@field('postal_code_diff_addr') postalCodeDiffAddr!: string;
	@field('city_diff_addr') cityDiffAddr!: string;
	@field('name4_diff_addr') name4DiffAddr!: string;
	@field('postal_box_diff_addr') postalBoxDiffAddr!: string;
	@field('postal_code_box_diff_addr') postalCodeBoxDiffAddr!: string;
	@field('city_box_diff_addr') cityBoxDiffAddr!: string;
	@field('country_diff_addr') countryDiffAddr!: string;
	@field('fax_diff_addr') faxDiffAddr!: string;
	@field('mail_address_diff_addr') mailAddressDiffAddr!: string;
	@field('phone1_diff_addr') phone1DiffAddr!: string;
	@field('phone2_diff_addr') phone2DiffAddr!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomersDifferentDeliveryAddress;
