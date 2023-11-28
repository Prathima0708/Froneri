
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomerVacations extends Model {
	static table = 'customer_vacations';

	@field('customer_ship_to') customerShipTo!: string;
	@field('start_vacation_datetime') startVacationDatetime!: string;
	@field('end_vacation_datetime') endVacationDatetime!: string;
	@field('remarks') remarks!: string;
	@field('id_customer_vacations') idCustomerVacations!: string;
	@field('sent_datetime') sentDatetime!: string;
	@field('deletion_requested') deletionRequested!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomerVacations;
