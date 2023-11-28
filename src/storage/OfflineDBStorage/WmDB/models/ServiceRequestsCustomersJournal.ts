
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class ServiceRequestsCustomersJournal extends Model {
	static table = 'service_requests_customers_journal';

	@field('id_service_request_customer_journal') idServiceRequestCustomerJournal!: string;
	@field('id_service_request_customer') idServiceRequestCustomer!: string;
	@field('event_employee_number') eventEmployeeNumber!: string;
	@field('action') action!: string;
	@field('event_datetime') eventDatetime!: string;
	@field('sent_datetime') sentDatetime!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default ServiceRequestsCustomersJournal;
