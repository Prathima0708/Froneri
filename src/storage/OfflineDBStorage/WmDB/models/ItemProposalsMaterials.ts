
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class ItemProposalsMaterials extends Model {
	static table = 'item_proposals_materials';

	@field('id_item_proposal') idItemProposal!: string;
	@field('material_number') materialNumber!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default ItemProposalsMaterials;
