import {CalendarsService} from 'src/services/CalendarsService';
import {CallPlacesService} from 'src/services/CallPlacesService';
import {CustomersRouteCustomerAssignmentService} from 'src/services/CustomersRouteCustomerAssignmentService';
import {CustomersService} from 'src/services/CustomersService';
import {DiscoveryControlsService} from 'src/services/DiscoveryControlsService';
import {DiscoveryRcaService} from 'src/services/DiscoveryRcaService';
import {PlantZipCodeMappingService} from 'src/services/PlantZipCodeMappingService';
import {RegionalDistributionCentersService} from 'src/services/RegionalDistributionCentersService';
import {TextsService} from 'src/services/TextsService';
import {PLP_RCA_CONTROL_NAME} from 'src/utils/ControlName';
import {RCA_HOURS_DROPDOWN} from 'src/utils/DropdownConst';

class PLBasicInfoController {
  private calendarsService: CalendarsService;
  private textsService: TextsService;
  private regionalDistributionCentersService: RegionalDistributionCentersService;
  private callPlacesService: CallPlacesService;
  private discoveryRcaService: DiscoveryRcaService;
  private customersRouteCustomerAssignmentService: CustomersRouteCustomerAssignmentService;
  private plantZipCodeMappingService: PlantZipCodeMappingService;
  private customersService: CustomersService;
  private discoveryControlsService: DiscoveryControlsService;

  constructor() {
    this.calendarsService = new CalendarsService();
    this.textsService = new TextsService();
    this.regionalDistributionCentersService =
      new RegionalDistributionCentersService();
    this.callPlacesService = new CallPlacesService();
    this.discoveryRcaService = new DiscoveryRcaService();
    this.customersRouteCustomerAssignmentService =
      new CustomersRouteCustomerAssignmentService();
    this.plantZipCodeMappingService = new PlantZipCodeMappingService();
    this.customersService = new CustomersService();
    this.discoveryControlsService = new DiscoveryControlsService();
  }

  // Returns season and call frequency dropdown data
  async getSeasonData() {
    let seasonData = await this.calendarsService.getSeasonData();

    const summerDescription = await this.textsService.getTextsValue(
      'MSG_SEASON_SUMMER',
    );
    const winterDescription = await this.textsService.getTextsValue(
      'MSG_SEASON_WINTER',
    );
    const otherDescription = await this.textsService.getTextsValue(
      'MSG_SEASON_OTHER',
    );

    const summerCalendarIds: any = [];
    const winterCalendarIds: any = [];
    const otherCalendarIds: any = [];

    const summerData = seasonData.find((item: any) => item.season === 'S');
    const winterData = seasonData.find((item: any) => item.season === 'W');
    const otherData = seasonData.find(
      (item: any) => item.season !== 'S' && item.season !== 'W',
    );

    seasonData.forEach((item: any) => {
      if (item.season === 'S') {
        summerCalendarIds.push({
          label: item.calendarId,
          value: item.calendarId,
          frequency: item.frequency,
        });
      } else if (item.season === 'W') {
        winterCalendarIds.push({
          label: item.calendarId,
          value: item.calendarId,
          frequency: item.frequency,
        });
      } else {
        otherCalendarIds.push({
          label: item.calendarId,
          value: item.calendarId,
          frequency: item.frequency,
        });
      }
    });

    seasonData = [
      {
        ...summerData,
        description: summerDescription,
        data: summerCalendarIds,
      },
      {
        ...winterData,
        description: winterDescription,
        data: winterCalendarIds,
      },
    ];

    if (otherCalendarIds.length > 0) {
      seasonData.push({
        ...otherData,
        description: otherDescription,
        data: otherCalendarIds,
      });
    }

    return seasonData;
  }

  // Returns distribution center dropdown data
  async getDistributionCenter() {
    return await this.regionalDistributionCentersService.getDistributionCenter();
  }

  // Returns transit call place dropdown data
  async getTransitCallPlace(searchText: string) {
    return await this.callPlacesService.getTransitCallPlace(searchText);
  }

  // Returns week data
  async getWeekData() {
    const mondayText = await this.textsService.getTextsValue(
      'MSG_CALL_DELIVERY_DAY_MONDAY',
    );
    const tuesdayText = await this.textsService.getTextsValue(
      'MSG_CALL_DELIVERY_DAY_TUESDAY',
    );
    const wednesdayText = await this.textsService.getTextsValue(
      'MSG_CALL_DELIVERY_DAY_WEDNESDAY',
    );
    const thursdayText = await this.textsService.getTextsValue(
      'MSG_CALL_DELIVERY_DAY_THURSDAY',
    );
    const fridayText = await this.textsService.getTextsValue(
      'MSG_CALL_DELIVERY_DAY_FRIDAY',
    );
    const saturdayText = await this.textsService.getTextsValue(
      'MSG_CALL_DELIVERY_DAY_SATURDAY',
    );
    const sundayText = await this.textsService.getTextsValue(
      'MSG_CALL_DELIVERY_DAY_SUNDAY',
    );

    const weekData = [
      {value: 0, label: mondayText},
      {value: 1, label: tuesdayText},
      {value: 2, label: wednesdayText},
      {value: 3, label: thursdayText},
      {value: 4, label: fridayText},
      {value: 5, label: saturdayText},
      {value: 6, label: sundayText},
    ];

    return weekData;
  }

