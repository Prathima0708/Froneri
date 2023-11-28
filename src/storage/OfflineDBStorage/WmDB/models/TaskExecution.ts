
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TaskExecution extends Model {
	static table = 'task_execution';

	@field('id_task') idTask!: string;
	@field('employee_number') employeeNumber!: string;
	@field('id_task_execution') idTaskExecution!: string;
	@field('id_call') idCall!: string;
	@field('id_order') idOrder!: string;
	@field('id_order_template') idOrderTemplate!: string;
	@field('customer_ship_to') customerShipTo!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('additional_notes') additionalNotes!: string;
	@field('status') status!: string;
	@field('sent_datetime') sentDatetime!: string;
	@field('id_sales_team') idSalesTeam!: string;
	@field('executed_employee_number') executedEmployeeNumber!: string;
	@field('executed_datetime') executedDatetime!: string;
	@field('updated_employee_number') updatedEmployeeNumber!: string;
	@field('updated_datetime') updatedDatetime!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TaskExecution;
