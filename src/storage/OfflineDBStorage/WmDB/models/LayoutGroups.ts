
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class LayoutGroups extends Model {
	static table = 'layout_groups';

	@field('id_layout_group') idLayoutGroup!: number;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('description_language_2') descriptionLanguage2!: string;
	@field('description_language_3') descriptionLanguage3!: string;
	@field('description_language_4') descriptionLanguage4!: string;
	@field('material_hierarchy_level') materialHierarchyLevel!: number;
	@field('id_customer_classification') idCustomerClassification!: string;
	@field('not_relevant_for_unused_group') notRelevantForUnusedGroup!: string;
	@field('claim_products_destroy_ta_relevant') claimProductsDestroyTaRelevant!: string;
	@field('trade_asset_classification') tradeAssetClassification!: string;
	@field('tess_mobile_relevant') tessMobileRelevant!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default LayoutGroups;
