
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class SalesRepDelegation extends Model {
	static table = 'sales_rep_delegation';

	@field('id_sr_delegation') idSrDelegation!: string;
	@field('primary_employee_number') primaryEmployeeNumber!: string;
	@field('secondary_employee_number') secondaryEmployeeNumber!: string;
	@field('valid_from') validFrom!: string;
	@field('valid_to') validTo!: string;
	@field('comments') comments!: string;
	@field('creation_employee_number') creationEmployeeNumber!: string;
	@field('creation_datetime') creationDatetime!: string;
	@field('updated_employee_number') updatedEmployeeNumber!: string;
	@field('updated_datetime') updatedDatetime!: string;
	@field('deleted') deleted!: string;
	@field('sent_datetime') sentDatetime!: string;
	@field('partner_number') partnerNumber!: string;
	@field('first_name') firstName!: string;
	@field('last_name') lastName!: string;
	@field('mail_address') mailAddress!: string;
	@field('phone') phone!: string;
	@field('id_call_center') idCallCenter!: number;
	@field('employee_number') employeeNumber!: string;
	@field('customer_creation_validation_required') customerCreationValidationRequired!: string;
	@field('default_delegation') defaultDelegation!: string;
	@field('secondary_responsible') secondaryResponsible!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default SalesRepDelegation;
