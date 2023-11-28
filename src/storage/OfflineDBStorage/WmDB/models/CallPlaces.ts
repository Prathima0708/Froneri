
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CallPlaces extends Model {
	static table = 'call_places';

	@field('call_place_number') callPlaceNumber!: string;
	@field('id_call_center') idCallCenter!: number;
	@field('description') description!: string;
	@field('allocation_type') allocationType!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CallPlaces;
