
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Languages extends Model {
	static table = 'languages';

	@field('enable_language_1') enableLanguage1!: string;
	@field('enable_language_2') enableLanguage2!: string;
	@field('enable_language_3') enableLanguage3!: string;
	@field('enable_language_4') enableLanguage4!: string;
	@field('language1') language1!: string;
	@field('language2') language2!: string;
	@field('language3') language3!: string;
	@field('language4') language4!: string;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('description_language_2') descriptionLanguage2!: string;
	@field('description_language_3') descriptionLanguage3!: string;
	@field('description_language_4') descriptionLanguage4!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default Languages;
