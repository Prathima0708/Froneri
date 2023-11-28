
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class ServiceRequestsCustomers extends Model {
	static table = 'service_requests_customers';

	@field('id_service_request_customer') idServiceRequestCustomer!: string;
	@field('id_service_request_type') idServiceRequestType!: string;
	@field('status') status!: string;
	@field('description') description!: string;
	@field('customer_ship_to') customerShipTo!: string;
	@field('creation_employee_number') creationEmployeeNumber!: string;
	@field('creation_datetime') creationDatetime!: string;
	@field('requested_datetime') requestedDatetime!: string;
	@field('resolution') resolution!: string;
	@field('resolved_employee_number') resolvedEmployeeNumber!: string;
	@field('resolved_datetime') resolvedDatetime!: string;
	@field('lock_by') lockBy!: string;
	@field('sent_datetime') sentDatetime!: string;
	@field('deletion_requested') deletionRequested!: string;
	@field('reminder_sent_datetime') reminderSentDatetime!: string;
	@field('send_report') sendReport!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default ServiceRequestsCustomers;
