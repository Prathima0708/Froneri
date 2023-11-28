
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class MaterialsNotAvailable extends Model {
	static table = 'materials_not_available';

	@field('material_number') materialNumber!: string;
	@field('plant_number') plantNumber!: string;
	@field('description') description!: string;
	@field('hide_material') hideMaterial!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default MaterialsNotAvailable;
