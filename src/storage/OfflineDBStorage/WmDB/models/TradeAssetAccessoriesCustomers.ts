
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TradeAssetAccessoriesCustomers extends Model {
	static table = 'trade_asset_accessories_customers';

	@field('customer_ship_to') customerShipTo!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('material_number') materialNumber!: string;
	@field('type') type!: string;
	@field('quantity') quantity!: number;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TradeAssetAccessoriesCustomers;
