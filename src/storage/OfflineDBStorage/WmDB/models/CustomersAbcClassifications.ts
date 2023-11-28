
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersAbcClassifications extends Model {
	static table = 'customers_abc_classifications';

	@field('abc_classification') abcClassification!: string;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('visit_threshold_days') visitThresholdDays!: number;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_ondatetime') lastSyncOndatetime!: number;
}

export default CustomersAbcClassifications;
