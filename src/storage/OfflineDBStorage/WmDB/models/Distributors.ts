
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Distributors extends Model {
	static table = 'distributors';

	@field('id_distributors') idDistributors!: number;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('hide') hide!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default Distributors;
