
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersMaterialsPreference extends Model {
	static table = 'customers_materials_preference';

	@field('customer_ship_to') customerShipTo!: string;
	@field('material_number') materialNumber!: string;
	@field('id_customer_preference_reason') idCustomerPreferenceReason!: string;
	@field('employee_number') employeeNumber!: string;
	@field('preference_datetime') preferenceDatetime!: string;
	@field('type_preference') typePreference!: string;
	@field('valid_to_datetime') validToDatetime!: string;
	@field('source_of_preference') sourceOfPreference!: string;
	@field('sent_datetime') sentDatetime!: string;
	@field('deletion_requested') deletionRequested!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomersMaterialsPreference;
