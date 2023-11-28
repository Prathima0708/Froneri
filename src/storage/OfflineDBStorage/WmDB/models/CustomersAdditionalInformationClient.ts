
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersAdditionalInformationClient extends Model {
	static table = 'customers_additional_information_client';

	@field('customer_hierarchy_node') customerHierarchyNode!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('customer_hierarchy_level') customerHierarchyLevel!: number;
	@field('id_customer_business_reason_end') idCustomerBusinessReasonEnd!: string;
	@field('stop_buying_description') stopBuyingDescription!: string;
	@field('expected_turnover_1') expectedTurnover1!: number;
	@field('expected_turnover_2') expectedTurnover2!: number;
	@field('expected_turnover_3') expectedTurnover3!: number;
	@field('expected_turnover_4') expectedTurnover4!: number;
	@field('start_customer_business_datetime') startCustomerBusinessDatetime!: string;
	@field('id_customer_business_reason_start') idCustomerBusinessReasonStart!: number;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomersAdditionalInformationClient;
