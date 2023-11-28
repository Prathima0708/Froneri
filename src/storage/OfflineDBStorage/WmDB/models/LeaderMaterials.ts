import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class LeaderMaterials extends Model {
  static table = 'leader_materials';

  @field('id_customer_classification_1') idCustomerClassification1!: number;
  @field('material_number') materialNumber!: string;
  @field('sales_organization') salesOrganization!: string;
  @field('distribution_channel') distributionChannel!: string;
  @field('begin_datetime') beginDatetime!: string;
  @field('end_datetime') endDatetime!: string;
  @field('one_time_telesales_prime') oneTimeTelesalesPrime!: number;
  @field('one_time_rebate') oneTimeRebate!: number;
  @field('list_number') listNumber!: number;
  @field('sequence') sequence!: number;
  @field('validity_period_history') validityPeriodHistory!: string;
  @field('one_time_telesales_prime_cumulative')
  oneTimeTelesalesPrimeCumulative!: string;
  @field('one_time_telesales_prime_limit') oneTimeTelesalesPrimeLimit!: number;
  @field('specific_text_description') specificTextDescription!: string;
  @field('industry_code') industryCode!: string;
  @field('data_origin') dataOrigin!: string;
  @field('last_sync_on') lastSyncOn!: string;
}

export default LeaderMaterials;
