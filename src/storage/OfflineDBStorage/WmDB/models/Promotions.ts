
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Promotions extends Model {
	static table = 'promotions';

	@field('id_promotion') idPromotion!: number;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('type_promotion') typePromotion!: string;
	@field('begin_datetime') beginDatetime!: string;
	@field('end_datetime') endDatetime!: string;
	@field('status') status!: string;
	@field('quantity') quantity!: number;
	@field('amount') amount!: number;
	@field('offered_rebate') offeredRebate!: number;
	@field('free_quantity') freeQuantity!: number;
	@field('cumulative_effect') cumulativeEffect!: string;
	@field('reason_code') reasonCode!: number;
	@field('approver_employee_number') approverEmployeeNumber!: string;
	@field('application_relevant') applicationRelevant!: string;
	@field('coupon_code') couponCode!: string;
	@field('rebate_amount') rebateAmount!: number;
	@field('limitations') limitations!: number;
	@field('coupon_desc_mat_number') couponDescMatNumber!: string;
	@field('specific_to_sales_rep') specificToSalesRep!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default Promotions;
