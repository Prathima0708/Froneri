
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class PostalCodeTransShipmentPoints extends Model {
	static table = 'postal_code_trans_shipment_points';

	@field('country') country!: string;
	@field('postal_code') postalCode!: string;
	@field('tsp_number_ta_warehouse') tspNumberTaWarehouse!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default PostalCodeTransShipmentPoints;
