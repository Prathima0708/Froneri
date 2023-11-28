
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomerHierarchiesShipTo extends Model {
	static table = 'customer_hierarchies_ship_to';

	@field('customer_ship_to') customerShipTo!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('customer_sold_to') customerSoldTo!: string;
	@field('customer_hier_l1') customerHierL1!: string;
	@field('customer_hier_l2') customerHierL2!: string;
	@field('customer_hier_l3') customerHierL3!: string;
	@field('name_hier_l3') nameHierL3!: string;
	@field('customer_hier_l4') customerHierL4!: string;
	@field('name_hier_l4') nameHierL4!: string;
	@field('customer_hier_l5') customerHierL5!: string;
	@field('name_hier_l5') nameHierL5!: string;
	@field('customer_hier_l6') customerHierL6!: string;
	@field('name_hier_l6') nameHierL6!: string;
	@field('customer_hier_l7') customerHierL7!: string;
	@field('name_hier_l7') nameHierL7!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomerHierarchiesShipTo;
