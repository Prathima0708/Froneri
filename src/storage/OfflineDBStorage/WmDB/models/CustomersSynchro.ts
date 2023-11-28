
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersSynchro extends Model {
	static table = 'customers_synchro';

	@field('customer_ship_to') customerShipTo!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('customer_sold_to') customerSoldTo!: string;
	@field('customer_payer') customerPayer!: string;
	@field('picking_plant_number') pickingPlantNumber!: string;
	@field('delivering_plant_number') deliveringPlantNumber!: string;
	@field('id_region') idRegion!: number;
	@field('id_call_center') idCallCenter!: number;
	@field('travelling_customer') travellingCustomer!: string;
	@field('id_territory') idTerritory!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomersSynchro;
