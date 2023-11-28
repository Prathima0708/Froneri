
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class FreeGoodsHeader extends Model {
	static table = 'free_goods_header';

	@field('knumh') knumh!: string;
	@field('vakey') vakey!: string;
	@field('condition_table') conditionTable!: number;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('customer_hierarchy_node') customerHierarchyNode!: string;
	@field('material_number') materialNumber!: string;
	@field('campaign') campaign!: string;
	@field('condition_type') conditionType!: string;
	@field('valid_from_datetime') validFromDatetime!: string;
	@field('valid_to_datetime') validToDatetime!: string;
	@field('minimum_quantity') minimumQuantity!: number;
	@field('free_goods_quantity') freeGoodsQuantity!: number;
	@field('unit_for_minimum_and_free_goods_quantity') unitForMinimumAndFreeGoodsQuantity!: string;
	@field('additional_quantity') additionalQuantity!: number;
	@field('unit_for_additional_quantity') unitForAdditionalQuantity!: string;
	@field('material_number_free_good') materialNumberFreeGood!: string;
	@field('calculation_type') calculationType!: string;
	@field('free_good_category') freeGoodCategory!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default FreeGoodsHeader;