  // Returns today's data value by calculating on 16 digit time string
  private getHoursData(timeString: string) {
    if (timeString.trim().length !== 16) {
      return ['-1', '-1', '-1', '-1'];
    }

    const chunkSize = Math.ceil(timeString.length / 8);

    const timeParts = Array.from({length: 8}, (_, index) =>
      timeString.substring(index * chunkSize, (index + 1) * chunkSize),
    );

    const morningFrom = timeParts[0] + ':' + timeParts[1];
    const morningTo = timeParts[2] + ':' + timeParts[3];
    const afternoonFrom = timeParts[4] + ':' + timeParts[5];
    const afternoonTo = timeParts[6] + ':' + timeParts[7];

    const morningFromValue = RCA_HOURS_DROPDOWN.find(
      (item: any) => item.label === morningFrom,
    );
    const morningToValue = RCA_HOURS_DROPDOWN.find(
      (item: any) => item.label === morningTo,
    );
    const afternoonFromValue = RCA_HOURS_DROPDOWN.find(
      (item: any) => item.label === afternoonFrom,
    );
    const afternoonToValue = RCA_HOURS_DROPDOWN.find(
      (item: any) => item.label === afternoonTo,
    );

    return [
      morningFromValue ? morningFromValue.value : '-1',
      morningToValue ? morningToValue.value : '-1',
      afternoonFromValue ? afternoonFromValue.value : '-1',
      afternoonToValue ? afternoonToValue.value : '-1',
    ];
  }

  // Returns prospect opening and visiting hours data
  async getProspectOpeningAndVisitingHoursData() {
    const openingHoursData = await this.discoveryRcaService.getOpeningHours();
    const visitingHoursData = await this.discoveryRcaService.getVisitingHours();

    let openingHours = {};
    let visitingHours = {};

    if (openingHoursData.length <= 0 && visitingHoursData.length <= 0) {
      return {};
    }

    if (openingHoursData.length > 0) {
      const openingHoursObj = openingHoursData[0];
      const [
        mondayMorningFrom,
        mondayMorningTo,
        mondayAfternoonFrom,
        mondayAfternoonTo,
      ] = this.getHoursData(openingHoursObj.openingHoursMonday);
      const [
        tuesdayMorningFrom,
        tuesdayMorningTo,
        tuesdayAfternoonFrom,
        tuesdayAfternoonTo,
      ] = this.getHoursData(openingHoursObj.openingHoursTuesday);
      const [
        wednesdayMorningFrom,
        wednesdayMorningTo,
        wednesdayAfternoonFrom,
        wednesdayAfternoonTo,
      ] = this.getHoursData(openingHoursObj.openingHoursWednesday);
      const [
        thursdayMorningFrom,
        thursdayMorningTo,
        thursdayAfternoonFrom,
        thursdayAfternoonTo,
      ] = this.getHoursData(openingHoursObj.openingHoursThursday);
      const [
        fridayMorningFrom,
        fridayMorningTo,
        fridayAfternoonFrom,
        fridayAfternoonTo,
      ] = this.getHoursData(openingHoursObj.openingHoursFriday);
      const [
        saturdayMorningFrom,
        saturdayMorningTo,
        saturdayAfternoonFrom,
        saturdayAfternoonTo,
      ] = this.getHoursData(openingHoursObj.openingHoursSaturday);
      const [
        sundayMorningFrom,
        sundayMorningTo,
        sundayAfternoonFrom,
        sundayAfternoonTo,
      ] = this.getHoursData(openingHoursObj.openingHoursSunday);

      openingHours = {
        mondayMorningFrom,
        mondayMorningTo,
        mondayAfternoonFrom,
        mondayAfternoonTo,
        tuesdayMorningFrom,
        tuesdayMorningTo,
        tuesdayAfternoonFrom,
        tuesdayAfternoonTo,
        wednesdayMorningFrom,
        wednesdayMorningTo,
        wednesdayAfternoonFrom,
        wednesdayAfternoonTo,
        thursdayMorningFrom,
        thursdayMorningTo,
        thursdayAfternoonFrom,
        thursdayAfternoonTo,
        fridayMorningFrom,
        fridayMorningTo,
        fridayAfternoonFrom,
        fridayAfternoonTo,
        saturdayMorningFrom,
        saturdayMorningTo,
        saturdayAfternoonFrom,
        saturdayAfternoonTo,
        sundayMorningFrom,
        sundayMorningTo,
        sundayAfternoonFrom,
        sundayAfternoonTo,
      };
    }

    if (visitingHoursData.length > 0) {
      const visitingHoursObj = visitingHoursData[0];
      const [
        mondayMorningFrom,
        mondayMorningTo,
        mondayAfternoonFrom,
        mondayAfternoonTo,
      ] = this.getHoursData(visitingHoursObj.visitingHoursMonday);

      const [
        tuesdayMorningFrom,
        tuesdayMorningTo,
        tuesdayAfternoonFrom,
        tuesdayAfternoonTo,
      ] = this.getHoursData(visitingHoursObj.visitingHoursTuesday);
      const [
        wednesdayMorningFrom,
        wednesdayMorningTo,
        wednesdayAfternoonFrom,
        wednesdayAfternoonTo,
      ] = this.getHoursData(visitingHoursObj.visitingHoursWednesday);
      const [
        thursdayMorningFrom,
        thursdayMorningTo,
        thursdayAfternoonFrom,
        thursdayAfternoonTo,
      ] = this.getHoursData(visitingHoursObj.visitingHoursThursday);
      const [
        fridayMorningFrom,
        fridayMorningTo,
        fridayAfternoonFrom,
        fridayAfternoonTo,
      ] = this.getHoursData(visitingHoursObj.visitingHoursFriday);
      const [
        saturdayMorningFrom,
        saturdayMorningTo,
        saturdayAfternoonFrom,
        saturdayAfternoonTo,
      ] = this.getHoursData(visitingHoursObj.visitingHoursSaturday);
      const [
        sundayMorningFrom,
        sundayMorningTo,
        sundayAfternoonFrom,
        sundayAfternoonTo,
      ] = this.getHoursData(visitingHoursObj.visitingHoursSunday);

      visitingHours = {
        mondayMorningFrom,
        mondayMorningTo,
        mondayAfternoonFrom,
        mondayAfternoonTo,
        tuesdayMorningFrom,
        tuesdayMorningTo,
        tuesdayAfternoonFrom,
        tuesdayAfternoonTo,
        wednesdayMorningFrom,
        wednesdayMorningTo,
        wednesdayAfternoonFrom,
        wednesdayAfternoonTo,
        thursdayMorningFrom,
        thursdayMorningTo,
        thursdayAfternoonFrom,
        thursdayAfternoonTo,
        fridayMorningFrom,
        fridayMorningTo,
        fridayAfternoonFrom,
        fridayAfternoonTo,
        saturdayMorningFrom,
        saturdayMorningTo,
        saturdayAfternoonFrom,
        saturdayAfternoonTo,
        sundayMorningFrom,
        sundayMorningTo,
        sundayAfternoonFrom,
        sundayAfternoonTo,
      };
    }

    return {openingHours, visitingHours};
  }

