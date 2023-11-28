
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class SalesTeams extends Model {
	static table = 'sales_teams';

	@field('id_sales_team') idSalesTeam!: number;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default SalesTeams;
