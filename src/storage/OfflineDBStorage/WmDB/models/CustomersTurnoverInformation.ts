
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersTurnoverInformation extends Model {
	static table = 'customers_turnover_information';

	@field('customer_ship_to') customerShipTo!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('total_last_year') totalLastYear!: number;
	@field('total_ytd_current_year') totalYtdCurrentYear!: number;
	@field('total_ytd_last_year') totalYtdLastYear!: number;
	@field('total_difference') totalDifference!: number;
	@field('ice_total_last_year') iceTotalLastYear!: number;
	@field('ice_ytd_current_year') iceYtdCurrentYear!: number;
	@field('ice_ytd_last_year') iceYtdLastYear!: number;
	@field('ice_difference') iceDifference!: number;
	@field('frozen_bakery_total_last_year') frozenBakeryTotalLastYear!: number;
	@field('frozen_bakery_ytd_current_year') frozenBakeryYtdCurrentYear!: number;
	@field('frozen_bakery_ytd_last_year') frozenBakeryYtdLastYear!: number;
	@field('frozen_bakery_difference') frozenBakeryDifference!: number;
	@field('frozen_food_total_last_year') frozenFoodTotalLastYear!: number;
	@field('frozen_food_ytd_current_year') frozenFoodYtdCurrentYear!: number;
	@field('frozen_food_ytd_last_year') frozenFoodYtdLastYear!: number;
	@field('frozen_food_difference') frozenFoodDifference!: number;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomersTurnoverInformation;
