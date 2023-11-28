
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TaskSalesTeams extends Model {
	static table = 'task_sales_teams';

	@field('id_task') idTask!: string;
	@field('id_sales_team') idSalesTeam!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TaskSalesTeams;