  // Returns the formatted hours data
  private getFormattedHoursData(input: string) {
    const divideString = (input: any, size: number) => {
      return Array.from({length: Math.ceil(input.length / size)}, (_, i) =>
        input.substr(i * size, size),
      );
    };

    const takeFirstFour = (input: string) => {
      return input.substring(0, 4);
    };

    const combineOutput = (arrayOfStrings: any) => {
      return arrayOfStrings.join('');
    };

    const dividedInTwelve = divideString(input, 12);
    const processedParts = dividedInTwelve.map(part => {
      const dividedInSix = divideString(part, 6);
      const firstFourFromDividedInSix = dividedInSix.map(takeFirstFour);
      return combineOutput(firstFourFromDividedInSix);
    });

    return combineOutput(processedParts);
  }

  // Return the formatted opening and visiting hours data
  getFormattedOpeningAndVisitingHoursData(openingAndVisitingHoursDataObj: any) {
    let openingHours = {};
    let visitingHours = {};

    const openingHoursData = openingAndVisitingHoursDataObj.openingHours;
    const visitingHoursData = openingAndVisitingHoursDataObj.visitingHours;

    [openingHoursData, visitingHoursData].forEach(
      (data: any, index: number) => {
        if (data.length === 168) {
          const chunkSize = Math.ceil(data.length / 7);

          const [
            mondayTimings,
            tuesdayTimings,
            wednesdayTimings,
            thursdayTimings,
            fridayTimings,
            saturdayTimings,
            sundayTimings,
          ] = Array.from({length: 7}, (_, index) =>
            data.substring(index * chunkSize, (index + 1) * chunkSize),
          );

          const [
            mondayMorningFrom,
            mondayMorningTo,
            mondayAfternoonFrom,
            mondayAfternoonTo,
          ] = this.getHoursData(this.getFormattedHoursData(mondayTimings));
          const [
            tuesdayMorningFrom,
            tuesdayMorningTo,
            tuesdayAfternoonFrom,
            tuesdayAfternoonTo,
          ] = this.getHoursData(this.getFormattedHoursData(tuesdayTimings));
          const [
            wednesdayMorningFrom,
            wednesdayMorningTo,
            wednesdayAfternoonFrom,
            wednesdayAfternoonTo,
          ] = this.getHoursData(this.getFormattedHoursData(wednesdayTimings));
          const [
            thursdayMorningFrom,
            thursdayMorningTo,
            thursdayAfternoonFrom,
            thursdayAfternoonTo,
          ] = this.getHoursData(this.getFormattedHoursData(thursdayTimings));
          const [
            fridayMorningFrom,
            fridayMorningTo,
            fridayAfternoonFrom,
            fridayAfternoonTo,
          ] = this.getHoursData(this.getFormattedHoursData(fridayTimings));
          const [
            saturdayMorningFrom,
            saturdayMorningTo,
            saturdayAfternoonFrom,
            saturdayAfternoonTo,
          ] = this.getHoursData(this.getFormattedHoursData(saturdayTimings));
          const [
            sundayMorningFrom,
            sundayMorningTo,
            sundayAfternoonFrom,
            sundayAfternoonTo,
          ] = this.getHoursData(this.getFormattedHoursData(sundayTimings));

          const formattedData = {
            mondayMorningFrom,
            mondayMorningTo,
            mondayAfternoonFrom,
            mondayAfternoonTo,
            tuesdayMorningFrom,
            tuesdayMorningTo,
            tuesdayAfternoonFrom,
            tuesdayAfternoonTo,
            wednesdayMorningFrom,
            wednesdayMorningTo,
            wednesdayAfternoonFrom,
            wednesdayAfternoonTo,
            thursdayMorningFrom,
            thursdayMorningTo,
            thursdayAfternoonFrom,
            thursdayAfternoonTo,
            fridayMorningFrom,
            fridayMorningTo,
            fridayAfternoonFrom,
            fridayAfternoonTo,
            saturdayMorningFrom,
            saturdayMorningTo,
            saturdayAfternoonFrom,
            saturdayAfternoonTo,
            sundayMorningFrom,
            sundayMorningTo,
            sundayAfternoonFrom,
            sundayAfternoonTo,
          };

          if (index === 0) {
            openingHours = formattedData;
          } else {
            visitingHours = formattedData;
          }
        }
      },
    );

    return {openingHours, visitingHours};
  }

