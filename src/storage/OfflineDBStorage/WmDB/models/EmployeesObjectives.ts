
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class EmployeesObjectives extends Model {
	static table = 'employees_objectives';

	@field('id_employee_objective') idEmployeeObjective!: number;
	@field('employee_objective_type') employeeObjectiveType!: string;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('customer_type') customerType!: string;
	@field('standard_duration') standardDuration!: number;
	@field('default_objective') defaultObjective!: string;
	@field('sales_responsible') salesResponsible!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default EmployeesObjectives;
