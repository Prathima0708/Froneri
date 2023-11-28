
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class StorageLocations extends Model {
	static table = 'storage_locations';

	@field('tsp_number') tspNumber!: string;
	@field('storage_location') storageLocation!: string;
	@field('description') description!: string;
	@field('trade_asset') tradeAsset!: string;
	@field('short_description') shortDescription!: string;
	@field('trade_asset_accessories') tradeAssetAccessories!: string;
	@field('trade_asset_pickup') tradeAssetPickup!: string;
	@field('posm_pickup') posmPickup!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default StorageLocations;
