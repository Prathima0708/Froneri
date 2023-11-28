
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class PlantZipCodeMapping extends Model {
	static table = 'plant_zip_code_mapping';

	@field('zip_code') zipCode!: string;
	@field('plant_number') plantNumber!: string;
	@field('kanton') kanton!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default PlantZipCodeMapping;
