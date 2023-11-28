
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class InternalMessages extends Model {
	static table = 'internal_messages';

	@field('id_internal_message') idInternalMessage!: string;
	@field('customer_number') customerNumber!: string;
	@field('valid_from_datetime') validFromDatetime!: string;
	@field('valid_to_datetime') validToDatetime!: string;
	@field('creation_datetime') creationDatetime!: string;
	@field('creation_employee_number') creationEmployeeNumber!: string;
	@field('updation_employee_number') updationEmployeeNumber!: string;
	@field('updation_datetime') updationDatetime!: string;
	@field('subject') subject!: string;
	@field('body') body!: string;
	@field('status') status!: string;
	@field('action') action!: string;
	@field('sent_datetime') sentDatetime!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('type') type!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default InternalMessages;
