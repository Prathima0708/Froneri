
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersClaimsWorkflowClaimsData extends Model {
	static table = 'customers_claims_workflow_claims_data';

	@field('id_service_request_customer') idServiceRequestCustomer!: string;
	@field('id_customers_claims_workflow_claims_data') idCustomersClaimsWorkflowClaimsData!: number;
	@field('material_number') materialNumber!: string;
	@field('batch_code_or_delivery_date') batchCodeOrDeliveryDate!: string;
	@field('best_before_date') bestBeforeDate!: string;
	@field('best_before_date_time') bestBeforeDateTime!: string;
	@field('quantity_of_claimed_products') quantityOfClaimedProducts!: string;
	@field('quantity_of_claimed_products_sales_units') quantityOfClaimedProductsSalesUnits!: string;
	@field('reason_for_claim') reasonForClaim!: number;
	@field('condition_of_product') conditionOfProduct!: number;
	@field('description_claim_reason') descriptionClaimReason!: string;
	@field('claimed_products_available') claimedProductsAvailable!: string;
	@field('foreign_product_available') foreignProductAvailable!: string;
	@field('feedback_requested_from_customer') feedbackRequestedFromCustomer!: string;
	@field('claim_settlement_product_type') claimSettlementProductType!: string;
	@field('equipment_number') equipmentNumber!: string;
	@field('net_amount') netAmount!: number;
	@field('sent_datetime') sentDatetime!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomersClaimsWorkflowClaimsData;
