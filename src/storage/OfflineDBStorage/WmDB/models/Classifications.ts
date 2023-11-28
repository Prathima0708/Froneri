
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Classifications extends Model {
	static table = 'classifications';

	@field('id_customer_classification') idCustomerClassification!: number;
	@field('classification_type') classificationType!: string;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('display_tooltip_for_leader_products') displayTooltipForLeaderProducts!: string;
	@field('maximum_allowed_rebate') maximumAllowedRebate!: number;
	@field('overcost_value') overcostValue!: number;
	@field('overcost_minimum_amount') overcostMinimumAmount!: number;
	@field('item_proposal_type') itemProposalType!: string;
	@field('require_rebate_condition_type_on_material') requireRebateConditionTypeOnMaterial!: string;
	@field('website') website!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default Classifications;
