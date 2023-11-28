import BaseRepo from './BaseRepo';
import RebateTrackerRebateFinancialConditions from 'src/storage/OfflineDBStorage/WmDB/models/RebateTrackerRebateFinancialConditions';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';

const ENTITY = OFFLINE_STORAGE.MODEL.REBATETRACKER_REBATE_FINANCIAL_CONDITIONS;

export class RebateTrackerRebateFinancialConditionsRepo extends BaseRepo<RebateTrackerRebateFinancialConditions> {
  /**
   * Function returns level one contracts data
   * @returns
   */
  async getContractsLevelOneData() {
    const collection = this.getCollection(ENTITY);
    const customerInfo: any = await this.getCLCustomerInfo();
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';

    const QUERY =
      'select distinct contract_number as contractNumber,' +
      'contract_start_date as contractStartDate,' +
      'contract_end_date as contractEndDate,' +
      'condition_description as conditionDescription,' +
      'condition_id as conditionID, ' +
      'target_customer as targetCustomer,' +
      'bonus_customer as bonusCustomer,' +
      'contract_type as contractType, target_value as targetValue from ' +
      'rebatetracker_rebate_financial_conditions ' +
      'where customer_ship_to = ? and ' +
      "strftime('%Y-%m-%d', contract_end_date) >= strftime('%Y-%m-%d', 'now')";

    const VALUES = [customerShipTo];
    // const VALUES = ['0020305590'];

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY, VALUES))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns level two contracts data
   * @returns
   */
  async getContractsLevelTwoData(contractNumber: string) {
    const collection = this.getCollection(ENTITY);
    const customerInfo: any = await this.getCLCustomerInfo();
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';

    const QUERY =
      'select contract_number as contractNumber, scale_template as scaleTemplate, ' +
      'contract_start_date as contractStartDate,' +
      'contract_end_date as contractEndDate,' +
      'condition_description as conditionDescription,' +
      'target_customer as targetCustomer,' +
      'bonus_customer as bonusCustomer,' +
      'contract_type as contractType, target_value as targetValue, ' +
      'condition_start_date as conditionStartDate, ' +
      'condition_end_date as conditionEndDate, ' +
      'target_product_group as targetProductGroup, ' +
      'bonus_product_group as bonusProductGroup, ' +
      "case when bonus_value_type = 'P' then " +
      'expected_accrual_value else ' +
      'expected_accrual_value ' +
      'end as expectedAccrualValue, target_value_start as targetValueStart, ' +
      "target_value_end as targetValueEnd, case when bonus_value_type = 'P' then " +
      'bonus_factor else ' +
      'bonus_factor end as bonusFactor, ' +
      'initial_finance_amount as initialFinanceAmount, penalty, ' +
      'contract_id as contractID, condition_id as conditionID ' +
      'from rebatetracker_rebate_financial_conditions ' +
      'where customer_ship_to = ? and ' +
      "strftime('%Y-%m-%d', contract_end_date) >= strftime('%Y-%m-%d', 'now') " +
      'and contract_number = ? ' +
      'order by condition_end_date, condition_id, ' +
      'contract_id, target_value_start';

    const VALUES = [customerShipTo, contractNumber];
    // const VALUES = ['0020305590', contractNumber];

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY, VALUES))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }
}
