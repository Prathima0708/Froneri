
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TaskEmployeeObjectives extends Model {
	static table = 'task_employee_objectives';

	@field('id_task') idTask!: string;
	@field('id_employee_objective') idEmployeeObjective!: number;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TaskEmployeeObjectives;
