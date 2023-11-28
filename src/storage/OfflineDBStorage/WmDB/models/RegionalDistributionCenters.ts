
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class RegionalDistributionCenters extends Model {
	static table = 'regional_distribution_centers';

	@field('rdc_number') rdcNumber!: string;
	@field('name') name!: string;
	@field('description') description!: string;
	@field('language') language!: string;
	@field('plant_status') plantStatus!: string;
	@field('atp_horizon') atpHorizon!: number;
	@field('lead_time_for_delivery') leadTimeForDelivery!: number;
	@field('country') country!: string;
	@field('third_party_plant') thirdPartyPlant!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default RegionalDistributionCenters;
