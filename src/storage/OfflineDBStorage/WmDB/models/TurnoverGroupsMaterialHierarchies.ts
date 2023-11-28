import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TurnoverGroupsMaterialHierarchies extends Model {
  static table = 'turnover_groups_material_hierarchies';

  @field('id_turnover_group') idTurnoverGroup!: number;
  @field('material_hierarchy_node') materialHierarchyNode!: string;
  @field('data_origin') dataOrigin!: string;
  @field('last_sync_on') lastSyncOn!: number;
}

export default TurnoverGroupsMaterialHierarchies;
