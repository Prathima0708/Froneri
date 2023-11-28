import {CallsService} from 'src/services/CallsService';
import {CatrinAlternativeRoutesService} from 'src/services/CatrinAlternativeRoutesService';
import {CustomersRouteCustomerAssignmentService} from 'src/services/CustomersRouteCustomerAssignmentService';
import {ParametersValuesService} from 'src/services/ParametersValuesService';
import {getDateLongString, getOnlyDate} from 'src/utils/CommonUtil';

class CLVisitInfoController {
  private crcaService: CustomersRouteCustomerAssignmentService;
  private callsService: CallsService;
  private catrinAlternativeRoutesService: CatrinAlternativeRoutesService;

  constructor() {
    this.crcaService = new CustomersRouteCustomerAssignmentService();
    this.callsService = new CallsService();
    this.catrinAlternativeRoutesService = new CatrinAlternativeRoutesService();
  }

  async getCRCAInformation() {
    const CRCAInformation = await this.crcaService.getCustomerCRCAInfo();
    let crcaInfo = {};
    if (CRCAInformation.length > 0) {
      const CRCAInformationObj = CRCAInformation[0];

      crcaInfo = {
        visitsCalendarId: CRCAInformationObj.visits_calendar_id,
        visitPlaceNumberDays: CRCAInformationObj.visit_place_number_days,
        lastSyncOn: CRCAInformationObj.last_sync_on,
        visitType: CRCAInformationObj.visit_type,
        visitFrequency: CRCAInformationObj.visit_frequency,
        visitTimeTo: CRCAInformationObj.visit_time_to,
        visitTimeFrom: CRCAInformationObj.visit_time_from,
        visitDays: CRCAInformationObj.visit_days,
        deliveryDaysValues: CRCAInformationObj.delivery_days_values,
        callPlaceNumberDays: CRCAInformationObj.call_place_number_days,
        callPlaceNumber: CRCAInformationObj.call_place_number,
        contactType: CRCAInformationObj.contact_type,
        openingHours: CRCAInformationObj.opening_hours,
        deliveryAfternoonHoursFrom:
          CRCAInformationObj.delivery_afternoon_hours_from,
        visitDaysValues: CRCAInformationObj.visit_days_values,
        visitingHours: CRCAInformationObj.visiting_hours,
        closedDays: CRCAInformationObj.closed_days,
        visitPlaceNumber: CRCAInformationObj.visit_place_number,
        deliveryRoute: CRCAInformationObj.delivery_route,
        deliverySequence: CRCAInformationObj.delivery_sequence,
        deliveryMorningHoursTo: CRCAInformationObj.delivery_morning_hours_to,
        callTimeTo: CRCAInformationObj.call_time_to,
        callDays: CRCAInformationObj.call_days,
        preferredVisitTime: CRCAInformationObj.preferred_visit_time,
        deliveryCalendarId: CRCAInformationObj.delivery_calendar_id,
        callTimeFrom: CRCAInformationObj.call_time_from,
        deliveryAfternoonHoursTo:
          CRCAInformationObj.delivery_afternoon_hours_to,
        callFrequency: CRCAInformationObj.call_frequency,
        validToDatetime: CRCAInformationObj.valid_to_datetime,
        deliveryMorningHoursFrom:
          CRCAInformationObj.delivery_morning_hours_from,
        distributionChannel: CRCAInformationObj.distribution_channel,
        callDaysValues: CRCAInformationObj.call_days_values,
        salesOrganization: CRCAInformationObj.sales_organization,
        customerShipTo: CRCAInformationObj.customer_ship_to,
        deliveryDays: CRCAInformationObj.delivery_days,
        validFromDatetime: CRCAInformationObj.valid_from_datetime,
        callsCalendarId: CRCAInformationObj.calls_calendar_id,
        dataOrigin: CRCAInformationObj.data_origin,
        preferedCallTime: CRCAInformationObj.prefered_call_time,
      };
    }

    return crcaInfo;
  }

