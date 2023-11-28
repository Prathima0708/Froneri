
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class EmployeeFunctions extends Model {
	static table = 'employee_functions';

	@field('id_employee_function') idEmployeeFunction!: number;
	@field('description') description!: string;
	@field('functional_type') functionalType!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default EmployeeFunctions;