  // Returns customer opening and visiting hours data
  async getCustomerOpeningAndVisitingHoursData() {
    const openingAndVisitingHoursData =
      await this.customersRouteCustomerAssignmentService.getOpeningAndVisitingHours();

    if (openingAndVisitingHoursData.length === 0) {
      return {};
    }

    const openingAndVisitingHoursDataObj = openingAndVisitingHoursData[0];

    const {openingHours, visitingHours} =
      this.getFormattedOpeningAndVisitingHoursData(
        openingAndVisitingHoursDataObj,
      );

    return {openingHours, visitingHours};
  }

  // Returns opening and visiting hours data
  async getOpeningAndVisitingHoursData() {
    const prospectData = await this.discoveryRcaService.getPLProspectInfo();

    if (
      prospectData?.statusType &&
      prospectData?.statusType.toLowerCase() === 'c'
    ) {
      return await this.getCustomerOpeningAndVisitingHoursData();
    } else {
      return await this.getProspectOpeningAndVisitingHoursData();
    }
  }

  // Format data for prospect and customer
  private async formatProspectOrCustomerData(
    dataObj: any,
    isCustomer: boolean = false,
  ) {
    if (!dataObj?.distributionCentre && !isCustomer) {
      const distributionCenterData =
        await this.plantZipCodeMappingService.getDistributionCenterFromPostalCode();

      if (distributionCenterData.length > 0) {
        dataObj.distributionCentre = distributionCenterData[0].plantNumber;
      } else {
        dataObj.distributionCentre = '';
      }
    }

    if (
      dataObj?.callDaysValues &&
      dataObj?.callDaysValues.trim().length === 21
    ) {
      const splittedData = Array.from({length: 7}, (_, index) =>
        Number(dataObj?.callDaysValues.substring(index * 3, (index + 1) * 3)),
      );

      const [
        mondayData,
        tuesdayData,
        wednesdayData,
        thursdayData,
        fridayData,
        saturdayData,
        sundayData,
      ] = splittedData;

      dataObj = {
        ...dataObj,
        mondayCall: mondayData > 0,
        tuesdayCall: tuesdayData > 0,
        wednesdayCall: wednesdayData > 0,
        thursdayCall: thursdayData > 0,
        fridayCall: fridayData > 0,
        saturdayCall: saturdayData > 0,
        sundayCall: sundayData > 0,
      };

      const filteredData = splittedData.find((data: any) => data !== 0);

      if (filteredData) {
        if (filteredData <= 7) {
          dataObj.callWeek = '1';
        } else {
          dataObj.callWeek = Math.floor(filteredData / 7 + 1).toString();
        }
      } else {
        dataObj.callWeek = '';
      }
    }

    if (
      dataObj?.deliveryDaysValues &&
      dataObj?.deliveryDaysValues.trim().length === 21
    ) {
      const splittedData = Array.from({length: 7}, (_, index) =>
        Number(
          dataObj?.deliveryDaysValues.substring(index * 3, (index + 1) * 3),
        ),
      );

      const filteredData = splittedData.find((data: any) => data !== 0);

      if (filteredData) {
        if (filteredData <= 7) {
          dataObj.deliveryWeek = '1';
        } else {
          dataObj.deliveryWeek = Math.floor(filteredData / 7 + 1).toString();
        }
      } else {
        dataObj.deliveryWeek = '';
      }

      const [
        mondayData,
        tuesdayData,
        wednesdayData,
        thursdayData,
        fridayData,
        saturdayData,
        sundayData,
      ] = splittedData;

      dataObj = {
        ...dataObj,
        mondayDropdown:
          mondayData === 0
            ? -1
            : Number(mondayData) - (Number(dataObj.deliveryWeek) - 1) * 7 - 1,
        tuesdayDropdown:
          tuesdayData === 0
            ? -1
            : tuesdayData - (Number(dataObj.deliveryWeek) - 1) * 7 - 1,
        wednesdayDropdown:
          wednesdayData === 0
            ? -1
            : wednesdayData - (Number(dataObj.deliveryWeek) - 1) * 7 - 1,
        thursdayDropdown:
          thursdayData === 0
            ? -1
            : thursdayData - (Number(dataObj.deliveryWeek) - 1) * 7 - 1,
        fridayDropdown:
          fridayData === 0
            ? -1
            : fridayData - (Number(dataObj.deliveryWeek) - 1) * 7 - 1,
        saturdayDropdown:
          saturdayData === 0
            ? -1
            : saturdayData - (Number(dataObj.deliveryWeek) - 1) * 7 - 1,
        sundayDropdown:
          sundayData === 0
            ? -1
            : sundayData - (Number(dataObj.deliveryWeek) - 1) * 7 - 1,
      };
    }

    return dataObj;
  }

  // Return prospect data
  async getProspectRCAData() {
    const prospectData = await this.discoveryRcaService.getProspectRCAData();

    if (prospectData.length === 0) {
      return [];
    }

    const prospectDataObj = await this.formatProspectOrCustomerData(
      prospectData[0],
    );

    return [prospectDataObj];
  }

