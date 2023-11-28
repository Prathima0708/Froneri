
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class DiscoverySepa extends Model {
	static table = 'discovery_sepa';

	@field('discovery_id') discoveryId!: string;
	@field('sepa_agreement_number') sepaAgreementNumber!: string;
	@field('account_holder_name') accountHolderName!: string;
	@field('bank_name') bankName!: string;
	@field('iban') iban!: string;
	@field('bic') bic!: string;
	@field('mandate_reference_number') mandateReferenceNumber!: string;
	@field('sepa_status') sepaStatus!: string;
	@field('sepa_signed_datetime') sepaSignedDatetime!: string;
	@field('creation_employee_number') creationEmployeeNumber!: string;
	@field('creation_datetime') creationDatetime!: string;
	@field('file_name') fileName!: string;
	@field('signature_customer') signatureCustomer!: number;
	@field('form_type') formType!: string;
	@field('update_employee_number') updateEmployeeNumber!: string;
	@field('update_datetime') updateDatetime!: string;
	@field('sent_datetime') sentDatetime!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default DiscoverySepa;
