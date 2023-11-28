import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersMaterials extends Model {
  static table = 'customers_materials';

  @field('customer_ship_to') customerShipTo!: string;
  @field('material_number') materialNumber!: string;
  @field('sales_organization') salesOrganization!: string;
  @field('distribution_channel') distributionChannel!: string;
  @field('id_call_center') idCallCenter!: number;
  @field('color') color!: string;
  @field('highlight') highlight!: string;
  @field('source') source!: string;
  @field('last_delivery') lastDelivery!: number;
  @field('last_n_deliveries') lastNDeliveries!: number;
  @field('processed') processed!: string;
  @field('leader_product_list') leaderProductList!: string;
  @field('id_promotion') idPromotion!: string;
  @field('last_n_delivery_counts') lastNDeliveryCounts!: number;
  @field('sales_unit') salesUnit!: string;
  @field('promotion_indicator') promotionIndicator!: string;
  @field('id_region') idRegion!: number;
  @field('travelling_customer') travellingCustomer!: string;
  @field('negative_item') negativeItem!: string;
  @field('data_origin') dataOrigin!: string;
  @field('last_sync_on') lastSyncOn!: string;
}

export default CustomersMaterials;
