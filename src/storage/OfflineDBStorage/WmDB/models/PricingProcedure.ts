import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class PricingProcedure extends Model {
  static table = 'pricing_procedure';

  @field('step') step!: number;
  @field('description') description!: string;
  @field('condition_type') conditionType!: string;
  @field('access_sequence') accessSequence!: string;
  @field('operation') operation!: string;
  @field('step_to_apply') stepToApply!: number;
  @field('formula') formula!: string;
  @field('value_type') valueType!: string;
  @field('logistic_surcharge') logisticSurcharge!: string;
  @field('vat') vat!: string;
  @field('net_price') netPrice!: string;
  @field('reference_price') referencePrice!: string;
  @field('ttc_price') ttcPrice!: string;
  @field('nps_price') npsPrice!: string;
  @field('listed_pricing') listedPricing!: string;
  @field('pricing_procedure') pricingProcedure!: string;
  @field('calculation') calculation!: string;
  @field('manual_rebate') manualRebate!: string;
  @field('delivery_overcost_non_full_case')
  deliveryOvercostNonFullCase!: string;
  @field('blocked_price_percentage') blockedPricePercentage!: string;
  @field('blocked_price_value') blockedPriceValue!: string;
  @field('exclusion_for_blocked_price') exclusionForBlockedPrice!: string;
  @field('spot_price_regular_material') spotPriceRegularMaterial!: string;
  @field('spot_price_opportunity_material')
  spotPriceOpportunityMaterial!: string;
  @field('manual_scale_condition_type') manualScaleConditionType!: string;
  @field('pricing_sequence_color') pricingSequenceColor!: number;
  @field('pricing_background_color') pricingBackgroundColor!: string;
  @field('pricing_foreground_color') pricingForegroundColor!: string;
  @field('manual_scale_condition_value') manualScaleConditionValue!: string;
  @field('markup_price_condition_type') markupPriceConditionType!: string;
  @field('saa_manual_rebate') saaManualRebate!: string;
  @field('saa_manual_scale_condition_type')
  saaManualScaleConditionType!: string;
  @field('saa_logistic_surcharge') saaLogisticSurcharge!: string;

  @field('data_origin') dataOrigin!: string;
  @field('last_sync_on') lastSyncOn!: string;
}

export default PricingProcedure;
