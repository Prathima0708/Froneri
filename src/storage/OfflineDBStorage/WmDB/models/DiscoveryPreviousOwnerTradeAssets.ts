
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class DiscoveryPreviousOwnerTradeAssets extends Model {
	static table = 'discovery_previous_owner_trade_assets';

	@field('discovery_id') discoveryId!: string;
	@field('ta_loan_agreement_number') taLoanAgreementNumber!: string;
	@field('id_service_request_customer') idServiceRequestCustomer!: string;
	@field('material_number') materialNumber!: string;
	@field('serial_number') serialNumber!: string;
	@field('too') too!: string;
	@field('expected_turnover') expectedTurnover!: number;
	@field('follow_up_action') followUpAction!: string;
	@field('previous_customer_ship_to') previousCustomerShipTo!: string;
	@field('previous_customer_sales_organization') previousCustomerSalesOrganization!: string;
	@field('previous_customer_distribution_channel') previousCustomerDistributionChannel!: string;
	@field('price_tag') priceTag!: number;
	@field('sent_datetime') sentDatetime!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default DiscoveryPreviousOwnerTradeAssets;
