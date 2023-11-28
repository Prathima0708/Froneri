
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class UnitsOfMeasures extends Model {
	static table = 'units_of_measures';

	@field('unit_of_measure') unitOfMeasure!: string;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default UnitsOfMeasures;