  // Return customer data
  async getCustomerRCAData() {
    const prospectData = await this.customersService.getPLProspectInfo();

    const customerData =
      await this.customersRouteCustomerAssignmentService.getCustomerCRCAInfoWithCallPlace();
    const customerInfo = await this.customersService.getCustomerInfo(
      prospectData?.customerShipTo,
      prospectData?.salesOrganization,
      prospectData?.distributionChannel,
    );
    const deliveryCommentData =
      await this.discoveryRcaService.getDeliveryComment();

    if (customerData.length === 0) {
      return [];
    }

    const customerDataObjTemp = customerData[0];
    let customerDataObj = {
      visitsCalendarId: customerDataObjTemp.visits_calendar_id,
      visitPlaceNumberDays: customerDataObjTemp.visit_place_number_days,
      visitType: customerDataObjTemp.visit_type,
      visitFrequency: customerDataObjTemp.visit_frequency,
      visitTimeTo: customerDataObjTemp.visit_time_to,
      visitTimeFrom: customerDataObjTemp.visit_time_from,
      visitDays: customerDataObjTemp.visit_days,
      deliveryDaysValues: customerDataObjTemp.delivery_days_values,
      callPlaceNumberDays: customerDataObjTemp.call_place_number_days,
      callPlaceNumber: customerDataObjTemp.call_place_number,
      contactType: customerDataObjTemp.contact_type,
      openingHours: customerDataObjTemp.opening_hours,
      deliveryAfternoonHoursFrom:
        customerDataObjTemp.delivery_afternoon_hours_from,
      visitDaysValues: customerDataObjTemp.visit_days_values,
      visitingHours: customerDataObjTemp.visiting_hours,
      closedDays: customerDataObjTemp.closed_days,
      visitPlaceNumber: customerDataObjTemp.visit_place_number,
      deliveryRoute: customerDataObjTemp.delivery_route,
      deliverySequence: customerDataObjTemp.delivery_sequence,
      deliveryMorningHoursTo: customerDataObjTemp.delivery_morning_hours_to,
      callTimeTo: customerDataObjTemp.call_time_to,
      callDays: customerDataObjTemp.call_days,
      preferredVisitTime: customerDataObjTemp.preferred_visit_time,
      deliveryCalendarId: customerDataObjTemp.delivery_calendar_id,
      callTimeFrom: customerDataObjTemp.call_time_from,
      deliveryAfternoonHoursTo: customerDataObjTemp.delivery_afternoon_hours_to,
      callFrequency: customerDataObjTemp.call_frequency,
      validToDatetime: customerDataObjTemp.valid_to_datetime,
      deliveryMorningHoursFrom: customerDataObjTemp.delivery_morning_hours_from,
      distributionChannel: customerDataObjTemp.distribution_channel,
      callDaysValues: customerDataObjTemp.call_days_values,
      salesOrganization: customerDataObjTemp.sales_organization,
      customerShipTo: customerDataObjTemp.customer_ship_to,
      deliveryDays: customerDataObjTemp.delivery_days,
      validFromDatetime: customerDataObjTemp.valid_from_datetime,
      callCalendarId: customerDataObjTemp.calls_calendar_id,
      preferedCallTime: customerDataObjTemp.prefered_call_time,
      callPlaceName:
        customerDataObjTemp.call_place_number +
        ' ' +
        customerDataObjTemp.description,
      distributionCenter:
        customerInfo.length > 0 && customerInfo[0]?.pickingPlantNumber
          ? customerInfo[0]?.pickingPlantNumber
          : '',
      deliveryComments:
        deliveryCommentData.length > 0 &&
        deliveryCommentData[0]?.deliveryComments
          ? deliveryCommentData[0].deliveryComments
          : '',
    };

    customerDataObj = await this.formatProspectOrCustomerData(
      customerDataObj,
      true,
    );

    return [customerDataObj];
  }

  // Arranging opening and visiting hours data before save
  private arrangeOpeningAndVisitingHoursData(data: any) {
    const morningFromData = [
      data.mondayMorningFrom,
      data.tuesdayMorningFrom,
      data.wednesdayMorningFrom,
      data.thursdayMorningFrom,
      data.fridayMorningFrom,
      data.saturdayMorningFrom,
      data.sundayMorningFrom,
    ];

    const morningToData = [
      data.mondayMorningTo,
      data.tuesdayMorningTo,
      data.wednesdayMorningTo,
      data.thursdayMorningTo,
      data.fridayMorningTo,
      data.saturdayMorningTo,
      data.sundayMorningTo,
    ];

    const afternoonFromData = [
      data.mondayAfternoonFrom,
      data.tuesdayAfternoonFrom,
      data.wednesdayAfternoonFrom,
      data.thursdayAfternoonFrom,
      data.fridayAfternoonFrom,
      data.saturdayAfternoonFrom,
      data.sundayAfternoonFrom,
    ];

    const afternoonToData = [
      data.mondayAfternoonTo,
      data.tuesdayAfternoonTo,
      data.wednesdayAfternoonTo,
      data.thursdayAfternoonTo,
      data.fridayAfternoonTo,
      data.saturdayAfternoonTo,
      data.sundayAfternoonTo,
    ];

    const morningFrom = morningFromData.reduce((acc: any, curr: any) => {
      if (curr === '-1') {
        acc += '0000';
      } else {
        const foundData = RCA_HOURS_DROPDOWN.find(
          (data: any) => data.value === curr,
        );
        acc += foundData ? foundData.label.replace(':', '') : '';
      }

      return acc;
    }, '');

    const morningTo = morningToData.reduce((acc: any, curr: any) => {
      if (curr === '-1') {
        acc += '0000';
      } else {
        const foundData = RCA_HOURS_DROPDOWN.find(
          (data: any) => data.value === curr,
        );
        acc += foundData ? foundData.label.replace(':', '') : '';
      }

      return acc;
    }, '');

    const afternoonFrom = afternoonFromData.reduce((acc: any, curr: any) => {
      if (curr === '-1') {
        acc += '0000';
      } else {
        const foundData = RCA_HOURS_DROPDOWN.find(
          (data: any) => data.value === curr,
        );
        acc += foundData ? foundData.label.replace(':', '') : '';
      }

      return acc;
    }, '');

    const afternoonTo = afternoonToData.reduce((acc: any, curr: any) => {
      if (curr === '-1') {
        acc += '0000';
      } else {
        const foundData = RCA_HOURS_DROPDOWN.find(
          (data: any) => data.value === curr,
        );
        acc += foundData ? foundData.label.replace(':', '') : '';
      }

      return acc;
    }, '');

    return {morningFrom, morningTo, afternoonFrom, afternoonTo};
  }

