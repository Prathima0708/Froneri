import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class DiscoveryControls extends Model {
  static table = 'discovery_controls';

  @field('discovery_control_id') discoveryControlId!: string;
  @field('control_name') controlName!: string;
  @field('control_type') controlType!: string;
  @field('description') description!: string;
  @field('mandatory_acs') mandatoryAcs!: boolean;
  @field('update_employee_number') updateEmployeeNumber!: string;
  @field('update_datetime') updateDatetime!: string;
  @field('android_control_name') androidControlName!: string;
  @field('android_control_type') androidControlType!: string;
  @field('data_origin') dataOrigin!: string;
  @field('last_sync_on') lastSyncOn!: number;
}

export default DiscoveryControls;
