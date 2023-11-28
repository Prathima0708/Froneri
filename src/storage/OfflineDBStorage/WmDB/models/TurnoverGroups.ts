
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TurnoverGroups extends Model {
	static table = 'turnover_groups';

	@field('id_turnover_group') idTurnoverGroup!: number;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('reporting_turnover_type') reportingTurnoverType!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TurnoverGroups;
