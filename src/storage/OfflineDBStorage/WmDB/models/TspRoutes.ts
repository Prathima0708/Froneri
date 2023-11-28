
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TspRoutes extends Model {
	static table = 'tsp_routes';

	@field('route') route!: string;
	@field('order_taking_cut_off_time') orderTakingCutOffTime!: string;
	@field('route_planning_cut_off_time') routePlanningCutOffTime!: string;
	@field('delivery_lead_time') deliveryLeadTime!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TspRoutes;
