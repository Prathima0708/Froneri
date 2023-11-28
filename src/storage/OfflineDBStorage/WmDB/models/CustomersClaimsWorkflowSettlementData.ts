import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersClaimsWorkflowSettlementData extends Model {
  static table = 'customers_claims_workflow_settlement_data';

  @field('id_service_request_customer') idServiceRequestCustomer!: string;
  @field('id_customers_claims_workflow_settlement_data')
  idCustomersClaimsWorkflowSettlementData!: number;
  @field('minor_damage') minorDamage!: string;
  @field('free_good_number') freeGoodNumber!: string;
  @field('free_good_quantity') freeGoodQuantity!: number;
  @field('free_good_quantity_sales_units') freeGoodQuantitySalesUnits!: string;
  @field('free_good_value') freeGoodValue!: number;
  @field('free_good_approver') freeGoodApprover!: string;
  @field('claim_id') claimId!: string;
  @field('priority') priority!: number;
  @field('quality_team_answer_date') qualityTeamAnswerDate!: string;
  @field('reply_letter_to_customer') replyLetterToCustomer!: string;
  @field('products_destroyed') productsDestroyed!: string;
  @field('customer_destruction_info_date') customerDestructionInfoDate!: string;
  @field('product_pickup_necessary') productPickupNecessary!: string;
  @field('product_pickup_date') productPickupDate!: string;
  @field('settlement_type') settlementType!: string;
  @field('settlement_done_by') settlementDoneBy!: string;
  @field('ta_report_request_date') taReportRequestDate!: string;
  @field('ta_service_technician_request_date')
  taServiceTechnicianRequestDate!: string;
  @field('rdc_number') rdcNumber!: string;
  @field('net_value_of_product_destroyed') netValueOfProductDestroyed!: string;
  @field('refund_percentage') refundPercentage!: string;
  @field('defect_status') defectStatus!: string;
  @field('settlement_status') settlementStatus!: string;
  @field('notes') notes!: string;
  @field('sent_datetime') sentDatetime!: string;
  @field('data_origin') dataOrigin!: string;
  @field('last_sync_on') lastSyncOn!: string;
}

export default CustomersClaimsWorkflowSettlementData;
