import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TurnoverAggregated extends Model {
  static table = 'turnover_aggregated';

  @field('customer_ship_to') customerShipTo!: string;
  @field('id_turnover_group') idTurnoverGroup!: number;
  @field('type') type!: string;
  @field('turnover_value') turnoverValue!: number;
  @field('nps_value') npsValue!: number;
  @field('gps_value') gpsValue!: number;
  @field('internal_transfer_price_value') internalTransferPriceValue!: number;
  @field('material_hierarchy_node') materialHierarchyNode!: string;
  @field('indirect_turnover_value') indirectTurnoverValue!: number;
  @field('indirect_nps_value') indirectNpsValue!: number;
  @field('indirect_gps_value') indirectGpsValue!: number;
  @field('data_origin') dataOrigin!: string;
  @field('last_sync_on') lastSyncOn!: number;
}

export default TurnoverAggregated;
