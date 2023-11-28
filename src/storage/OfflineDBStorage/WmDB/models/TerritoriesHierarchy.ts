
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TerritoriesHierarchy extends Model {
	static table = 'territories_hierarchy';

	@field('id_territory') idTerritory!: string;
	@field('id_territory_parent') idTerritoryParent!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TerritoriesHierarchy;
