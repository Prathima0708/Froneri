
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class SyncComponents extends Model {
	static table = 'sync_components';

	@field('application') application!: string;
	@field('component_name') componentName!: string;
	@field('version') version!: string;
	@field('destination_folder') destinationFolder!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default SyncComponents;
