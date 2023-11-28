import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import DiscoveryRca from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryRca';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {getISOCurrentDate} from 'src/utils/CommonUtil';

const ENTITY = OFFLINE_STORAGE.MODEL.DISCOVERY_RCA;

export class DiscoveryRcaRepo extends BaseRepo<DiscoveryRca> {
  /**
   * create new prospect - discovery Rca info insert function
   * Function returns true/false based on prospect is inserted or not
   * discoveryId, previousCustomerBasicInfo - get from screen
   * @returns
   */
  async saveCreateProspectDiscoveryRcaInfo(
    discoveryId: string,
    previousCustomerCallsAndDeliveryInfo: any,
    previousCustomerAlternativeDeliveryInfo: any,
  ) {
    try {
      const collection = this.getCollection(ENTITY);

      const discoveryRcaData = await collection
        .query(Q.where('discovery_id', discoveryId))
        .fetch();

      // calls & delivery info - 0th index
      let deliveryMorningFrom = '';
      let deliveryMorningTo = '';
      let deliveryAfternoonFrom = '';
      let deliveryAfternoonTo = '';
      let callPlaceNumber = '';
      let callsCalendarId = '';
      let deliveryRoute = '';
      let deliveryDaysValues = '';
      let callDaysValues = '';
      let callTimeFrom = '';
      let callTimeTo = '';
      let preferedCallTime = '';
      // calls & delivery info - 1th index
      let season2CallCalendarId = '';
      let season2CallDaysValues = '';
      let season2CallTimeFrom = '';
      let season2CallTimeTo = '';
      let season2PreferredCallTime = '';
      let season2DeliveryDaysValues = '';
      let season2DeliveryMorningFrom = '';
      let season2DeliveryMorningTo = '';
      let season2DeliveryAfternoonFrom = '';
      let season2DeliveryAfternoonTo = '';
      let season2DeliveryRoute = '';
      let season2CallPlaceNumber = '';
      // R-Type Alternate delivery info
      let rTypeCallPlaceNumber = '';
      let alternateDeliveryDaysValues = '';
      let alternateDeliveryRoute = '';

      if (previousCustomerCallsAndDeliveryInfo.length > 0) {
        deliveryMorningFrom = previousCustomerCallsAndDeliveryInfo[0]
          .deliveryMorningFrom
          ? previousCustomerCallsAndDeliveryInfo[0].deliveryMorningFrom
          : '';
        deliveryMorningTo = previousCustomerCallsAndDeliveryInfo[0]
          .deliveryMorningTo
          ? previousCustomerCallsAndDeliveryInfo[0].deliveryMorningTo
          : '';
        deliveryAfternoonFrom = previousCustomerCallsAndDeliveryInfo[0]
          .deliveryAfternoonFrom
          ? previousCustomerCallsAndDeliveryInfo[0].deliveryAfternoonFrom
          : '';
        deliveryAfternoonTo = previousCustomerCallsAndDeliveryInfo[0]
          .deliveryAfternoonTo
          ? previousCustomerCallsAndDeliveryInfo[0].deliveryAfternoonTo
          : '';
        callPlaceNumber = previousCustomerCallsAndDeliveryInfo[0]
          .callPlaceNumber
          ? previousCustomerCallsAndDeliveryInfo[0].callPlaceNumber
          : '';
        callsCalendarId = previousCustomerCallsAndDeliveryInfo[0]
          .callsCalendarId
          ? previousCustomerCallsAndDeliveryInfo[0].callsCalendarId
          : '';
        deliveryRoute = previousCustomerCallsAndDeliveryInfo[0].deliveryRoute
          ? previousCustomerCallsAndDeliveryInfo[0].deliveryRoute
          : '';
        deliveryDaysValues = previousCustomerCallsAndDeliveryInfo[0]
          .deliveryDaysValues
          ? previousCustomerCallsAndDeliveryInfo[0].deliveryDaysValues
          : '';
        callDaysValues = previousCustomerCallsAndDeliveryInfo[0].callDaysValues
          ? previousCustomerCallsAndDeliveryInfo[0].callDaysValues
          : '';

        callTimeFrom = previousCustomerCallsAndDeliveryInfo[0].callTimeFrom
          ? previousCustomerCallsAndDeliveryInfo[0].callTimeFrom
          : '';
        callTimeTo = previousCustomerCallsAndDeliveryInfo[0].callTimeTo
          ? previousCustomerCallsAndDeliveryInfo[0].callTimeTo
          : '';
        preferedCallTime = previousCustomerCallsAndDeliveryInfo[0]
          .preferedCallTime
          ? previousCustomerCallsAndDeliveryInfo[0].preferedCallTime
          : '';
      }

      if (previousCustomerCallsAndDeliveryInfo.length > 1) {
        season2CallCalendarId = previousCustomerCallsAndDeliveryInfo[1]
          .callsCalendarId
          ? previousCustomerCallsAndDeliveryInfo[1].callsCalendarId
          : '';

        season2CallDaysValues = previousCustomerCallsAndDeliveryInfo[1]
          .callDaysValues
          ? previousCustomerCallsAndDeliveryInfo[1].callDaysValues
          : '';

        season2CallTimeFrom = previousCustomerCallsAndDeliveryInfo[1]
          .callTimeFrom
          ? previousCustomerCallsAndDeliveryInfo[1].callTimeFrom
          : '';
        season2CallTimeTo = previousCustomerCallsAndDeliveryInfo[1].callTimeTo
          ? previousCustomerCallsAndDeliveryInfo[1].callTimeTo
          : '';
        season2PreferredCallTime = previousCustomerCallsAndDeliveryInfo[1]
          .preferedCallTime
          ? previousCustomerCallsAndDeliveryInfo[1].preferedCallTime
          : '';
        season2DeliveryDaysValues = previousCustomerCallsAndDeliveryInfo[1]
          .deliveryDaysValues
          ? previousCustomerCallsAndDeliveryInfo[1].deliveryDaysValues
          : '';
        season2DeliveryMorningFrom = previousCustomerCallsAndDeliveryInfo[1]
          .deliveryMorningFrom
          ? previousCustomerCallsAndDeliveryInfo[1].deliveryMorningFrom
          : '';
        season2DeliveryMorningTo = previousCustomerCallsAndDeliveryInfo[1]
          .deliveryMorningTo
          ? previousCustomerCallsAndDeliveryInfo[1].deliveryMorningTo
          : '';
        season2DeliveryAfternoonFrom = previousCustomerCallsAndDeliveryInfo[1]
          .deliveryAfternoonFrom
          ? previousCustomerCallsAndDeliveryInfo[1].deliveryAfternoonFrom
          : '';
        season2DeliveryAfternoonTo = previousCustomerCallsAndDeliveryInfo[1]
          .deliveryAfternoonTo
          ? previousCustomerCallsAndDeliveryInfo[1].deliveryAfternoonTo
          : '';
        season2DeliveryRoute = previousCustomerCallsAndDeliveryInfo[1]
          .deliveryRoute
          ? previousCustomerCallsAndDeliveryInfo[1].deliveryRoute
          : '';
        season2CallPlaceNumber = previousCustomerCallsAndDeliveryInfo[1]
          .callPlaceNumber
          ? previousCustomerCallsAndDeliveryInfo[1].callPlaceNumber
          : '';
      }

      if (previousCustomerAlternativeDeliveryInfo.length > 0) {
        rTypeCallPlaceNumber = previousCustomerAlternativeDeliveryInfo[0]
          .callPlaceNumber
          ? previousCustomerAlternativeDeliveryInfo[0].callPlaceNumber
          : '';
        alternateDeliveryDaysValues = previousCustomerAlternativeDeliveryInfo[0]
          .deliveryDaysValues
          ? previousCustomerAlternativeDeliveryInfo[0].deliveryDaysValues
          : '';
        alternateDeliveryRoute = previousCustomerAlternativeDeliveryInfo[0]
          .deliveryRoute
          ? previousCustomerAlternativeDeliveryInfo[0].deliveryRoute
          : '';
      }

      if (discoveryRcaData.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          discoveryRcaData[0].update((rec: any) => {
            rec.sentDatetime = null;
            if (previousCustomerCallsAndDeliveryInfo.length > 0) {
              rec.deliveryMorningFrom = deliveryMorningFrom;
              rec.deliveryMorningTo = deliveryMorningTo;
              rec.deliveryAfternoonFrom = deliveryAfternoonFrom;
              rec.deliveryAfternoonTo = deliveryAfternoonTo;
              rec.callPlaceNumber = callPlaceNumber;
              rec.callCalendarId = callsCalendarId;
              rec.deliveryRoute = deliveryRoute;
              rec.deliveryDaysValues = deliveryDaysValues;
              rec.callDaysValues = callDaysValues;
              rec.callTimeFrom = callTimeFrom;
              rec.callTimeTo = callTimeTo;
              rec.preferredCallTime = preferedCallTime;
            }

            if (previousCustomerCallsAndDeliveryInfo.length > 1) {
              rec.season2CallCalendarId = season2CallCalendarId;
              rec.season2CallDaysValues = season2CallDaysValues;
              rec.season2CallTimeFrom = season2CallTimeFrom;
              rec.season2CallTimeTo = season2CallTimeTo;
              rec.season2PreferredCallTime = season2PreferredCallTime;
              rec.season2DeliveryDaysValues = season2DeliveryDaysValues;
              rec.season2DeliveryMorningFrom = season2DeliveryMorningFrom;
              rec.season2DeliveryMorningTo = season2DeliveryMorningTo;
              rec.season2DeliveryAfternoonFrom = season2DeliveryAfternoonFrom;
              rec.season2DeliveryAfternoonTo = season2DeliveryAfternoonTo;
              rec.season2DeliveryRoute = season2DeliveryRoute;
              rec.season2CallPlaceNumber = season2CallPlaceNumber;
            }

            if (previousCustomerAlternativeDeliveryInfo.length > 0) {
              rec.callPlaceNumber = rTypeCallPlaceNumber;
              rec.alternateDeliveryDaysValues = alternateDeliveryDaysValues;
              rec.alternateDeliveryRoute = alternateDeliveryRoute;
            }
          });
        });
      } else {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await collection.create((rec: any) => {
            rec.discoveryId = discoveryId;
            rec.sentDatetime = null;
            if (previousCustomerCallsAndDeliveryInfo.length > 0) {
              rec.deliveryMorningFrom = deliveryMorningFrom;
              rec.deliveryMorningTo = deliveryMorningTo;
              rec.deliveryAfternoonFrom = deliveryAfternoonFrom;
              rec.deliveryAfternoonTo = deliveryAfternoonTo;
              rec.callPlaceNumber = callPlaceNumber;
              rec.callCalendarId = callsCalendarId;
              rec.deliveryRoute = deliveryRoute;
              rec.deliveryDaysValues = deliveryDaysValues;
              rec.callDaysValues = callDaysValues;
              rec.callTimeFrom = callTimeFrom;
              rec.callTimeTo = callTimeTo;
              rec.preferredCallTime = preferedCallTime;
            }

            if (previousCustomerCallsAndDeliveryInfo.length > 1) {
              rec.season2CallCalendarId = season2CallCalendarId;
              rec.season2CallDaysValues = season2CallDaysValues;
              rec.season2CallTimeFrom = season2CallTimeFrom;
              rec.season2CallTimeTo = season2CallTimeTo;
              rec.season2PreferredCallTime = season2PreferredCallTime;
              rec.season2DeliveryDaysValues = season2DeliveryDaysValues;
              rec.season2DeliveryMorningFrom = season2DeliveryMorningFrom;
              rec.season2DeliveryMorningTo = season2DeliveryMorningTo;
              rec.season2DeliveryAfternoonFrom = season2DeliveryAfternoonFrom;
              rec.season2DeliveryAfternoonTo = season2DeliveryAfternoonTo;
              rec.season2DeliveryRoute = season2DeliveryRoute;
              rec.season2CallPlaceNumber = season2CallPlaceNumber;
            }

            if (previousCustomerAlternativeDeliveryInfo.length > 0) {
              rec.callPlaceNumber = rTypeCallPlaceNumber;
              rec.alternateDeliveryDaysValues = alternateDeliveryDaysValues;
              rec.alternateDeliveryRoute = alternateDeliveryRoute;
            }
          });
        });
      }
      return true;
    } catch (error) {
      console.log('saveCreateProspectDiscoveryRcaInfo error :>> ', error);
      return false;
    }
  }

  /**
   * Function returns opening hours of the prospect
   * @returns
   */
  async getOpeningHours() {
    try {
      const collection = this.getCollection(ENTITY);
      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const QUERY =
        'select substr(delivery_morning_from, 1, 4) || substr(delivery_morning_to, 1, 4) || ' +
        'substr(delivery_afternoon_from, 1, 4) || substr(delivery_afternoon_to, 1, 4) as openingHoursMonday, ' +
        'substr(delivery_morning_from, 5, 4) || substr(delivery_morning_to, 5, 4) || ' +
        'substr(delivery_afternoon_from, 5, 4) || substr(delivery_afternoon_to, 5, 4) as openingHoursTuesday, ' +
        'substr(delivery_morning_from, 9, 4) || substr(delivery_morning_to, 9, 4) || ' +
        'substr(delivery_afternoon_from, 9, 4) || substr(delivery_afternoon_to, 9, 4) as openingHoursWednesday, ' +
        'substr(delivery_morning_from, 13, 4) || substr(delivery_morning_to, 13, 4) || ' +
        'substr(delivery_afternoon_from, 13, 4) || substr(delivery_afternoon_to, 13, 4) as openingHoursThursday, ' +
        'substr(delivery_morning_from, 17, 4) || substr(delivery_morning_to, 17, 4) || ' +
        'substr(delivery_afternoon_from, 17, 4) || substr(delivery_afternoon_to, 17, 4) as openingHoursFriday, ' +
        'substr(delivery_morning_from, 21, 4) || substr(delivery_morning_to, 21, 4) || ' +
        'substr(delivery_afternoon_from, 21, 4) || substr(delivery_afternoon_to, 21, 4) as openingHoursSaturday, ' +
        'substr(delivery_morning_from, 25, 4) || substr(delivery_morning_to, 25, 4) || ' +
        'substr(delivery_afternoon_from, 25, 4) || substr(delivery_afternoon_to, 25, 4) as openingHoursSunday ' +
        'from discovery_rca where discovery_id = ?';

      const QUERY_VALUES = [discoveryId];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getOpeningHours error :>> ', error);
      return [];
    }
  }

  /**
   * Function returns visiting hours of the prospect
   * @returns
   */
  async getVisitingHours() {
    try {
      const collection = this.getCollection(ENTITY);
      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const QUERY =
        'select substr(visit_morning_from, 1, 4) || substr(visit_morning_to, 1, 4) || ' +
        'substr(visit_afternoon_from, 1, 4) || substr(visit_afternoon_to, 1, 4) as visitingHoursMonday, ' +
        'substr(visit_morning_from, 5, 4) || substr(visit_morning_to, 5, 4) || ' +
        'substr(visit_afternoon_from, 5, 4) || substr(visit_afternoon_to, 5, 4) as visitingHoursTuesday, ' +
        'substr(visit_morning_from, 9, 4) || substr(visit_morning_to, 9, 4) || ' +
        'substr(visit_afternoon_from, 9, 4) || substr(visit_afternoon_to, 9, 4) as visitingHoursWednesday, ' +
        'substr(visit_morning_from, 13, 4) || substr(visit_morning_to, 13, 4) || ' +
        'substr(visit_afternoon_from, 13, 4) || substr(visit_afternoon_to, 13, 4) as visitingHoursThursday, ' +
        'substr(visit_morning_from, 17, 4) || substr(visit_morning_to, 17, 4) || ' +
        'substr(visit_afternoon_from, 17, 4) || substr(visit_afternoon_to, 17, 4) as visitingHoursFriday, ' +
        'substr(visit_morning_from, 21, 4) || substr(visit_morning_to, 21, 4) || ' +
        'substr(visit_afternoon_from, 21, 4) || substr(visit_afternoon_to, 21, 4) as visitingHoursSaturday, ' +
        'substr(visit_morning_from, 25, 4) || substr(visit_morning_to, 25, 4) || ' +
        'substr(visit_afternoon_from, 25, 4) || substr(visit_afternoon_to, 25, 4) as visitingHoursSunday ' +
        'from discovery_rca where discovery_id = ?';

      const QUERY_VALUES = [discoveryId];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getVisitingHours error :>> ', error);
      return [];
    }
  }

  /**
   * Function returns RCA data of the prospect
   * @returns
   */
  async getProspectRCAData() {
    try {
      const collection = this.getCollection(ENTITY);
      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const QUERY =
        'select call_calendar_id as callCalendarId, call_days_values as ' +
        'callDaysValues, delivery_route as deliveryRoute, delivery_days_values ' +
        'as deliveryDaysValues, alternate_delivery_days_values as ' +
        'alternateDeliveryDaysValues, season2_call_calendar_id as ' +
        'season2CallCalendarId, season2_call_days_values as ' +
        'season2CallDaysValues, season2_delivery_days_values as ' +
        'season2DeliveryDaysValues, season2_delivery_route as ' +
        'season2DeliveryRoute, season2_call_place_number as ' +
        'season2CallPlaceNumber, season2_alternate_delivery_days_values ' +
        "as season2AlternateDeliveryDaysValues, coalesce(discovery_rca.call_place_number, '') " +
        "as callPlaceNumber, coalesce(call_places.call_place_number, '') || ' ' " +
        "|| coalesce(call_places.description, '') as callPlaceName, coalesce(max_contact_during_high_season, '') as " +
        'maxContactDuringHighSeason, distribution_centre as distributionCentre, ' +
        'delivery_comments as deliveryComments from discovery_rca left join call_places on ' +
        'discovery_rca.call_place_number = call_places.call_place_number where discovery_id = ?';

      const QUERY_VALUES = [discoveryId];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getProspectRCAData error :>> ', error);
      return [];
    }
  }

  /**
   * Function returns delivery comment for the customer in PLP
   * @returns
   */
  async getDeliveryComment() {
    try {
      const collection = this.getCollection(ENTITY);
      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const QUERY =
        'select delivery_comments as deliveryComments ' +
        'from  discovery_rca where  discovery_id = ?';

      const QUERY_VALUES = [discoveryId];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getDeliveryComment error :>> ', error);
      return [];
    }
  }

  /**
   * Function returns true/false based on prospect updated/inserted or not
   * @returns
   */
  async insertOrUpdateProspectRCAData(data: any) {
    try {
      const prospectInfoData = await this.getPLProspectInfo();
      const discoveryId = prospectInfoData?.discoveryId
        ? prospectInfoData.discoveryId
        : '';

      const collection = this.getCollection(ENTITY);

      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';

      const currentDate = getISOCurrentDate();

      const prospectData = await collection
        .query(Q.where('discovery_id', discoveryId))
        .fetch();

      // Update prospect data
      if (prospectData.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await prospectData[0].update((rec: any) => {
            rec.callCalendarId = data.callCalendarId;
            rec.callDaysValues = data.callDaysValues;
            rec.deliveryDaysValues = data.deliveryDaysValues;
            rec.deliveryMorningFrom = data.deliveryMorningFrom;
            rec.deliveryMorningTo = data.deliveryMorningTo;
            rec.deliveryAfternoonFrom = data.deliveryAfternoonFrom;
            rec.deliveryAfternoonTo = data.deliveryAfternoonTo;
            rec.visitMorningFrom = data.visitMorningFrom;
            rec.visitMorningTo = data.visitMorningTo;
            rec.visitAfternoonFrom = data.visitAfternoonFrom;
            rec.visitAfternoonTo = data.visitAfternoonTo;
            rec.callPlaceNumber = data.callPlaceNumber;
            rec.deliveryComments = data.deliveryComments;
            rec.distributionCentre = data.distributionCenter;
            rec.sentDatetime = null;
            rec.updateEmployeeNumber = employeeNo;
            rec.updateDatetime = currentDate;
          });
        });
        return true;
      }
      // Insert prospect data
      else {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await collection.create((rec: any) => {
            rec.discoveryId = discoveryId;
            rec.callCalendarId = data.callCalendarId;
            rec.callDaysValues = data.callDaysValues;
            rec.deliveryDaysValues = data.deliveryDaysValues;
            rec.deliveryMorningFrom = data.deliveryMorningFrom;
            rec.deliveryMorningTo = data.deliveryMorningTo;
            rec.deliveryAfternoonFrom = data.deliveryAfternoonFrom;
            rec.deliveryAfternoonTo = data.deliveryAfternoonTo;
            rec.visitMorningFrom = data.visitMorningFrom;
            rec.visitMorningTo = data.visitMorningTo;
            rec.visitAfternoonFrom = data.visitAfternoonFrom;
            rec.visitAfternoonTo = data.visitAfternoonTo;
            rec.callPlaceNumber = data.callPlaceNumber;
            rec.deliveryComments = data.deliveryComments;
            rec.distributionCentre = data.distributionCenter;
            rec.sentDatetime = null;
            rec.updateEmployeeNumber = employeeNo;
            rec.updateDatetime = currentDate;
          });
        });
        return true;
      }
    } catch (error) {
      console.log('insertOrUpdateProspectRCAData error :>> ', error);
      return false;
    }
  }
}
