
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TradeAssetsCustomers extends Model {
	static table = 'trade_assets_customers';

	@field('customer_ship_to') customerShipTo!: string;
	@field('equipment_number') equipmentNumber!: string;
	@field('material_number') materialNumber!: string;
	@field('manufacturer_model') manufacturerModel!: string;
	@field('serial_number') serialNumber!: string;
	@field('manufacturer_serial_number') manufacturerSerialNumber!: string;
	@field('batch_number') batchNumber!: string;
	@field('description') description!: string;
	@field('status1') status1!: string;
	@field('status2') status2!: string;
	@field('construction_year') constructionYear!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('installed_date') installedDate!: string;
	@field('brand') brand!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default TradeAssetsCustomers;
