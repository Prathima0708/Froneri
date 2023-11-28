
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CatrinAlternativeRoutes extends Model {
	static table = 'catrin_alternative_routes';

	@field('customer_ship_to') customerShipTo!: string;
	@field('plant_number') plantNumber!: string;
	@field('delivery_route_monday') deliveryRouteMonday!: string;
	@field('time1_monday') time1Monday!: string;
	@field('cost_kms_monday') costKmsMonday!: number;
	@field('cost_time_monday') costTimeMonday!: number;
	@field('delivery_route_tuesday') deliveryRouteTuesday!: string;
	@field('time1_tuesday') time1Tuesday!: string;
	@field('cost_kms_tuesday') costKmsTuesday!: number;
	@field('cost_time_tuesday') costTimeTuesday!: number;
	@field('delivery_route_wednesday') deliveryRouteWednesday!: string;
	@field('time1_wednesday') time1Wednesday!: string;
	@field('cost_kms_wednesday') costKmsWednesday!: number;
	@field('cost_time_wednesday') costTimeWednesday!: number;
	@field('delivery_route_thursday') deliveryRouteThursday!: string;
	@field('time1_thursday') time1Thursday!: string;
	@field('cost_kms_thursday') costKmsThursday!: number;
	@field('cost_time_thursday') costTimeThursday!: number;
	@field('delivery_route_friday') deliveryRouteFriday!: string;
	@field('time1_friday') time1Friday!: string;
	@field('cost_kms_friday') costKmsFriday!: number;
	@field('cost_time_friday') costTimeFriday!: number;
	@field('delivery_route_saturday') deliveryRouteSaturday!: string;
	@field('delivery_route_sunday') deliveryRouteSunday!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CatrinAlternativeRoutes;
