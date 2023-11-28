
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class SyncTables extends Model {
	static table = 'sync_tables';

	@field('table_name') tableName!: string;
	@field('description') description!: string;
	@field('group_name') groupName!: string;
	@field('object_type') objectType!: string;
	@field('sequence') sequence!: number;
	@field('status') status!: string;
	@field('sql_server') sqlServer!: string;
	@field('database_server') databaseServer!: string;
	@field('partial_synchronization_request') partialSynchronizationRequest!: string;
	@field('client_to_host') clientToHost!: string;
	@field('host_to_client') hostToClient!: string;
	@field('display_in_sync_cockpit') displayInSyncCockpit!: string;
	@field('description_in_sync_cockpit') descriptionInSyncCockpit!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default SyncTables;
