import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersSalesOffices extends Model {
  static table = 'customers_segregation';

  @field('customer_group_15') customerGroup15!: string;
  @field('description_language_1') descriptionLanguage1!: string;
  @field('color') color!: string;
  @field('data_origin') dataOrigin!: string;
  @field('last_sync_on') lastSyncOn!: string;
}

export default CustomersSalesOffices;