  // Return call day string
  private getCallDaysString(data: any, weekDropdownData: any) {
    let callDayString = '';
    let deliveryDayString = '';

    if (data.mondayCall) {
      const mondayCallDay = ((Number(data.callWeek) - 1) * 7 + 1).toString();
      callDayString += mondayCallDay.padStart(3, '0');

      if (data.mondayDropdown !== '') {
        const mondayDeliveryDay = (
          (Number(data.deliveryWeek) - 1) * 7 +
          (data.mondayDropdown + 1)
        ).toString();

        deliveryDayString += mondayDeliveryDay.padStart(3, '0');
      } else {
        deliveryDayString += '000';
      }
    } else {
      callDayString += '000';
      deliveryDayString += '000';
    }

    if (data.tuesdayCall) {
      const tuesdayCallDay = ((Number(data.callWeek) - 1) * 7 + 2).toString();
      callDayString += tuesdayCallDay.padStart(3, '0');
      if (data.tuesdayDropdown !== '') {
        const tuesdayDeliveryDay = (
          (Number(data.deliveryWeek) - 1) * 7 +
          (data.tuesdayDropdown + 1)
        ).toString();

        deliveryDayString += tuesdayDeliveryDay.padStart(3, '0');
      } else {
        deliveryDayString += '000';
      }
    } else {
      callDayString += '000';
      deliveryDayString += '000';
    }

    if (data.wednesdayCall) {
      const wednesdayCallDay = ((Number(data.callWeek) - 1) * 7 + 3).toString();
      callDayString += wednesdayCallDay.padStart(3, '0');
      if (data.wednesdayDropdown !== '') {
        const wednesdayDeliveryDay = (
          (Number(data.deliveryWeek) - 1) * 7 +
          (data.wednesdayDropdown + 1)
        ).toString();

        deliveryDayString += wednesdayDeliveryDay.padStart(3, '0');
      } else {
        deliveryDayString += '000';
      }
    } else {
      callDayString += '000';
      deliveryDayString += '000';
    }

    if (data.thursdayCall) {
      const thursdayCallDay = ((Number(data.callWeek) - 1) * 7 + 4).toString();
      callDayString += thursdayCallDay.padStart(3, '0');
      if (data.thursdayDropdown !== '') {
        const thursdayDeliveryDay = (
          (Number(data.deliveryWeek) - 1) * 7 +
          (data.thursdayDropdown + 1)
        ).toString();

        deliveryDayString += thursdayDeliveryDay.padStart(3, '0');
      } else {
        deliveryDayString += '000';
      }
    } else {
      callDayString += '000';
      deliveryDayString += '000';
    }

    if (data.fridayCall) {
      const fridayCallDay = ((Number(data.callWeek) - 1) * 7 + 5).toString();
      callDayString += fridayCallDay.padStart(3, '0');
      if (data.fridayDropdown !== '') {
        const fridayDeliveryDay = (
          (Number(data.deliveryWeek) - 1) * 7 +
          (data.fridayDropdown + 1)
        ).toString();

        deliveryDayString += fridayDeliveryDay.padStart(3, '0');
      } else {
        deliveryDayString += '000';
      }
    } else {
      callDayString += '000';
      deliveryDayString += '000';
    }

    if (data.saturdayCall) {
      const saturdayCallDay = ((Number(data.callWeek) - 1) * 7 + 6).toString();
      callDayString += saturdayCallDay.padStart(3, '0');
      if (data.saturdayDropdown !== '') {
        const saturdayDeliveryDay = (
          (Number(data.deliveryWeek) - 1) * 7 +
          (data.saturdayDropdown + 1)
        ).toString();

        deliveryDayString += saturdayDeliveryDay.padStart(3, '0');
      } else {
        deliveryDayString += '000';
      }
    } else {
      callDayString += '000';
      deliveryDayString += '000';
    }

    if (data.sundayCall) {
      const sundayCallDay = ((Number(data.callWeek) - 1) * 7 + 7).toString();
      callDayString += sundayCallDay.padStart(3, '0');
      if (data.sundayDropdown !== '') {
        const sundayDeliveryDay = (
          (Number(data.deliveryWeek) - 1) * 7 +
          (data.sundayDropdown + 1)
        ).toString();

        deliveryDayString += sundayDeliveryDay.padStart(3, '0');
      } else {
        deliveryDayString += '000';
      }
    } else {
      callDayString += '000';
      deliveryDayString += '000';
    }

    return {callDayString, deliveryDayString};
  }

