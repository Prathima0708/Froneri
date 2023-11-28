
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class OrderTypes extends Model {
	static table = 'order_types';

	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('order_type') orderType!: string;
	@field('customer_pricing_procedure') customerPricingProcedure!: string;
	@field('pricing_procedure') pricingProcedure!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default OrderTypes;
