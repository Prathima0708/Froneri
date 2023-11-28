
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class StocksAtpFinishedProducts extends Model {
	static table = 'stocks_atp_finished_products';

	@field('material_number') materialNumber!: string;
	@field('plant_number') plantNumber!: string;
	@field('storage_location') storageLocation!: string;
	@field('stocks_datetime') stocksDatetime!: string;
	@field('quantity') quantity!: string;
	@field('sales_unit') salesUnit!: string;
	@field('replenishment_calendar_maintained') replenishmentCalendarMaintained!: string;
	@field('key_value') keyValue!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default StocksAtpFinishedProducts;
