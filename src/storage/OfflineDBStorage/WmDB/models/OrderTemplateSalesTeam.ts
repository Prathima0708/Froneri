
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class OrderTemplateSalesTeam extends Model {
	static table = 'order_template_sales_team';

	@field('id_order_template') idOrderTemplate!: string;
	@field('sales_team_id') salesTeamId!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default OrderTemplateSalesTeam;
