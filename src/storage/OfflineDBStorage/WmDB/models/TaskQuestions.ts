
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TaskQuestions extends Model {
	static table = 'task_questions';

	@field('id_task') idTask!: string;
	@field('id_question') idQuestion!: string;
	@field('id_parent_question') idParentQuestion!: string;
	@field('id_parent_answer') idParentAnswer!: string;
	@field('sequence') sequence!: number;
	@field('is_mandatory') isMandatory!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TaskQuestions;