  // Return true/false based on data update
  async insertOrUpdateProspectRCAData(
    data: any,
    openingHours: any,
    visitingHours: any,
    weekDropdownData: any,
  ) {
    const {
      morningFrom: deliveryMorningFrom,
      morningTo: deliveryMorningTo,
      afternoonFrom: deliveryAfternoonFrom,
      afternoonTo: deliveryAfternoonTo,
    } = this.arrangeOpeningAndVisitingHoursData(openingHours);

    const {
      morningFrom: visitMorningFrom,
      morningTo: visitMorningTo,
      afternoonFrom: visitAfternoonFrom,
      afternoonTo: visitAfternoonTo,
    } = this.arrangeOpeningAndVisitingHoursData(visitingHours);

    const {callDayString, deliveryDayString} = this.getCallDaysString(
      data,
      weekDropdownData,
    );

    const prepareData = {
      deliveryMorningFrom,
      deliveryMorningTo,
      deliveryAfternoonFrom,
      deliveryAfternoonTo,
      visitMorningFrom,
      visitMorningTo,
      visitAfternoonFrom,
      visitAfternoonTo,
      callCalendarId: data?.callFrequency ? data?.callFrequency.trim() : '',
      callPlaceNumber: data?.transitCallPlace
        ? data?.transitCallPlace.trim()
        : '',
      deliveryComments: data?.notes ? data?.notes.trim() : '',
      callDaysValues: callDayString,
      deliveryDaysValues: deliveryDayString,
      distributionCenter: data?.distributionCenter
        ? data?.distributionCenter.trim()
        : '',
    };

    const isProspectUpdated =
      await this.discoveryRcaService.insertOrUpdateProspectRCAData(prepareData);

    if (isProspectUpdated) {
      return true;
    }

    return false;
  }

  // Return mandatory fields of RCA
  async getRCAMandatoryFieldsConfig() {
    const openingMondayMorningFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_MON_MORNING_FROM,
      );

