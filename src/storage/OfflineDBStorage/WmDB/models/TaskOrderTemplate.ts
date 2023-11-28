
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TaskOrderTemplate extends Model {
	static table = 'task_order_template';

	@field('id_task') idTask!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TaskOrderTemplate;
