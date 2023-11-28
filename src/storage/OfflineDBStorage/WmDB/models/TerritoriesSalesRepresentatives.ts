
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TerritoriesSalesRepresentatives extends Model {
	static table = 'territories_sales_representatives';

	@field('partner_number') partnerNumber!: string;
	@field('id_territory') idTerritory!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TerritoriesSalesRepresentatives;
