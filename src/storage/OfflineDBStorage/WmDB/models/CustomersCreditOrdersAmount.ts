
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersCreditOrdersAmount extends Model {
	static table = 'customers_credit_orders_amount';

	@field('customer_ship_to') customerShipTo!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('condition_agreement_number') conditionAgreementNumber!: string;
	@field('credit_order_amount') creditOrderAmount!: number;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomersCreditOrdersAmount;
