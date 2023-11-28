
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Territories extends Model {
	static table = 'territories';

	@field('id_territory') idTerritory!: string;
	@field('name') name!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default Territories;
