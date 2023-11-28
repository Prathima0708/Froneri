
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TradeAssetsContractTemplates extends Model {
	static table = 'trade_assets_contract_templates';

	@field('id_contract_type') idContractType!: string;
	@field('template_name') templateName!: string;
	@field('template_file_name') templateFileName!: string;
	@field('country_code') countryCode!: string;
	@field('language') language!: string;
	@field('template_source_path') templateSourcePath!: string;
	@field('file_share_path') fileSharePath!: string;
	@field('customer_type') customerType!: string;
	@field('abc_classification') abcClassification!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TradeAssetsContractTemplates;
