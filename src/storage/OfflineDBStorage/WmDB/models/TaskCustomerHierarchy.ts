
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TaskCustomerHierarchy extends Model {
	static table = 'task_customer_hierarchy';

	@field('id_task') idTask!: string;
	@field('customer_hierarchy_node') customerHierarchyNode!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
    @field('customer_hierarchy_node_level') customerHierarchyNodeLevel!: number;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TaskCustomerHierarchy;
