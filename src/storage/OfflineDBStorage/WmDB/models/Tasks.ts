
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Tasks extends Model {
	static table = 'tasks';

	@field('id_task') idTask!: string;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('valid_from_datetime') validFromDatetime!: string;
	@field('valid_to_datetime') validToDatetime!: string;
	@field('status') status!: string;
	@field('type') type!: string;
	@field('additional_note') additionalNote!: string;
	@field('show_historical_answers') showHistoricalAnswers!: string;
	@field('creation_employee_number') creationEmployeeNumber!: string;
	@field('creation_datetime') creationDatetime!: string;
	@field('category') category!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default Tasks;
