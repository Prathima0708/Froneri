
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TaskExecutionAnswers extends Model {
	static table = 'task_execution_answers';

	@field('id_task_execution') idTaskExecution!: string;
	@field('id_task') idTask!: string;
	@field('id_question') idQuestion!: string;
	@field('id_answer') idAnswer!: string;
	@field('answer_note') answerNote!: string;
	@field('mm_file_name') mmFileName!: string;
	@field('updated_employee_number') updatedEmployeeNumber!: string;
	@field('updated_datetime') updatedDatetime!: string;
	@field('status') status!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TaskExecutionAnswers;