  // Extract the timing from 168 digit for a week
  async getOpeningAndVisitingHours(sequence: string) {
    if (sequence.length !== 168) {
      return [];
    }

    const timings: any = [];

    for (let i = 0; i < 7; i++) {
      const startIdx = i * 24;
      const endIdx = startIdx + 24;
      const daySequence = sequence.slice(startIdx, endIdx);

      const morningTimeSlot = daySequence.slice(0, 12);
      const afternoonTimeSlot = daySequence.slice(12, 24);
      let morningStartTime = '0';
      let morningEndTime = '0';
      let afternoonStartTime = '0';
      let afternoonEndTime = '0';
      if (morningTimeSlot !== '000000000000') {
        const morningStartTime1 = morningTimeSlot.slice(0, 2);
        const morningStartTime2 = morningTimeSlot.slice(2, 4);
        const morningEndTime1 = morningTimeSlot.slice(6, 8);
        const morningEndTime2 = morningTimeSlot.slice(8, 10);
        morningStartTime = morningStartTime1 + '.' + morningStartTime2;
        morningEndTime = morningEndTime1 + '.' + morningEndTime2;
      }
      if (afternoonTimeSlot !== '000000000000') {
        const afternoonStartTime1 = afternoonTimeSlot.slice(0, 2);
        const afternoonStartTime2 = afternoonTimeSlot.slice(2, 4);
        const afternoonEndTime1 = afternoonTimeSlot.slice(6, 8);
        const afternoonEndTime2 = afternoonTimeSlot.slice(8, 10);

        afternoonStartTime = afternoonStartTime1 + '.' + afternoonStartTime2;
        afternoonEndTime = afternoonEndTime1 + '.' + afternoonEndTime2;
      }
      let obj = {
        morningStartTime: parseFloat(morningStartTime),
        morningEndTime: parseFloat(morningEndTime),
        afternoonStartTime: parseFloat(afternoonStartTime),
        afternoonEndTime: parseFloat(afternoonEndTime),
      };
      timings.push(obj);
    }

    /**
     * Create a timing for morning & afternoon for each day
     * return -> [morningTiming: [{x: 'day', y: Starttiming, y0: end},...],
     *              afternoonTiming: [{x: 'day', y: Starttiming, y0: end},...]]
     */
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const morningTiming: any = [];
    const afternoonTiming: any = [];
    for (let i = 0; i < 7; i++) {
      let morningObj = {
        x: weekDays[i],
        y: timings[i].morningEndTime,
        y0: timings[i].morningStartTime,
      };
      let afternoonObj = {
        x: weekDays[i],
        y: timings[i].afternoonStartTime,
        y0: timings[i].afternoonEndTime,
      };
      morningTiming.push(morningObj);
      afternoonTiming.push(afternoonObj);
      // const morningTiming = [
      //   {x: 'Mon', y: timings[i].morningEndTime, y0: timings[i].morningEndTime},
      //   {x: 'Tue', y: 13, y0: 10},
      //   {x: 'Wed', y: 14, y0: 13},
      //   {x: 'Thu', y: 12, y0: 11},
      //   {x: 'Fri', y: 11, y0: 8},
      //   {x: 'Sat', y: 0, y0: 0},
      //   {x: 'Sun', y: 0, y0: 0},
      // ];
      // const afternoonTiming = [
      //   {x: 'Mon', y: 0, y0: 0},
      //   {x: 'Tue', y: 13, y0: 10},
      //   {x: 'Wed', y: 14, y0: 13},
      //   {x: 'Thu', y: 12, y0: 11},
      //   {x: 'Fri', y: 11, y0: 8},
      //   {x: 'Sat', y: 0, y0: 0},
      //   {x: 'Sun', y: 0, y0: 0},
      // ];
    }
    const finalTimingArray = [
      {morningTiming: morningTiming, afternoonTiming: afternoonTiming},
    ];

    return finalTimingArray;
  }
  // Background bar - CRCA / Business hours
  async getbackgroundBarHours(openingHours: any, visitingHours: any) {
    let openingMorningTimeSlot = [];
    let openingAfternoonTimeSlot = [];
    let visitingMorningTimeSlot = [];
    let visitingAfternoonTimeSlot = [];
    if (openingHours.length === 0 && visitingHours.length === 0) {
      return [];
    }
    if (openingHours.length > 0) {
      openingMorningTimeSlot = openingHours[0].morningTiming;
      openingAfternoonTimeSlot = openingHours[0].afternoonTiming;
    }
    if (visitingHours.length > 0) {
      visitingMorningTimeSlot = visitingHours[0].morningTiming;
      visitingAfternoonTimeSlot = visitingHours[0].afternoonTiming;
    }
    let backgroundbarTimeSlot: any = [];
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    if (
      openingMorningTimeSlot.length > 0 &&
      visitingMorningTimeSlot.length > 0
    ) {
      // check the array for each day whether the value is 0 or not
      for (let i = 0; i < 7; i++) {
        const value =
          openingMorningTimeSlot[i].y0 != 0 ||
          openingAfternoonTimeSlot[i].y0 != 0 ||
          visitingMorningTimeSlot[i].y0 != 0 ||
          visitingAfternoonTimeSlot[i].y0 != 0
            ? 1
            : 0;
        let obj = {
          x: weekDays[i],
          y: 0,
          y0: 0,
        };
        if (value === 1) {
          obj = {
            x: weekDays[i],
            y: 20,
            y0: 6,
          };
        }
        backgroundbarTimeSlot.push(obj);
      }
    } else if (openingMorningTimeSlot.length > 0) {
      // check the array for each day whether the value is 0 or not
      for (let i = 0; i < 7; i++) {
        const value =
          openingMorningTimeSlot[i].y0 != 0 ||
          openingAfternoonTimeSlot[i].y0 != 0
            ? 1
            : 0;
        let obj = {
          x: weekDays[i],
          y: 0,
          y0: 0,
        };
        if (value === 1) {
          obj = {
            x: weekDays[i],
            y: 20,
            y0: 6,
          };
        }
        backgroundbarTimeSlot.push(obj);
      }
    } else {
      // check the array for each day whether the value is 0 or not
      for (let i = 0; i < 7; i++) {
        const value =
          visitingMorningTimeSlot[i].y0 != 0 ||
          visitingAfternoonTimeSlot[i].y0 != 0
            ? 1
            : 0;
        let obj = {
          x: weekDays[i],
          y: 0,
          y0: 0,
        };
        if (value === 1) {
          obj = {
            x: weekDays[i],
            y: 20,
            y0: 6,
          };
        }
        backgroundbarTimeSlot.push(obj);
      }
    }
    return backgroundbarTimeSlot;
  }

