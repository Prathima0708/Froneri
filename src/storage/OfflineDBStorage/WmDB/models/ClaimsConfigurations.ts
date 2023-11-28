
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class ClaimsConfigurations extends Model {
	static table = 'claims_configurations';

	@field('claim_code') claimCode!: number;
	@field('claims_config_code') claimsConfigCode!: string;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default ClaimsConfigurations;
