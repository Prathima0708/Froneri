
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class ContractType extends Model {
	static table = 'contract_type';

	@field('id_contract_type') idContractType!: number;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('country_code') countryCode!: string;
	@field('template_name') templateName!: string;
	@field('file_share_path') fileSharePath!: string;
	@field('email_address') emailAddress!: string;
	@field('signature_required') signatureRequired!: string;
	@field('cc_email_address') ccEmailAddress!: string;
	@field('opentext_relevant') opentextRelevant!: string;
	@field('html_template') htmlTemplate!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default ContractType;
