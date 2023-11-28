
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TaskEmployees extends Model {
	static table = 'task_employees';

	@field('id_task') idTask!: string;
	@field('employee_number') employeeNumber!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TaskEmployees;
