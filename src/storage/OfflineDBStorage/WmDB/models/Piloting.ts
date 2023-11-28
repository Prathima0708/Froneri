
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Piloting extends Model {
	static table = 'piloting';

	@field('piloting_key') pilotingKey!: string;
	@field('piloting_type') pilotingType!: string;
	@field('piloting_value') pilotingValue!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default Piloting;
