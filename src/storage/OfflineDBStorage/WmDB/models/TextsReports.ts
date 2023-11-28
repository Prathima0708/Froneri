
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TextsReports extends Model {
	static table = 'texts_reports';

	@field('report') report!: string;
	@field('label') label!: string;
	@field('language') language!: string;
	@field('text') text!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TextsReports;
