
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class PromotionsMaterials extends Model {
	static table = 'promotions_materials';

	@field('id_promotion') idPromotion!: string;
	@field('material_number') materialNumber!: string;
	@field('basket') basket!: string;
	@field('source') source!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default PromotionsMaterials;
