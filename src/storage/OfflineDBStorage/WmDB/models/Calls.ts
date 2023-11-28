import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Calls extends Model {
  static table = 'calls';

  @field('id_call') idCall!: string;
  @field('id_call_list') idCallList!: number;
  @field('employee_number') employeeNumber!: string;
  @field('customer_ship_to') customerShipTo!: string;
  @field('id_call_center') idCallCenter!: number;
  @field('call_place_number') callPlaceNumber!: string;
  @field('call_from_datetime') callFromDatetime!: string;
  @field('call_to_datetime') callToDatetime!: string;
  @field('call_order_number') callOrderNumber!: string;
  @field('call_list_type') callListType!: string;
  @field('call_type') callType!: string;
  @field('call_status') callStatus!: string;
  @field('call_contact_status') callContactStatus!: string;
  @field('manual_action') manualAction!: string;
  @field('call_result') callResult!: string;
  @field('deleted') deleted!: string;
  @field('reason_for_not_moving') reasonForNotMoving!: string;
  @field('original_call_place_number') originalCallPlaceNumber!: string;
  @field('original_call_from_datetime') originalCallFromDatetime!: string;
  @field('original_call_to_datetime') originalCallToDatetime!: string;
  @field('original_employee_number') originalEmployeeNumber!: string;
  @field('original_delivery_route') originalDeliveryRoute!: string;
  @field('updation_employee_number') updationEmployeeNumber!: string;
  @field('updation_datetime') updationDatetime!: string;
  @field('delivery_datetime') deliveryDatetime!: string;
  @field('delivery_route') deliveryRoute!: string;
  @field('delivery_sequence') deliverySequence!: string;
  @field('effective_call_from_datetime') effectiveCallFromDatetime!: string;
  @field('sap_order_number') sapOrderNumber!: string;
  @field('sap_document_type') sapDocumentType!: string;
  @field('sap_order_amount') sapOrderAmount!: number;
  @field('local') local!: string;
  @field('sales_organization') salesOrganization!: string;
  @field('distribution_channel') distributionChannel!: string;
  @field('prefered_call_time') preferedCallTime!: string;
  @field('call_category') callCategory!: string;
  @field('id_employee_objective') idEmployeeObjective!: number;
  @field('result_objective') resultObjective!: string;
  @field('effective_call_to_datetime') effectiveCallToDatetime!: string;
  @field('id_employee_executed_objective') idEmployeeExecutedObjective!: number;
  @field('sent_datetime') sentDatetime!: string;
  @field('route_planning_cut_off_time') routePlanningCutOffTime!: string;
  @field('order_taking_cut_off_time') orderTakingCutOffTime!: string;
  @field('id_no_order_reason') idNoOrderReason!: string;
  @field('call_origin') callOrigin!: string;
  @field('prospection') prospection!: string;
  @field('visit_type') visitType!: string;
  @field('visit_preparation_notes') visitPreparationNotes!: string;
  @field('data_origin') dataOrigin!: string;
  @field('last_sync_on') lastSyncOn!: string;
}

export default Calls;
