
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class LayoutGroupsMaterialHierarchies extends Model {
	static table = 'layout_groups_material_hierarchies';

	@field('id_layout_group') idLayoutGroup!: string;
	@field('material_hierarchy_node') materialHierarchyNode!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default LayoutGroupsMaterialHierarchies;
