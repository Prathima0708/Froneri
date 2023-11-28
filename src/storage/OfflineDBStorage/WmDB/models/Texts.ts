
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Texts extends Model {
	static table = 'texts';

	@field('application') application!: string;
	@field('form') form!: string;
	@field('control') control!: string;
	@field('column_number') columnNumber!: string;
	@field('type') type!: string;
	@field('language') language!: string;
	@field('text') text!: string;
	@field('android_form') androidForm!: string;
	@field('android_control_name') androidControlName!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default Texts;
