
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersFinancialInformation extends Model {
	static table = 'customers_financial_information';

	@field('customer_ship_to') customerShipTo!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('customer_payer') customerPayer!: string;
	@field('credit_limit') creditLimit!: string;
	@field('credit_blocked') creditBlocked!: string;
	@field('open_delivery_credit_value') openDeliveryCreditValue!: number;
	@field('credit_limit_used') creditLimitUsed!: number;
	@field('risk_category') riskCategory!: string;
	@field('vat_registration_number_encrypted') vatRegistrationNumberEncrypted!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomersFinancialInformation;
