
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class SyncStoredProcedures extends Model {
	static table = 'sync_stored_procedures';

	@field('application') application!: string;
	@field('type') type!: string;
	@field('stored_procedure_name') storedProcedureName!: string;
	@field('created_employee_number') createdEmployeeNumber!: string;
	@field('creation_datetime') creationDatetime!: string;
	@field('updated_employee_number') updatedEmployeeNumber!: string;
	@field('updation_datetime') updationDatetime!: string;
	@field('stored_procedure_script') storedProcedureScript!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default SyncStoredProcedures;
