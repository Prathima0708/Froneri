
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class ItemProposals extends Model {
	static table = 'item_proposals';

	@field('id_item_proposal') idItemProposal!: number;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('status') status!: string;
	@field('begin_datetime') beginDatetime!: string;
	@field('end_datetime') endDatetime!: string;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('update_datetime') updateDatetime!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default ItemProposals;
