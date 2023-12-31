
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Customers extends Model {
	static table = 'customers';

	@field('customer_ship_to') customerShipTo!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('customer_sold_to') customerSoldTo!: string;
	@field('picking_plant_number') pickingPlantNumber!: string;
	@field('delivering_plant_number') deliveringPlantNumber!: string;
	@field('telesales_text_1') telesalesText1!: string;
	@field('telesales_text_2') telesalesText2!: string;
	@field('telesales_text_3') telesalesText3!: string;
	@field('telesales_text_4') telesalesText4!: string;
	@field('active_in_tess') activeInTess!: string;
	@field('active_in_rca') activeInRca!: string;
	@field('contact1_name') contact1Name!: string;
	@field('contact1_phone_1') contact1Phone1!: string;
	@field('contact2_name') contact2Name!: string;
	@field('contact2_phone_1') contact2Phone1!: string;
	@field('phone1') phone1!: string;
	@field('phone2') phone2!: string;
	@field('payment_term') paymentTerm!: string;
	@field('alert_for_cash_on_delivery') alertForCashOnDelivery!: string;
	@field('cash_on_delivery') cashOnDelivery!: string;
	@field('purchase_order_information') purchaseOrderInformation!: string;
	@field('name1') name1!: string;
	@field('name2') name2!: string;
	@field('name3') name3!: string;
	@field('address1') address1!: string;
	@field('house_number') houseNumber!: string;
	@field('postal_code') postalCode!: string;
	@field('city') city!: string;
	@field('last_call_datetime') lastCallDatetime!: string;
	@field('last_order_datetime') lastOrderDatetime!: string;
	@field('price_group') priceGroup!: string;
	@field('industry_code') industryCode!: string;
	@field('abc_classification') abcClassification!: string;
	@field('trade_assets_volume') tradeAssetsVolume!: number;
	@field('trade_assets_amount') tradeAssetsAmount!: number;
	@field('delivery_overcost') deliveryOvercost!: string;
	@field('id_customer_classification_1') idCustomerClassification1!: string;
	@field('id_customer_classification_2') idCustomerClassification2!: string;
	@field('communication_language') communicationLanguage!: string;
	@field('update_datetime') updateDatetime!: string;
	@field('sort_code') sortCode!: string;
	@field('picking_text_1') pickingText1!: string;
	@field('shipping_text_1') shippingText1!: string;
	@field('shipping_text_2') shippingText2!: string;
	@field('id_region') idRegion!: number;
	@field('id_call_center') idCallCenter!: number;
	@field('travelling_customer') travellingCustomer!: string;
	@field('region') region!: string;
	@field('blocked_for_order_taking') blockedForOrderTaking!: string;
	@field('sales_office') salesOffice!: string;
	@field('shipping_condition') shippingCondition!: string;
	@field('weight_limit') weightLimit!: number;
	@field('customer_payer') customerPayer!: string;
	@field('customer_order_by') customerOrderBy!: string;
	@field('customer_bill_to') customerBillTo!: string;
	@field('street1') street1!: string;
	@field('street2') street2!: string;
	@field('street3') street3!: string;
	@field('sales_group') salesGroup!: string;
	@field('customer_pricing_procedure') customerPricingProcedure!: string;
	@field('customer_informed_cash_payment') customerInformedCashPayment!: string;
	@field('contact1_phone_2') contact1Phone2!: string;
	@field('contact2_phone_2') contact2Phone2!: string;
	@field('contact1_description') contact1Description!: string;
	@field('contact2_description') contact2Description!: string;
	@field('last_visit_datetime') lastVisitDatetime!: string;
	@field('last_activity_datetime') lastActivityDatetime!: string;
	@field('customer_group_6') customerGroup6!: string;
	@field('customer_group_1') customerGroup1!: string;
	@field('id_territory') idTerritory!: string;
	@field('country') country!: string;
	@field('last_order_employee_number') lastOrderEmployeeNumber!: string;
	@field('last_order_order_type') lastOrderOrderType!: string;
	@field('last_order_tess_order_sub_type') lastOrderTessOrderSubType!: string;
	@field('last_order_tess_order_reason') lastOrderTessOrderReason!: string;
	@field('last_order_total_amount') lastOrderTotalAmount!: number;
	@field('pricing_color') pricingColor!: string;
	@field('latitude') latitude!: string;
	@field('longitude') longitude!: string;
	@field('shipping_text_3') shippingText3!: string;
	@field('shipping_text_4') shippingText4!: string;
	@field('name4') name4!: string;
	@field('postal_box') postalBox!: string;
	@field('postal_code_box') postalCodeBox!: string;
	@field('city_box') cityBox!: string;
	@field('payment_method') paymentMethod!: string;
	@field('customer_group_5') customerGroup5!: string;
	@field('customer_group_12') customerGroup12!: string;
	@field('alert_long_time_no_order') alertLongTimeNoOrder!: string;
	@field('days_long_time_no_order') daysLongTimeNoOrder!: number;
	@field('bank_account_number_encrypted') bankAccountNumberEncrypted!: string;
	@field('bank_name_encrypted') bankNameEncrypted!: string;
	@field('contact1_mail_address') contact1MailAddress!: string;
	@field('contact2_mail_address') contact2MailAddress!: string;
	@field('fax') fax!: string;
	@field('mail_address') mailAddress!: string;
	@field('customer_group_15') customerGroup15!: string;
	@field('sales_representative') salesRepresentative!: string;
	@field('sales_manager') salesManager!: string;
	@field('key_account_manager') keyAccountManager!: string;
	@field('sales_responsible') salesResponsible!: string;
	@field('customer_price_group') customerPriceGroup!: string;
	@field('delivery_fee') deliveryFee!: string;
	@field('external_address') externalAddress!: string;
	@field('delegated') delegated!: string;
	@field('remote') remote!: string;
	@field('overdue') overdue!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default Customers;
