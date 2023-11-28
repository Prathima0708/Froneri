import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class ServiceRequestTypes extends Model {
  static table = 'service_request_types';

  @field('id_service_request_type') idServiceRequestType!: string;
  @field('description_language_1') descriptionLanguage1!: string;
  @field('number_of_days') numberOfDays!: number;
  @field('is_claim_type') isClaimType!: string;
  @field('inactive') inactive!: string;
  @field('claims_screen_layout') claimsScreenLayout!: number;
  @field('pretext') pretext!: string;
  @field('data_origin') dataOrigin!: string;
  @field('last_sync_on') lastSyncOn!: number;
}

export default ServiceRequestTypes;
