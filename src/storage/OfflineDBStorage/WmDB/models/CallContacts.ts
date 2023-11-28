
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CallContacts extends Model {
	static table = 'call_contacts';

	@field('id_call') idCall!: string;
	@field('call_contact_datetime') callContactDatetime!: string;
	@field('call_contact_status') callContactStatus!: string;
	@field('call_place_number') callPlaceNumber!: string;
	@field('sent_datetime') sentDatetime!: string;
	@field('customer_ship_to') customerShipTo!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CallContacts;
