
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class SalesOfficeTradeAssetPlants extends Model {
	static table = 'sales_office_trade_asset_plants';

	@field('sales_office_code') salesOfficeCode!: string;
	@field('rdc_number') rdcNumber!: string;
	@field('trade_asset_default_plant') tradeAssetDefaultPlant!: string;
	@field('trade_asset_route_type') tradeAssetRouteType!: string;
	@field('trade_asset_dedicated_route') tradeAssetDedicatedRoute!: string;
	@field('posm_default_plant') posmDefaultPlant!: string;
	@field('posm_route_type') posmRouteType!: string;
	@field('posm_dedicated_route') posmDedicatedRoute!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default SalesOfficeTradeAssetPlants;
