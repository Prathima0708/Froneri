
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TextsOrders extends Model {
	static table = 'texts_orders';

	@field('id_call_center') idCallCenter!: number;
	@field('text_type') textType!: string;
	@field('sequence') sequence!: number;
	@field('text') text!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TextsOrders;
