
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class OosOrderedMaterials extends Model {
	static table = 'oos_ordered_materials';

	@field('id_oos_ordered_material') idOosOrderedMaterial!: string;
	@field('customer_sold_to') customerSoldTo!: string;
	@field('customer_ship_to') customerShipTo!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('order_creation_datetime') orderCreationDatetime!: string;
	@field('delivery_datetime') deliveryDatetime!: string;
	@field('material_number') materialNumber!: string;
	@field('quantity') quantity!: number;
	@field('sales_unit') salesUnit!: string;
	@field('net_amount') netAmount!: number;
	@field('alternative_material_number') alternativeMaterialNumber!: string;
	@field('alternative_sales_unit') alternativeSalesUnit!: string;
	@field('alternative_net_amount') alternativeNetAmount!: number;
	@field('employee_number') employeeNumber!: string;
	@field('oos_result_code') oosResultCode!: string;
	@field('id_order') idOrder!: string;
	@field('sent_datetime') sentDatetime!: string;
	@field('picking_plant_number') pickingPlantNumber!: string;
	@field('delivering_plant_number') deliveringPlantNumber!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default OosOrderedMaterials;
