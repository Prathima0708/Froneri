import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class RebateTrackerRebateFinancialConditions extends Model {
  static table = 'rebatetracker_rebate_financial_conditions';

  @field('contract_type') contractType!: string;
  @field('contract_sub_type') contractSubType!: string;
  @field('contract_id') contractId!: string;
  @field('condition_id') conditionId!: string;
  @field('target_value_start') targetValueStart!: number;
  @field('target_value_end') targetValueEnd!: number;
  @field('contract_number') contractNumber!: string;
  @field('customer_ship_to') customerShipTo!: string;
  @field('contract_start_date') contractStartDate!: string;
  @field('contract_end_date') contractEndDate!: string;
  @field('condition_description') conditionDescription!: string;
  @field('condition_start_date') conditionStartDate!: string;
  @field('condition_end_date') conditionEndDate!: string;
  @field('target_product_group') targetProductGroup!: string;
  @field('bonus_product_group') bonusProductGroup!: string;
  @field('expected_accrual_value') expectedAccrualValue!: number;
  @field('initial_finance_amount') initialFinanceAmount!: number;
  @field('bonus_factor') bonusFactor!: number;
  @field('bonus_value_type') bonusValueType!: string;
  @field('scale_template') scaleTemplate!: string;
  @field('target_customer') targetCustomer!: string;
  @field('bonus_customer') bonusCustomer!: string;
  @field('target_value') targetValue!: number;
  @field('penalty') penalty!: number;
  @field('data_origin') dataOrigin!: string;
  @field('last_sync_on') lastSyncOn!: string;
}

export default RebateTrackerRebateFinancialConditions;
