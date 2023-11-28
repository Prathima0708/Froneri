
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class MaterialsSalesUnits extends Model {
	static table = 'materials_sales_units';

	@field('material_number') materialNumber!: string;
	@field('main_sales_unit') mainSalesUnit!: string;
	@field('alternative_sales_unit_1') alternativeSalesUnit1!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default MaterialsSalesUnits;
