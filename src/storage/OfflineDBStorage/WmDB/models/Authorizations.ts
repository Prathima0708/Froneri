
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Authorizations extends Model {
	static table = 'authorizations';

	@field('employee_number') employeeNumber!: string;
	@field('tool') tool!: string;
	@field('granted_access') grantedAccess!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default Authorizations;
