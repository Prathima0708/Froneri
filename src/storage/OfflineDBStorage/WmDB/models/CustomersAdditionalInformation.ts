
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersAdditionalInformation extends Model {
	static table = 'customers_additional_information';

	@field('customer_hierarchy_node') customerHierarchyNode!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('customer_hierarchy_level') customerHierarchyLevel!: number;
	@field('ice_cream_delivery_contract') iceCreamDeliveryContract!: string;
	@field('ice_cream_delivery_contract_from_datetime') iceCreamDeliveryContractFromDatetime!: string;
	@field('ice_cream_delivery_contract_to_datetime') iceCreamDeliveryContractToDatetime!: string;
	@field('ice_cream_card_1_purchasing_date') iceCreamCard1PurchasingDate!: string;
	@field('ice_cream_card_2_purchasing_date') iceCreamCard2PurchasingDate!: string;
	@field('expected_turnover_1') expectedTurnover1!: number;
	@field('expected_turnover_2') expectedTurnover2!: number;
	@field('expected_turnover_3') expectedTurnover3!: number;
	@field('expected_turnover_4') expectedTurnover4!: number;
	@field('start_customer_business_datetime') startCustomerBusinessDatetime!: string;
	@field('id_customer_business_reason_start') idCustomerBusinessReasonStart!: number;
	@field('end_customer_business_datetime') endCustomerBusinessDatetime!: string;
	@field('id_customer_business_reason_end') idCustomerBusinessReasonEnd!: string;
	@field('no_order_confirmation') noOrderConfirmation!: string;
	@field('no_help_for_new_order') noHelpForNewOrder!: string;
	@field('take_over_ownership') takeOverOwnership!: string;
	@field('ice_cream_rebate') iceCreamRebate!: number;
	@field('po_necessary') poNecessary!: string;
	@field('po_number') poNumber!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomersAdditionalInformation;
