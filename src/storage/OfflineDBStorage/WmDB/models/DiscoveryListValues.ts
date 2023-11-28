
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class DiscoveryListValues extends Model {
	static table = 'discovery_list_values';

	@field('discovery_list_values_id') discoveryListValuesId!: string;
	@field('control_id') controlId!: string;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('item_value') itemValue!: string;
	@field('sequence') sequence!: number;
	@field('update_employee_number') updateEmployeeNumber!: string;
	@field('update_datetime') updateDatetime!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default DiscoveryListValues;
