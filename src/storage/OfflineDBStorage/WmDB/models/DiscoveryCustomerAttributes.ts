
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class DiscoveryCustomerAttributes extends Model {
	static table = 'discovery_customer_attributes';

	@field('discovery_id') discoveryId!: string;
	@field('abc_classification') abcClassification!: string;
	@field('priority') priority!: string;
	@field('start_customer_business_datetime') startCustomerBusinessDatetime!: string;
	@field('id_customer_business_reason_start') idCustomerBusinessReasonStart!: number;
	@field('canvasser_employee_number') canvasserEmployeeNumber!: string;
	@field('indirect_customer') indirectCustomer!: string;
	@field('wholesaler_customer_number') wholesalerCustomerNumber!: string;
	@field('id_distributors') idDistributors!: number;
	@field('scooping') scooping!: string;
	@field('update_employee_number') updateEmployeeNumber!: string;
	@field('update_datetime') updateDatetime!: string;
	@field('sent_datetime') sentDatetime!: string;
	@field('key_account_gln_code') keyAccountGlnCode!: string;
	@field('owner_deputy_first_name') ownerDeputyFirstName!: string;
	@field('owner_deputy_last_name') ownerDeputyLastName!: string;
	@field('owner_deputy_dob') ownerDeputyDob!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default DiscoveryCustomerAttributes;