  async getNextTenFutureVisits() {
    const customerInfoData: any = await this.callsService.getCLCustomerInfo();
    const isRemoteCustomer = customerInfoData?.isCallApi;

    let visits;
    if (isRemoteCustomer) {
      visits = await this.callsService.getNextTenFutureVisitsOnline();
    } else {
      visits = await this.callsService.getNextTenFutureVisits();
    }
    console.log('visits response ->', visits);
    let results: any = [];
    for (const element of visits) {
      let obj: any = {};
      let dayString = getDateLongString(element.callFromDateTime);
      obj.day = dayString.split(',')[0].trim();
      obj.value = getOnlyDate(element.callFromDateTime);
      results.push(obj);
    }
    return results;
  }

  async getNextTenDeliveries(standardDeliveryDays: string) {
    let deliveryDays = standardDeliveryDays;
    console.log('deliveryDays', deliveryDays);
    const parametersValuesService = new ParametersValuesService();
    const enableAternativeToursFromCatrin =
      await parametersValuesService.getParameterValue(
        'Enable_Alternative_Tours_From_Catrin',
      );

    const enableManualRcaManagement =
      await parametersValuesService.getParameterValue(
        'Enable_Manual_RCA_Management',
      );
    const employeeInfo = await this.crcaService.getLoggedInEmployeeInfo();
    const enableAlternativeTours =
      employeeInfo.length > 0 ? employeeInfo[0].enableAlternativeTours : '';

    if (
      Number(enableAternativeToursFromCatrin) === Number(0) ||
      Number(enableManualRcaManagement) === Number(0) ||
      Number(enableAlternativeTours) === Number(1)
    ) {
      console.log('Do not consider alternative delivery days');
    } else {
      const deliveries =
        await this.catrinAlternativeRoutesService.getNextTenDeliveries();
      console.log('deliveries', deliveries);
      if (deliveries.length != 0) {
        let monRoute =
          deliveries[0].deliveryRouteMonday == ''
            ? ''
            : deliveries[0].deliveryRouteMonday;
        let tueRoute =
          deliveries[0].deliveryRouteTuesday == ''
            ? ''
            : deliveries[0].deliveryRouteTuesday;
        let wedRoute =
          deliveries[0].deliveryRouteWednesday == ''
            ? ''
            : deliveries[0].deliveryRouteWednesday;
        let thursRoute =
          deliveries[0].deliveryRouteThursday == ''
            ? ''
            : deliveries[0].deliveryRouteThursday;
        let friRoute =
          deliveries[0].deliveryRouteFriday == ''
            ? ''
            : deliveries[0].deliveryRouteFriday;
        let satRoute =
          deliveries[0].deliveryRouteSaturday == ''
            ? ''
            : deliveries[0].deliveryRouteSaturday;
        let sunRoute =
          deliveries[0].deliveryRouteSunday == ''
            ? ''
            : deliveries[0].deliveryRouteSunday;

        if (monRoute != '') {
          deliveryDays =
            deliveryDays.substring(0, 0) + '1' + deliveryDays.substring(1);
        }
        if (tueRoute != '') {
          deliveryDays =
            deliveryDays.substring(0, 1) + '1' + deliveryDays.substring(2);
        }
        if (wedRoute != '') {
          deliveryDays =
            deliveryDays.substring(0, 2) + '1' + deliveryDays.substring(3);
        }
        if (thursRoute != '') {
          deliveryDays =
            deliveryDays.substring(0, 3) + '1' + deliveryDays.substring(4);
        }
        if (friRoute != '') {
          deliveryDays =
            deliveryDays.substring(0, 4) + '1' + deliveryDays.substring(5);
        }
        if (satRoute != '') {
          deliveryDays =
            deliveryDays.substring(0, 5) + '1' + deliveryDays.substring(6);
        }
        if (sunRoute != '') {
          deliveryDays =
            deliveryDays.substring(0, 6) + '1' + deliveryDays.substring(7);
        }
      }
    }
    const currentDate = new Date();
    const deliveryDates = [];
    let dayOfWeek = currentDate.getDay() - 1; // Adjust for starting from Monday (0-based index)

    for (let i = 1; deliveryDates.length < 10; i++) {
      const nextDate = new Date(
        currentDate.getTime() + i * 24 * 60 * 60 * 1000,
      );
      const nextDayOfWeek = (dayOfWeek + i) % 7; // Increment day of the week cyclically

      // Skip the current date if it falls on a delivery day
      if (deliveryDays[dayOfWeek] === '1' && i === 1) {
        continue;
      }

      if (deliveryDays[nextDayOfWeek] === '1') {
        deliveryDates.push(nextDate);
      }
    }
    console.log('deliveryDate', deliveryDays, deliveryDates);
    let results: any = [];
    for (const element of deliveryDates) {
      let obj: any = {};
      let dayString = getDateLongString(element.toString());
      obj.day = dayString.split(',')[0].trim();
      obj.value = getOnlyDate(element.toString());
      results.push(obj);
    }
    return results;
  }

