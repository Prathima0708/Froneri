
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersShipToPromotions extends Model {
	static table = 'customers_ship_to_promotions';

	@field('customer_ship_to') customerShipTo!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('id_promotion') idPromotion!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomersShipToPromotions;
