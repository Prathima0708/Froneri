
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class QuestionAnswers extends Model {
	static table = 'question_answers';

	@field('id_answer') idAnswer!: string;
	@field('id_question') idQuestion!: string;
	@field('answer_description_language_1') answerDescriptionLanguage1!: string;
	@field('sequence') sequence!: number;
	@field('url_sales_material') urlSalesMaterial!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default QuestionAnswers;