    const openingMondayMorningTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_MON_MORNING_TO,
      );
    const openingMondayAfternoonFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_MON_AFTERNOON_FROM,
      );
    const openingMondayAfternoonTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_MON_AFTERNOON_TO,
      );

    const openingTuesdayMorningFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_TUE_MORNING_FROM,
      );
    const openingTuesdayMorningTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_TUE_MORNING_TO,
      );
    const openingTuesdayAfternoonFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_TUE_AFTERNOON_FROM,
      );
    const openingTuesdayAfternoonTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_TUE_AFTERNOON_TO,
      );

    const openingWednesdayMorningFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_WED_MORNING_FROM,
      );
    const openingWednesdayMorningTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_WED_MORNING_TO,
      );
    const openingWednesdayAfternoonFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_WED_AFTERNOON_FROM,
      );
    const openingWednesdayAfternoonTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_WED_AFTERNOON_TO,
      );

    const openingThursdayMorningFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_THU_MORNING_FROM,
      );
    const openingThursdayMorningTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_THU_MORNING_TO,
      );
    const openingThursdayAfternoonFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_THU_AFTERNOON_FROM,
      );
    const openingThursdayAfternoonTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_THU_AFTERNOON_TO,
      );

    const openingFridayMorningFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_FRI_MORNING_FROM,
      );
    const openingFridayMorningTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_FRI_MORNING_TO,
      );
    const openingFridayAfternoonFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_FRI_AFTERNOON_FROM,
      );
    const openingFridayAfternoonTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_FRI_AFTERNOON_TO,
      );

    const openingSaturdayMorningFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_SAT_MORNING_FROM,
      );
    const openingSaturdayMorningTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_SAT_MORNING_TO,
      );
    const openingSaturdayAfternoonFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_SAT_AFTERNOON_FROM,
      );
    const openingSaturdayAfternoonTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_SAT_AFTERNOON_TO,
      );

    const openingSundayMorningFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_SUN_MORNING_FROM,
      );
    const openingSundayMorningTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_SUN_MORNING_TO,
      );
    const openingSundayAfternoonFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_SUN_AFTERNOON_FROM,
      );
    const openingSundayAfternoonTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_OPENING_SUN_AFTERNOON_TO,
      );

    const visitingMondayMorningFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_MON_MORNING_FROM,
      );
    const visitingMondayMorningTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_MON_MORNING_TO,
      );
    const visitingMondayAfternoonFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_MON_AFTERNOON_FROM,
      );
    const visitingMondayAfternoonTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_MON_AFTERNOON_TO,
      );

    const visitingTuesdayMorningFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_TUE_MORNING_FROM,
      );
    const visitingTuesdayMorningTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_TUE_MORNING_TO,
      );
    const visitingTuesdayAfternoonFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_TUE_AFTERNOON_FROM,
      );
    const visitingTuesdayAfternoonTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_TUE_AFTERNOON_TO,
      );

    const visitingWednesdayMorningFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_WED_MORNING_FROM,
      );
    const visitingWednesdayMorningTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_WED_MORNING_TO,
      );
    const visitingWednesdayAfternoonFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_WED_AFTERNOON_FROM,
      );
    const visitingWednesdayAfternoonTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_WED_AFTERNOON_TO,
      );

    const visitingThursdayMorningFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_THU_MORNING_FROM,
      );
    const visitingThursdayMorningTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_THU_MORNING_TO,
      );
    const visitingThursdayAfternoonFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_THU_AFTERNOON_FROM,
      );
    const visitingThursdayAfternoonTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_THU_AFTERNOON_TO,
      );

    const visitingFridayMorningFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_FRI_MORNING_FROM,
      );
    const visitingFridayMorningTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_FRI_MORNING_TO,
      );
    const visitingFridayAfternoonFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_FRI_AFTERNOON_FROM,
      );
    const visitingFridayAfternoonTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_FRI_AFTERNOON_TO,
      );

    const visitingSaturdayMorningFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_SAT_MORNING_FROM,
      );
    const visitingSaturdayMorningTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_SAT_MORNING_TO,
      );
    const visitingSaturdayAfternoonFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_SAT_AFTERNOON_FROM,
      );
    const visitingSaturdayAfternoonTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_SAT_AFTERNOON_TO,
      );

    const visitingSundayMorningFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_SUN_MORNING_FROM,
      );
    const visitingSundayMorningTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_SUN_MORNING_TO,
      );
    const visitingSundayAfternoonFrom =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_SUN_AFTERNOON_FROM,
      );
    const visitingSundayAfternoonTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DDL_VISITING_SUN_AFTERNOON_TO,
      );

    const season = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_RCA_CONTROL_NAME.SEASON,
    );
    const callFrequency =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.CALL_FREQUENCY,
      );
    const callWeek =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.CALL_WEEK,
      );
    const deliveryWeek =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DELIVERY_WEEK,
      );
    const distributionCenter =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DISTRIBUTION_CENTER,
      );
    const transitCallPlace =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.TRANSIT_CALL_PLACE,
      );

    const callDayMonday =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.CALL_DAY_MONDAY,
      );
    const callDayTuesday =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.CALL_DAY_TUESDAY,
      );
    const callDayWednesday =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.CALL_DAY_WEDNESDAY,
      );
    const callDayThursday =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.CALL_DAY_THURSDAY,
      );
    const callDayFriday =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.CALL_DAY_FRIDAY,
      );
    const callDaySaturday =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.CALL_DAY_SATURDAY,
      );
    const callDaySunday =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.CALL_DAY_SUNDAY,
      );

    const deliveryDayMonday =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DELIVERY_DAY_MONDAY,
      );
    const deliveryDayTuesday =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DELIVERY_DAY_TUESDAY,
      );
    const deliveryDayWednesday =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DELIVERY_DAY_WEDNESDAY,
      );
    const deliveryDayThursday =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DELIVERY_DAY_THURSDAY,
      );
    const deliveryDayFriday =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DELIVERY_DAY_FRIDAY,
      );
    const deliveryDaySaturday =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DELIVERY_DAY_SATURDAY,
      );
    const deliveryDaySunday =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_RCA_CONTROL_NAME.DELIVERY_DAY_SUNDAY,
      );

    const notes = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_RCA_CONTROL_NAME.NOTES,
    );

    return {
      openingMondayMorningFrom,
      openingMondayMorningTo,
      openingMondayAfternoonFrom,
      openingMondayAfternoonTo,

      openingTuesdayMorningFrom,
      openingTuesdayMorningTo,
      openingTuesdayAfternoonFrom,
      openingTuesdayAfternoonTo,

      openingWednesdayMorningFrom,
      openingWednesdayMorningTo,
      openingWednesdayAfternoonFrom,
      openingWednesdayAfternoonTo,

      openingThursdayMorningFrom,
      openingThursdayMorningTo,
      openingThursdayAfternoonFrom,
      openingThursdayAfternoonTo,

      openingFridayMorningFrom,
      openingFridayMorningTo,
      openingFridayAfternoonFrom,
      openingFridayAfternoonTo,

      openingSaturdayMorningFrom,
      openingSaturdayMorningTo,
      openingSaturdayAfternoonFrom,
      openingSaturdayAfternoonTo,

      openingSundayMorningFrom,
      openingSundayMorningTo,
      openingSundayAfternoonFrom,
      openingSundayAfternoonTo,

      visitingMondayMorningFrom,
      visitingMondayMorningTo,
      visitingMondayAfternoonFrom,
      visitingMondayAfternoonTo,

      visitingTuesdayMorningFrom,
      visitingTuesdayMorningTo,
      visitingTuesdayAfternoonFrom,
      visitingTuesdayAfternoonTo,

      visitingWednesdayMorningFrom,
      visitingWednesdayMorningTo,
      visitingWednesdayAfternoonFrom,
      visitingWednesdayAfternoonTo,

      visitingThursdayMorningFrom,
      visitingThursdayMorningTo,
      visitingThursdayAfternoonFrom,
      visitingThursdayAfternoonTo,

      visitingFridayMorningFrom,
      visitingFridayMorningTo,
      visitingFridayAfternoonFrom,
      visitingFridayAfternoonTo,

      visitingSaturdayMorningFrom,
      visitingSaturdayMorningTo,
      visitingSaturdayAfternoonFrom,
      visitingSaturdayAfternoonTo,

      visitingSundayMorningFrom,
      visitingSundayMorningTo,
      visitingSundayAfternoonFrom,
      visitingSundayAfternoonTo,

      season,
      callFrequency,
      callWeek,
      deliveryWeek,
      distributionCenter,
      transitCallPlace,

      callDayMonday,
      callDayTuesday,
      callDayWednesday,
      callDayThursday,
      callDayFriday,
      callDaySaturday,
      callDaySunday,

      deliveryDayMonday,
      deliveryDayTuesday,
      deliveryDayWednesday,
      deliveryDayThursday,
      deliveryDayFriday,
      deliveryDaySaturday,
      deliveryDaySunday,

      notes,
    };
  }
}
export default new PLBasicInfoController();
