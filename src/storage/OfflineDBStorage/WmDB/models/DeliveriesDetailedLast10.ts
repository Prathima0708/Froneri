import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class DeliveriesDetailedLast10 extends Model {
  static table = 'deliveries_detailed_last_10';

  @field('customer_ship_to') customerShipTo!: string;
  @field('sales_organization') salesOrganization!: string;
  @field('distribution_channel') distributionChannel!: string;
  @field('material_number') materialNumber!: string;
  @field('delivery_datetime') deliveryDatetime!: string;
  @field('quantity') quantity!: number;
  @field('sales_unit') salesUnit!: string;
  @field('id_order') idOrder!: string;
  @field('type') type!: string;
  @field('deliveries_ly') deliveriesLy!: number;
  @field('deliveries_ytd_ly') deliveriesYtdLy!: number;
  @field('deliveries_ytd_cy') deliveriesYtdCy!: number;
  @field('data_origin') dataOrigin!: string;
  @field('last_sync_on') lastSyncOn!: string;
}

export default DeliveriesDetailedLast10;
