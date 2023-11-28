import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class SalesRepresentatives extends Model {
  static table = 'sales_representatives';

  @field('partner_number') partnerNumber!: string;
  @field('first_name') firstName!: string;
  @field('last_name') lastName!: string;
  @field('mail_address') mailAddress!: string;
  @field('phone') phone!: string;
  @field('id_call_center') idCallCenter!: number;
  @field('employee_number') employeeNumber!: string;
  @field('customer_creation_validation_required')
  customerCreationValidationRequired!: string;
  @field('default_delegation') defaultDelegation!: string;
  @field('secondary_responsible') secondaryResponsible!: string;
  @field('data_origin') dataOrigin!: string;
  @field('last_sync_on') lastSyncOn!: number;
}

export default SalesRepresentatives;
