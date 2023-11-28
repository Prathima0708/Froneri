
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Calendars extends Model {
	static table = 'calendars';

	@field('calendar_id') calendarId!: string;
	@field('frequency') frequency!: string;
	@field('season') season!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default Calendars;
