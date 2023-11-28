
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class SpecialRoutes extends Model {
	static table = 'special_routes';

	@field('tsp_number') tspNumber!: string;
	@field('special_route') specialRoute!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default SpecialRoutes;