  async getLatestTwoVisitNotes() {
    const customerInfoData: any = await this.callsService.getCLCustomerInfo();
    const isRemoteCustomer = customerInfoData?.isCallApi;
    let results = [];
    if (isRemoteCustomer) {
      results = await this.callsService.getLatestTwoVisitNotesOnline();
    } else {
      results = await this.callsService.getLatestTwoVisitNotes();
    }
    let finalResults: any = [];
    for (let i = 0; i < results.length; i++) {
      let obj: any = {};
      let notes = results[i].visitNote ? results[i].visitNote : '';
      notes = notes.split('-');
      obj.visitDate = results[i].visitDate
        ? getOnlyDate(results[i].visitDate)
        : '';
      obj.salesRepName = results[i].salesRepName ? results[i].salesRepName : '';

      obj.visitNote = notes[1] ? notes[1] : '';
      obj.visitObjective = notes[0] ? notes[0] : '';
      finalResults.push(obj);
    }
    return finalResults;
  }

  async getLastVisitInfo(idCall: string) {
    const customerInfoData: any = await this.callsService.getCLCustomerInfo();
    const isRemoteCustomer = customerInfoData?.isCallApi;

    let lastVisitInfo = [];

    if (isRemoteCustomer) {
      lastVisitInfo = await this.callsService.getLastVisitInfoOnline(idCall);
      lastVisitInfo = [lastVisitInfo];
    }

    lastVisitInfo = await this.callsService.getLastVisitInfo(idCall);

    if (lastVisitInfo.length > 0) {
      return lastVisitInfo;
    }

    return [];
  }
}
export default new CLVisitInfoController();
