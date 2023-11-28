
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class HolidayCalendarsHolidays extends Model {
	static table = 'holiday_calendars_holidays';

	@field('id_holiday_calendar') idHolidayCalendar!: number;
	@field('date') date!: string;
	@field('bank_holiday') bankHoliday!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default HolidayCalendarsHolidays;
