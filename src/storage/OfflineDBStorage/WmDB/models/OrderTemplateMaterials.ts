
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class OrderTemplateMaterials extends Model {
	static table = 'order_template_materials';

	@field('id_order_template') idOrderTemplate!: string;
	@field('material_number') materialNumber!: string;
	@field('service_team_relevant') serviceTeamRelevant!: string;
	@field('suggested_price') suggestedPrice!: number;
	@field('sequence') sequence!: number;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default OrderTemplateMaterials;
