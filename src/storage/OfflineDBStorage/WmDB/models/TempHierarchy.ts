import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TempHierarchy extends Model {
  static table = 'temp_hierarchy';

  @field('material_hierarchy_node_l1') materialHierarchyNodeL1!: string;
  @field('material_hierarchy_node_l2') materialHierarchyNodeL2!: string;
  @field('material_hierarchy_node_l3') materialHierarchyNodeL3!: string;
  @field('material_hierarchy_node_l4') materialHierarchyNodeL4!: string;
  @field('material_hierarchy_node_l5') materialHierarchyNodeL5!: string;
}

export default TempHierarchy;
