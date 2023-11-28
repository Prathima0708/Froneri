
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class DiscoveryTradeAssets extends Model {
	static table = 'discovery_trade_assets';

	@field('discovery_id') discoveryId!: string;
	@field('ta_loan_agreement_number') taLoanAgreementNumber!: string;
	@field('signature_employee') signatureEmployee!: number;
	@field('signature_customer') signatureCustomer!: number;
	@field('creation_employee_number') creationEmployeeNumber!: string;
	@field('creation_datetime') creationDatetime!: string;
	@field('ta_status') taStatus!: string;
	@field('yambs_status') yambsStatus!: string;
	@field('deleted') deleted!: string;
	@field('file_name') fileName!: string;
	@field('justification') justification!: string;
	@field('ta_signed_datetime') taSignedDatetime!: string;
	@field('ta_process') taProcess!: string;
	@field('id_order') idOrder!: string;
	@field('update_employee_number') updateEmployeeNumber!: string;
	@field('update_datetime') updateDatetime!: string;
	@field('sent_datetime') sentDatetime!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default DiscoveryTradeAssets;
