
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class DiscoveryNewTradeAssetsWished extends Model {
	static table = 'discovery_new_trade_assets_wished';

	@field('discovery_id') discoveryId!: string;
	@field('ta_loan_agreement_number') taLoanAgreementNumber!: string;
	@field('ta_description') taDescription!: string;
	@field('material_number') materialNumber!: string;
	@field('quantity') quantity!: number;
	@field('expected_turnover') expectedTurnover!: number;
	@field('design') design!: string;
	@field('price_tag') priceTag!: number;
	@field('sequence') sequence!: number;
	@field('sent_datetime') sentDatetime!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default DiscoveryNewTradeAssetsWished;
