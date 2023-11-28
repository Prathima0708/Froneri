
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Materials extends Model {
	static table = 'materials';

	@field('material_number') materialNumber!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('description_language_1') descriptionLanguage1!: string;
	@field('description_language_2') descriptionLanguage2!: string;
	@field('description_language_3') descriptionLanguage3!: string;
	@field('description_language_4') descriptionLanguage4!: string;
	@field('main_sales_unit') mainSalesUnit!: string;
	@field('alternative_sales_unit_1') alternativeSalesUnit1!: string;
	@field('material_hierarchy_node') materialHierarchyNode!: string;
	@field('weight_unit') weightUnit!: string;
	@field('net_weight') netWeight!: number;
	@field('gross_weight') grossWeight!: number;
	@field('material_type') materialType!: string;
	@field('sap_status_1') sapStatus1!: string;
	@field('material_group_1') materialGroup1!: string;
	@field('active_in_tess') activeInTess!: string;
	@field('material_hierarchy_node_l1') materialHierarchyNodeL1!: string;
	@field('material_hierarchy_node_l2') materialHierarchyNodeL2!: string;
	@field('material_hierarchy_node_l3') materialHierarchyNodeL3!: string;
	@field('material_hierarchy_node_l4') materialHierarchyNodeL4!: string;
	@field('material_hierarchy_node_l5') materialHierarchyNodeL5!: string;
	@field('item_category_group') itemCategoryGroup!: string;
	@field('base_unit') baseUnit!: string;
	@field('material_hierarchy_from_sap_node') materialHierarchyFromSapNode!: string;
	@field('material_hierarchy_from_sap_node_l1') materialHierarchyFromSapNodeL1!: string;
	@field('material_hierarchy_from_sap_node_l2') materialHierarchyFromSapNodeL2!: string;
	@field('material_hierarchy_from_sap_node_l3') materialHierarchyFromSapNodeL3!: string;
	@field('material_hierarchy_from_sap_node_l4') materialHierarchyFromSapNodeL4!: string;
	@field('material_hierarchy_from_sap_node_l5') materialHierarchyFromSapNodeL5!: string;
	@field('material_group_4') materialGroup4!: string;
	@field('main_local_packaging_unit') mainLocalPackagingUnit!: string;
	@field('alternative_packaging_unit') alternativePackagingUnit!: string;
	@field('alternative_local_packaging_unit') alternativeLocalPackagingUnit!: string;
	@field('minimum_turnover_value') minimumTurnoverValue!: number;
	@field('local_attribute_4') localAttribute4!: string;
	@field('material_group') materialGroup!: string;
	@field('alternative_material_number') alternativeMaterialNumber!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default Materials;
