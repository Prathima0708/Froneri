import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersRouteCustomerAssignment extends Model {
  static table = 'customers_route_customer_assignment';

  @field('customer_ship_to') customerShipTo!: string;
  @field('sales_organization') salesOrganization!: string;
  @field('distribution_channel') distributionChannel!: string;
  @field('valid_from_datetime') validFromDatetime!: number;
  @field('valid_to_datetime') validToDatetime!: string;
  @field('call_frequency') callFrequency!: string;
  @field('call_days') callDays!: string;
  @field('call_time_from') callTimeFrom!: string;
  @field('call_time_to') callTimeTo!: string;
  @field('delivery_route') deliveryRoute!: string;
  @field('delivery_sequence') deliverySequence!: string;
  @field('delivery_days') deliveryDays!: string;
  @field('closed_days') closedDays!: string;
  @field('opening_hours') openingHours!: string;
  @field('delivery_morning_hours_from') deliveryMorningHoursFrom!: string;
  @field('delivery_morning_hours_to') deliveryMorningHoursTo!: string;
  @field('delivery_afternoon_hours_from') deliveryAfternoonHoursFrom!: string;
  @field('delivery_afternoon_hours_to') deliveryAfternoonHoursTo!: string;
  @field('call_place_number') callPlaceNumber!: string;
  @field('contact_type') contactType!: string;
  @field('call_place_number_days') callPlaceNumberDays!: string;
  @field('visiting_hours') visitingHours!: string;
  @field('prefered_call_time') preferedCallTime!: string;
  @field('call_days_values') callDaysValues!: string;
  @field('delivery_days_values') deliveryDaysValues!: string;
  @field('visit_days_values') visitDaysValues!: string;
  @field('visit_time_from') visitTimeFrom!: string;
  @field('visit_time_to') visitTimeTo!: string;
  @field('visit_frequency') visitFrequency!: string;
  @field('visit_type') visitType!: string;
  @field('visit_place_number') visitPlaceNumber!: string;
  @field('visit_place_number_days') visitPlaceNumberDays!: string;
  @field('visit_days') visitDays!: string;
  @field('calls_calendar_id') callsCalendarId!: string;
  @field('visits_calendar_id') visitsCalendarId!: string;
  @field('delivery_calendar_id') deliveryCalendarId!: string;
  @field('preferred_visit_time') preferredVisitTime!: string;
  @field('data_origin') dataOrigin!: string;
  @field('last_sync_on') lastSyncOn!: string;
}

export default CustomersRouteCustomerAssignment;
