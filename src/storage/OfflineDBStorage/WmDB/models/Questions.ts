
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Questions extends Model {
	static table = 'questions';

	@field('id_question') idQuestion!: string;
	@field('question_type') questionType!: number;
	@field('question_description_language_1') questionDescriptionLanguage1!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default Questions;
