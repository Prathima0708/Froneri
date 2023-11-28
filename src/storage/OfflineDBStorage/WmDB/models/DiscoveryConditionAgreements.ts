import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class DiscoveryConditionAgreements extends Model {
  static table = 'discovery_condition_agreements';

  @field('discovery_id') discoveryId!: string;
  @field('condition_agreement_number') conditionAgreementNumber!: string;
  @field('ice_start_date') iceStartDate!: string;
  @field('ice_end_date') iceEndDate!: string;
  @field('ice_conditions') iceConditions!: string;
  @field('frozenfood_start_date') frozenfoodStartDate!: string;
  @field('frozenfood_end_date') frozenfoodEndDate!: string;
  @field('frozenfood_conditions') frozenfoodConditions!: string;
  @field('justification') justification!: string;
  @field('creation_employee_number') creationEmployeeNumber!: string;
  @field('creation_datetime') creationDatetime!: string;
  @field('conditions_status') conditionsStatus!: string;
  @field('yambs_status') yambsStatus!: string;
  @field('deleted') deleted!: string;
  @field('file_name') fileName!: string;
  @field('conditions_signed_datetime') conditionsSignedDatetime!: string;
  @field('signature_customer') signatureCustomer!: number;
  @field('signature_employee') signatureEmployee!: number;
  @field('id_contract_type') idContractType!: number;
  @field('update_employee_number') updateEmployeeNumber!: string;
  @field('update_datetime') updateDatetime!: string;
  @field('sent_datetime') sentDatetime!: string;
  @field('ice_conditions_html') iceConditionsHtml!: string;
  @field('data_origin') dataOrigin!: string;
  @field('last_sync_on') lastSyncOn!: number;
}

export default DiscoveryConditionAgreements;
