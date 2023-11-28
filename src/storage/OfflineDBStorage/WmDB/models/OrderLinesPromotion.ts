
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class OrderLinesPromotion extends Model {
	static table = 'order_lines_promotion';

	@field('id_order') idOrder!: string;
	@field('id_order_line') idOrderLine!: number;
	@field('material_number') materialNumber!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('sales_unit') salesUnit!: string;
	@field('storage_location') storageLocation!: string;
	@field('id_promotion') idPromotion!: string;
	@field('quantity') quantity!: number;
	@field('free_quantity') freeQuantity!: number;
	@field('approver_employee_number') approverEmployeeNumber!: string;
	@field('reason_code') reasonCode!: number;
	@field('basket') basket!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default OrderLinesPromotion;
