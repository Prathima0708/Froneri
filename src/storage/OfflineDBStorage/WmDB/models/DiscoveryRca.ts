import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class DiscoveryRca extends Model {
  static table = 'discovery_rca';

  @field('discovery_id') discoveryId!: string;
  @field('distribution_centre') distributionCentre!: string;
  @field('visit_calendar_id') visitCalendarId!: string;
  @field('call_calendar_id') callCalendarId!: string;
  @field('delivery_route') deliveryRoute!: string;
  @field('delivery_days_values') deliveryDaysValues!: string;
  @field('alternate_delivery_days_values') alternateDeliveryDaysValues!: string;
  @field('contact_visiting_hours') contactVisitingHours!: string;
  @field('visit_days_values') visitDaysValues!: string;
  @field('visit_time_from') visitTimeFrom!: string;
  @field('visit_time_to') visitTimeTo!: string;
  @field('preferred_visit_time') preferredVisitTime!: string;
  @field('call_days_values') callDaysValues!: string;
  @field('call_time_from') callTimeFrom!: string;
  @field('call_time_to') callTimeTo!: string;
  @field('preferred_call_time') preferredCallTime!: string;
  @field('delivery_morning_from') deliveryMorningFrom!: string;
  @field('delivery_morning_to') deliveryMorningTo!: string;
  @field('delivery_afternoon_from') deliveryAfternoonFrom!: string;
  @field('delivery_afternoon_to') deliveryAfternoonTo!: string;
  @field('call_place_number') callPlaceNumber!: string;
  @field('season2_call_calendar_id') season2CallCalendarId!: string;
  @field('season2_call_days_values') season2CallDaysValues!: string;
  @field('season2_call_time_from') season2CallTimeFrom!: string;
  @field('season2_call_time_to') season2CallTimeTo!: string;
  @field('season2_preferred_call_time') season2PreferredCallTime!: string;
  @field('season2_delivery_days_values') season2DeliveryDaysValues!: string;
  @field('season2_delivery_morning_from') season2DeliveryMorningFrom!: string;
  @field('season2_delivery_morning_to') season2DeliveryMorningTo!: string;
  @field('season2_delivery_afternoon_from')
  season2DeliveryAfternoonFrom!: string;
  @field('season2_delivery_afternoon_to') season2DeliveryAfternoonTo!: string;
  @field('season2_delivery_route') season2DeliveryRoute!: string;
  @field('season2_call_place_number') season2CallPlaceNumber!: string;
  @field('season2_alternate_delivery_days_values')
  season2AlternateDeliveryDaysValues!: string;
  @field('alternate_delivery_route') alternateDeliveryRoute!: string;
  @field('visit_morning_from') visitMorningFrom!: string;
  @field('visit_morning_to') visitMorningTo!: string;
  @field('visit_afternoon_from') visitAfternoonFrom!: string;
  @field('visit_afternoon_to') visitAfternoonTo!: string;
  @field('receiving_morning_from') receivingMorningFrom!: string;
  @field('receiving_morning_to') receivingMorningTo!: string;
  @field('receiving_afternoon_from') receivingAfternoonFrom!: string;
  @field('receiving_afternoon_to') receivingAfternoonTo!: string;
  @field('delivery_comments') deliveryComments!: string;
  @field('max_contact_during_high_season') maxContactDuringHighSeason!: string;
  @field('update_employee_number') updateEmployeeNumber!: string;
  @field('update_datetime') updateDatetime!: string;
  @field('sent_datetime') sentDatetime!: string;
  @field('data_origin') dataOrigin!: string;
  @field('last_sync_on') lastSyncOn!: number;
}

export default DiscoveryRca;
