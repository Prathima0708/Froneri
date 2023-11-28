
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class SubstitutionMaterials extends Model {
	static table = 'substitution_materials';

	@field('substitution_material_number') substitutionMaterialNumber!: string;
	@field('material_number') materialNumber!: string;
	@field('begin_datetime') beginDatetime!: string;
	@field('end_datetime') endDatetime!: string;
	@field('status') status!: string;
	@field('substitution_type') substitutionType!: string;
	@field('plant_number') plantNumber!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('customer_hierarchy_node') customerHierarchyNode!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default SubstitutionMaterials;
