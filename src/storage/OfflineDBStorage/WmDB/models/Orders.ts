
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Orders extends Model {
	static table = 'orders';

	@field('id_order') idOrder!: string;
	@field('order_type') orderType!: string;
	@field('order_reason') orderReason!: string;
	@field('tess_order_type') tessOrderType!: string;
	@field('tess_order_sub_type') tessOrderSubType!: string;
	@field('customer_ship_to') customerShipTo!: string;
	@field('customer_sold_to') customerSoldTo!: string;
	@field('id_call_center') idCallCenter!: number;
	@field('picking_plant_number') pickingPlantNumber!: string;
	@field('delivering_plant_number') deliveringPlantNumber!: string;
	@field('call_place_number') callPlaceNumber!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('employee_number') employeeNumber!: string;
	@field('workstation') workstation!: string;
	@field('sent_datetime') sentDatetime!: string;
	@field('creation_datetime') creationDatetime!: string;
	@field('changed_datetime') changedDatetime!: string;
	@field('delivery_datetime') deliveryDatetime!: string;
	@field('origin_order') originOrder!: string;
	@field('fax_order') faxOrder!: string;
	@field('print_status') printStatus!: string;
	@field('quantity') quantity!: number;
	@field('gross_amount') grossAmount!: number;
	@field('net_amount') netAmount!: number;
	@field('rebate_amount') rebateAmount!: number;
	@field('rebate_percentage') rebatePercentage!: number;
	@field('route') route!: string;
	@field('sequence_route') sequenceRoute!: string;
	@field('payment_term') paymentTerm!: string;
	@field('language_customertext') languageCustomertext!: number;
	@field('driver_note_1') driverNote1!: string;
	@field('driver_note_2') driverNote2!: string;
	@field('driver_note_3') driverNote3!: string;
	@field('driver_note_4') driverNote4!: string;
	@field('customer_note_1') customerNote1!: string;
	@field('customer_note_2') customerNote2!: string;
	@field('customer_note_3') customerNote3!: string;
	@field('customer_note_4') customerNote4!: string;
	@field('picking_note_1') pickingNote1!: string;
	@field('picking_note_2') pickingNote2!: string;
	@field('po_number') poNumber!: string;
	@field('changed_ship_to') changedShipTo!: string;
	@field('name1_ship_to') name1ShipTo!: string;
	@field('name2_ship_to') name2ShipTo!: string;
	@field('address_ship_to') addressShipTo!: string;
	@field('postal_code_ship_to') postalCodeShipTo!: string;
	@field('city_ship_to') cityShipTo!: string;
	@field('delivery_overcost_value') deliveryOvercostValue!: number;
	@field('id_delivery_overcost_reason') idDeliveryOvercostReason!: string;
	@field('prime_amount') primeAmount!: number;
	@field('test_order') testOrder!: string;
	@field('bcp_mode') bcpMode!: string;
	@field('bcp_picking_number') bcpPickingNumber!: string;
	@field('sap_document_number') sapDocumentNumber!: string;
	@field('id_customer_classification_1') idCustomerClassification1!: string;
	@field('id_customer_classification_2') idCustomerClassification2!: string;
	@field('name1_sold_to') name1SoldTo!: string;
	@field('name2_sold_to') name2SoldTo!: string;
	@field('address_sold_to') addressSoldTo!: string;
	@field('postal_code_sold_to') postalCodeSoldTo!: string;
	@field('city_sold_to') citySoldTo!: string;
	@field('z046_return_order_text') z046ReturnOrderText!: string;
	@field('z047_return_order_text') z047ReturnOrderText!: string;
	@field('z048_return_order_text') z048ReturnOrderText!: string;
	@field('self_collector') selfCollector!: string;
	@field('gr_morning_from') grMorningFrom!: string;
	@field('gr_morning_to') grMorningTo!: string;
	@field('gr_afternoon_from') grAfternoonFrom!: string;
	@field('gr_afternoon_to') grAfternoonTo!: string;
	@field('delivery_today') deliveryToday!: string;
	@field('cash_on_delivery_order') cashOnDeliveryOrder!: string;
	@field('delivery_overcost') deliveryOvercost!: string;
	@field('call_type') callType!: string;
	@field('house_number_ship_to') houseNumberShipTo!: string;
	@field('alternative_tour') alternativeTour!: string;
	@field('total_amount') totalAmount!: number;
	@field('hit_promo_off') hitPromoOff!: string;
	@field('idoc_created') idocCreated!: string;
	@field('bcp_transferred') bcpTransferred!: string;
	@field('net_weight') netWeight!: number;
	@field('gross_weight') grossWeight!: number;
	@field('id_weight_limit_reason') idWeightLimitReason!: number;
	@field('on_line_payment') onLinePayment!: string;
	@field('external_order') externalOrder!: string;
	@field('external_document_number') externalDocumentNumber!: string;
	@field('customer_order_by') customerOrderBy!: string;
	@field('order_status') orderStatus!: string;
	@field('change_reason_code') changeReasonCode!: string;
	@field('delivery') delivery!: string;
	@field('used_by_employee_number') usedByEmployeeNumber!: string;
	@field('used_by_datetime') usedByDatetime!: string;
	@field('original_quantity') originalQuantity!: number;
	@field('sap_blocking') sapBlocking!: string;
	@field('pricing_procedure') pricingProcedure!: string;
	@field('cost_center') costCenter!: string;
	@field('delivery_overcost_non_full_case_value') deliveryOvercostNonFullCaseValue!: number;
	@field('commercial_information') commercialInformation!: string;
	@field('planned_delivery_datetime') plannedDeliveryDatetime!: string;
	@field('logistic_status') logisticStatus!: string;
	@field('vat_amount') vatAmount!: number;
	@field('confirmation_required') confirmationRequired!: string;
	@field('id_trade_asset_rejection_reason') idTradeAssetRejectionReason!: string;
	@field('service_note') serviceNote!: string;
	@field('confirmation_to_back_office_required') confirmationToBackOfficeRequired!: string;
	@field('agreement_number') agreementNumber!: string;
	@field('document_path') documentPath!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default Orders;
