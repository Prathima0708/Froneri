
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TerritoriesCustomers extends Model {
	static table = 'territories_customers';

	@field('customer_ship_to') customerShipTo!: string;
	@field('id_territory') idTerritory!: string;
	@field('partner_function') partnerFunction!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TerritoriesCustomers;
