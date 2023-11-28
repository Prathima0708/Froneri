
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class SalesArea extends Model {
	static table = 'sales_area';

	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('description') description!: string;
	@field('postal_code_length') postalCodeLength!: number;
	@field('enable_picking_plant_change') enablePickingPlantChange!: string;
	@field('country') country!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default SalesArea;
