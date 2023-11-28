
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class RdcTspHolidayCalendar extends Model {
	static table = 'rdc_tsp_holiday_calendar';

	@field('plant_number') plantNumber!: string;
	@field('id_holiday_calendar') idHolidayCalendar!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default RdcTspHolidayCalendar;
