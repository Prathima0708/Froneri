
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class DiscoveryTradeAssetsChargeOff extends Model {
	static table = 'discovery_trade_assets_charge_off';

	@field('discovery_id') discoveryId!: string;
	@field('ta_loan_agreement_number') taLoanAgreementNumber!: string;
	@field('material_number') materialNumber!: string;
	@field('serial_number') serialNumber!: string;
	@field('ta_charge_off_status') taChargeOffStatus!: string;
	@field('residual_value') residualValue!: number;
	@field('const_date') constDate!: string;
	@field('sent_datetime') sentDatetime!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default DiscoveryTradeAssetsChargeOff;
