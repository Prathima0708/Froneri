
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class SeasonstartOrderDetails extends Model {
	static table = 'seasonstart_order_details';

	@field('id_order') idOrder!: string;
	@field('material_number') materialNumber!: string;
	@field('customer_price') customerPrice!: number;
	@field('sent_datetime') sentDatetime!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default SeasonstartOrderDetails;
