
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class DiscoveryAgreementRequests extends Model {
	static table = 'discovery_agreement_requests';

	@field('discovery_id') discoveryId!: string;
	@field('id_agreement_request') idAgreementRequest!: string;
	@field('agreement_number') agreementNumber!: string;
	@field('requested_agreement_type') requestedAgreementType!: string;
	@field('requested_status') requestedStatus!: string;
	@field('requested_by') requestedBy!: string;
	@field('requested_datetime') requestedDatetime!: string;
	@field('expected_turnover_1') expectedTurnover1!: number;
	@field('expected_turnover_2') expectedTurnover2!: number;
	@field('expected_turnover_3') expectedTurnover3!: number;
	@field('processed_datetime') processedDatetime!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default DiscoveryAgreementRequests;
