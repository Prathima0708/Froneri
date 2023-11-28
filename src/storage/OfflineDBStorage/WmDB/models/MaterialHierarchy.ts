
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class MaterialHierarchy extends Model {
	static table = 'material_hierarchy';

	@field('material_hierarchy_node') materialHierarchyNode!: string;
	@field('level') level!: number;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default MaterialHierarchy;
