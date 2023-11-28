
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class OrderLinesFreeGoods extends Model {
	static table = 'order_lines_free_goods';

	@field('id_order') idOrder!: string;
	@field('id_order_line') idOrderLine!: number;
	@field('free_good_material_number') freeGoodMaterialNumber!: string;
	@field('free_good_quantity') freeGoodQuantity!: number;
	@field('free_good_sales_unit') freeGoodSalesUnit!: string;
	@field('free_good_valid_from_date_time') freeGoodValidFromDateTime!: string;
	@field('free_good_valid_to_date_time') freeGoodValidToDateTime!: string;
	@field('free_good_knumh') freeGoodKnumh!: string;
	@field('free_good_vakey') freeGoodVakey!: string;
	@field('free_good_calculation_type') freeGoodCalculationType!: string;
	@field('free_good_category') freeGoodCategory!: string;
	@field('free_good_condition_type') freeGoodConditionType!: string;
	@field('free_good_net_weight') freeGoodNetWeight!: number;
	@field('free_good_gross_weight') freeGoodGrossWeight!: number;
	@field('free_good_plant_number') freeGoodPlantNumber!: string;
	@field('free_good_storage_location') freeGoodStorageLocation!: string;
	@field('free_good_reduced_stock_date') freeGoodReducedStockDate!: string;
	@field('free_good_reduced_stock_quantity') freeGoodReducedStockQuantity!: string;
	@field('free_good_reduced_stock_sales_unit') freeGoodReducedStockSalesUnit!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default OrderLinesFreeGoods;
