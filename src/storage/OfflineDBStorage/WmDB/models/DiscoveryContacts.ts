
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class DiscoveryContacts extends Model {
	static table = 'discovery_contacts';

	@field('discovery_id') discoveryId!: string;
	@field('phone_num_contact_1') phoneNumContact1!: string;
	@field('phone_num_contact_2') phoneNumContact2!: string;
	@field('mobile_num_contact_1') mobileNumContact1!: string;
	@field('mobile_num_contact_2') mobileNumContact2!: string;
	@field('fax_num_contact_1') faxNumContact1!: string;
	@field('fax_num_contact_2') faxNumContact2!: string;
	@field('email_contact_1') emailContact1!: string;
	@field('email_contact_2') emailContact2!: string;
	@field('designation_contact_1') designationContact1!: string;
	@field('designation_contact_2') designationContact2!: string;
	@field('first_name_contact_1') firstNameContact1!: string;
	@field('first_name_contact_2') firstNameContact2!: string;
	@field('first_name_contact_3') firstNameContact3!: string;
	@field('first_name_contact_4') firstNameContact4!: string;
	@field('last_name_contact_1') lastNameContact1!: string;
	@field('last_name_contact_2') lastNameContact2!: string;
	@field('last_name_contact_3') lastNameContact3!: string;
	@field('last_name_contact_4') lastNameContact4!: string;
	@field('comment1') comment1!: string;
	@field('comment2') comment2!: string;
	@field('update_employee_number') updateEmployeeNumber!: string;
	@field('update_datetime') updateDatetime!: string;
	@field('sent_datetime') sentDatetime!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default DiscoveryContacts;
