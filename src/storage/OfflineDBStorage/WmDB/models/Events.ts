import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Events extends Model {
  static table = 'events';

  @field('id_event') idEvent!: string;
  @field('event_type') eventType!: string;
  @field('event_datetime') eventDatetime!: string;
  @field('result') result!: string;
  @field('request_message_triggered') requestMessageTriggered!: string;
  @field('result_message_triggered') resultMessageTriggered!: string;
  @field('source_employee_number') sourceEmployeeNumber!: string;
  @field('destination_employee_number') destinationEmployeeNumber!: string;
  @field('id_object') idObject!: string;
  @field('id_workflow_event') idWorkflowEvent!: number;
  @field('mail_to_destination_required') mailToDestinationRequired!: string;
  @field('mail_to_source_required') mailToSourceRequired!: string;
  @field('result_additional_comment') resultAdditionalComment!: string;
  @field('event_update_datetime') eventUpdateDatetime!: string;
  @field('data_origin') dataOrigin!: string;
  @field('last_sync_on') lastSyncOn!: string;
}

export default Events;
