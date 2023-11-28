
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class PersonTitles extends Model {
	static table = 'person_titles';

	@field('person_title') personTitle!: string;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default PersonTitles;
