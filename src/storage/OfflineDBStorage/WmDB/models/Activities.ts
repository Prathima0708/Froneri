
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Activities extends Model {
	static table = 'activities';

	@field('id_activity') idActivity!: string;
	@field('activity_type') activityType!: number;
	@field('employee_number') employeeNumber!: string;
	@field('customer_ship_to') customerShipTo!: string;
	@field('call_place_number') callPlaceNumber!: string;
	@field('activity_datetime') activityDatetime!: string;
	@field('id_object') idObject!: string;
	@field('sent_datetime') sentDatetime!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default Activities;
