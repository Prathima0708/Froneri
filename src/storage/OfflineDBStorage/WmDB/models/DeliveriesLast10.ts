import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class DeliveriesLast10 extends Model {
  static table = 'deliveries_last_10';

  @field('customer_ship_to') customerShipTo!: string;
  @field('sales_organization') salesOrganization!: string;
  @field('distribution_channel') distributionChannel!: string;
  @field('delivery_datetime') deliveryDatetime!: string;
  @field('data_origin') dataOrigin!: string;
  @field('last_sync_on') lastSyncOn!: string;
}

export default DeliveriesLast10;
