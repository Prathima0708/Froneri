import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import CustomersRouteCustomerAssignment from 'src/storage/OfflineDBStorage/WmDB/models/CustomersRouteCustomerAssignment';
import {OFFLINE_STORAGE} from 'src/storage/Storage';

const ENTITY = OFFLINE_STORAGE.MODEL.CUSTOMERS_ROUTE_CUSTOMER_ASSIGNMENT;
export class CustomersRouteCustomerAssignmentRepo extends BaseRepo<CustomersRouteCustomerAssignment> {
  /**
   * Function returns CRCA information of the selected customer
   * @returns []
   */
  async getCustomerCRCAInfo() {
    try {
      const collection = this.getCollection(ENTITY);

      const customerInfo = await this.getCLCustomerInfo();

      const customerShipTo = customerInfo.customerShipTo
        ? customerInfo.customerShipTo
        : '';
      const salesOrganization = customerInfo.salesOrganization
        ? customerInfo.salesOrganization
        : '';
      const distributionChannel = customerInfo.distributionChannel
        ? customerInfo.distributionChannel
        : '';

      const QUERY =
        'select * from ' +
        'customers_route_customer_assignment ' +
        'where customer_ship_to = ? ' +
        'and sales_organization = ? ' +
        'and distribution_channel = ?';

      const QUERY_VALUES = [
        customerShipTo,
        salesOrganization,
        distributionChannel,
      ];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getCustomerCRCAInfo error :>> ', error);
      return [];
    }
  }

  /**
   * Function returns CRCA information of the selected customer with call place data
   * @returns []
   */
  async getCustomerCRCAInfoWithCallPlace() {
    try {
      const collection = this.getCollection(ENTITY);

      const customerInfo = await this.getPLProspectInfo();

      const customerShipTo = customerInfo.customerShipTo
        ? customerInfo.customerShipTo
        : '';
      const salesOrganization = customerInfo.salesOrganization
        ? customerInfo.salesOrganization
        : '';
      const distributionChannel = customerInfo.distributionChannel
        ? customerInfo.distributionChannel
        : '';

      const QUERY =
        'select * from ' +
        'customers_route_customer_assignment ' +
        'left join call_places on call_places.call_place_number = ' +
        'customers_route_customer_assignment.call_place_number ' +
        'where customer_ship_to = ? ' +
        'and sales_organization = ? ' +
        'and distribution_channel = ?';

      const QUERY_VALUES = [
        customerShipTo,
        salesOrganization,
        distributionChannel,
      ];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getCustomerCRCAInfoWithCallPlace error :>> ', error);
      return [];
    }
  }

  /**
   * Function returns calls and deliveries information of the customer
   * @returns []
   */
  async getCallsAndDeliveriesInformation(prevCustomerShipTo: string) {
    const collection = this.getCollection(ENTITY);

    const QUERY =
      'select substr(trim([calls_calendar_id]), 1, 4) as callsCalendarId, ' +
      'call_place_number as callPlaceNumber, call_days_values as callDaysValues, ' +
      'call_time_from as callTimeFrom, call_time_to as callTimeTo, ' +
      'prefered_call_time as preferedCallTime, delivery_days_values as deliveryDaysValues, ' +
      'delivery_morning_hours_from as deliveryMorningFrom, delivery_morning_hours_to as ' +
      'deliveryMorningTo, delivery_afternoon_hours_from as deliveryAfternoonFrom, ' +
      'delivery_afternoon_hours_to as deliveryAfternoonTo, delivery_route as deliveryRoute from ' +
      'customers_route_customer_assignment where customer_ship_to = ? and ' +
      "contact_type = 'T' and strftime('%Y-%m-%d', customers_route_customer_assignment.valid_from_datetime) " +
      "<= strftime('%Y-%m-%d', 'now') and strftime('%Y-%m-%d', customers_route_customer_assignment.valid_to_datetime) " +
      ">= strftime('%Y-%m-%d', 'now')";

    const QUERY_VALUES = [prevCustomerShipTo];

    const results = await collection
      .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
      .unsafeFetchRaw();

    if (results.length > 0) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns alternative and delivery information of the customer
   * @returns []
   */
  async getAlternativeDeliveryInformation(prevCustomerShipTo: string) {
    const collection = this.getCollection(ENTITY);

    const QUERY =
      'select call_place_number as callPlaceNumber, delivery_days_values as deliveryDaysValues, ' +
      'delivery_route as deliveryRoute from customers_route_customer_assignment ' +
      "where customer_ship_to= ? and contact_type = 'R' and strftime('%Y-%m-%d', " +
      "customers_route_customer_assignment.valid_from_datetime) <= strftime('%Y-%m-%d', 'now') " +
      "and strftime('%Y-%m-%d', customers_route_customer_assignment.valid_to_datetime) >= " +
      "strftime('%Y-%m-%d', 'now')";

    const QUERY_VALUES = [prevCustomerShipTo];

    const results = await collection
      .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
      .unsafeFetchRaw();

    if (results.length > 0) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns opening and visiting hours of the customer
   * @returns []
   */
  async getOpeningAndVisitingHours() {
    try {
      const collection = this.getCollection(ENTITY);
      const prospectData = await this.getPLProspectInfo();
      const customerShipTo = prospectData?.discoveryId
        ? prospectData.customerShipTo
        : '';
      const salesOrganization = prospectData?.discoveryId
        ? prospectData.salesOrganization
        : '';
      const distributionChannel = prospectData?.discoveryId
        ? prospectData.distributionChannel
        : '';

      const QUERY =
        'select opening_hours as openingHours, visiting_hours as visitingHours ' +
        "from customers_route_customer_assignment where strftime('%Y-%m-%d', " +
        "valid_from_datetime) <= strftime('%Y-%m-%d', 'now') and " +
        "strftime('%Y-%m-%d', valid_to_datetime) >= strftime('%Y-%m-%d', 'now') and " +
        'customer_ship_to = ? and sales_organization = ? and distribution_channel = ?';

      const QUERY_VALUES = [
        customerShipTo,
        salesOrganization,
        distributionChannel,
      ];

      console.log(
        'customer opening and visiting hours QUERY_VALUES :>> ',
        QUERY_VALUES,
      );

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getOpeningAndVisitingHours error :>> ', error);
      return [];
    }
  }
}
