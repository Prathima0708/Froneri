import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class TempIce extends Model {
  static table = 'temp_ice';

  @field('material_number') materialNumber!: string;
  @field('material_description') materialDescription!: string;
  @field('quantity_delivered_in_last_52_weeks')
  quantityDeliveredInLast52Weeks!: string;
  @field('quantity') quantity!: string;
  @field('sales_unit') salesUnit!: string;
  @field('price') price!: number;
}

export default TempIce;
