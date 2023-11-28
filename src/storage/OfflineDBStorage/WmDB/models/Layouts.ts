
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Layouts extends Model {
	static table = 'layouts';

	@field('id_layout') idLayout!: number;
	@field('id_customer_classification') idCustomerClassification!: string;
	@field('description') description!: string;
	@field('type') type!: string;
	@field('update_datetime') updateDatetime!: string;
	@field('update_employee_number') updateEmployeeNumber!: string;
	@field('tess_mobile_relevant') tessMobileRelevant!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default Layouts;
