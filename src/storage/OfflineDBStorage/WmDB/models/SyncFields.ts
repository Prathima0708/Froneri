
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class SyncFields extends Model {
	static table = 'sync_fields';

	@field('table_name') tableName!: string;
	@field('field_name') fieldName!: string;
	@field('sequence') sequence!: number;
	@field('data_type') dataType!: string;
	@field('length') length!: number;
	@field('scale') scale!: number;
	@field('precision') precision!: number;
	@field('nullable') nullable!: string;
	@field('host_relevant') hostRelevant!: string;
	@field('client_relevant') clientRelevant!: string;
	@field('default_value') defaultValue!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default SyncFields;
