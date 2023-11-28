
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CallCenters extends Model {
	static table = 'call_centers';

	@field('id_call_center') idCallCenter!: number;
	@field('name') name!: string;
	@field('description') description!: string;
	@field('id_region') idRegion!: number;
	@field('phone_plant') phonePlant!: string;
	@field('fax_plant') faxPlant!: string;
	@field('address1') address1!: string;
	@field('postal_code') postalCode!: string;
	@field('city') city!: string;
	@field('email_id') emailId!: string;
	@field('order_confirmation_email_id') orderConfirmationEmailId!: string;
	@field('enable_order_confirmation') enableOrderConfirmation!: string;
	@field('account_department') accountDepartment!: string;
	@field('link_to_web_product_page') linkToWebProductPage!: string;
	@field('confirmation_orders_call_place_number') confirmationOrdersCallPlaceNumber!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CallCenters;
