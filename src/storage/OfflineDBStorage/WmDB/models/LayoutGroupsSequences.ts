
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class LayoutGroupsSequences extends Model {
	static table = 'layout_groups_sequences';

	@field('id_layout') idLayout!: string;
	@field('id_layout_group') idLayoutGroup!: string;
	@field('layout_column') layoutColumn!: number;
	@field('sequence') sequence!: number;
	@field('maximum_number_materials') maximumNumberMaterials!: number;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default LayoutGroupsSequences;
