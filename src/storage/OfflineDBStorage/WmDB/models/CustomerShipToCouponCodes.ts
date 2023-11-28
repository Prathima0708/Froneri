
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomerShipToCouponCodes extends Model {
	static table = 'customer_ship_to_coupon_codes';

	@field('id_promotion') idPromotion!: string;
	@field('customer_ship_to') customerShipTo!: string;
	@field('coupon_code') couponCode!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_ondatetime') lastSyncOndatetime!: number;
}

export default CustomerShipToCouponCodes;
