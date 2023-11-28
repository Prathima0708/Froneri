
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class LayoutColorsFonts extends Model {
	static table = 'layout_colors_fonts';

	@field('layout_version') layoutVersion!: string;
	@field('layout_type') layoutType!: string;
	@field('layout_sub_type') layoutSubType!: string;
	@field('layout_object') layoutObject!: string;
	@field('layout_resolution_x') layoutResolutionX!: string;
	@field('layout_parameter') layoutParameter!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default LayoutColorsFonts;
