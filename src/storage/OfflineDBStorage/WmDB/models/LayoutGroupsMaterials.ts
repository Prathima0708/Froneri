
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class LayoutGroupsMaterials extends Model {
	static table = 'layout_groups_materials';

	@field('id_layout_group') idLayoutGroup!: string;
	@field('material_number') materialNumber!: string;
	@field('sequence') sequence!: number;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default LayoutGroupsMaterials;
