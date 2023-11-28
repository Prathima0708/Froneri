import {generateTimeRanges} from 'src/utils/Util';
import {CallsService} from 'src/services/CallsService';
import {CustomersService} from 'src/services/CustomersService';
import {EmployeesObjectivesService} from 'src/services/EmployeesObjectivesService';
import {END_POINTS} from 'src/utils/ApiEndpoints';
import ApiUtil from 'src/services/ApiUtil';
import {VISIT_HOURS_DROPDOWN} from 'src/utils/DropdownConst';

class VisitsContoller {
  private customersService: CustomersService;
  private callsService: CallsService;
  private employeesObjectiveService: EmployeesObjectivesService;

  constructor() {
    this.customersService = new CustomersService();
    this.callsService = new CallsService();
    this.employeesObjectiveService = new EmployeesObjectivesService();
  }

  async createVisits(allSelectedCustomersList: any) {
    const allVisits: any = [];
    for (const selectedCustomers of allSelectedCustomersList) {
      try {
        let hour = 8;
        let mins = 0;
        let durations = [];

        if (selectedCustomers.time) {
          const selectedTime = VISIT_HOURS_DROPDOWN.find(
            (item: any) => item.value === selectedCustomers.time,
          );
          if (selectedTime) {
            const splittedTime = selectedTime.label.split(':');

            hour = parseInt(splittedTime[0]);
            mins = parseInt(splittedTime[1]);
          }
        }

        for (const selectedCustomer of selectedCustomers.data) {
          const standardDurationData =
            await this.employeesObjectiveService.getStandardDuration(
              selectedCustomer.statusType,
            );
          console.log('standardDurationData :>> ', standardDurationData);

          if (standardDurationData.length > 0) {
            durations.push(standardDurationData[0].standardDuration);
            selectedCustomer.idEmployeeObjective =
              standardDurationData[0].idEmployeeObjective;
          } else {
            durations.push(30);
            selectedCustomer.idEmployeeObjective = 0;
          }
        }

        console.log('durations :>> ', durations.length, durations);
        console.log(
          'selectedCustomers data length :>> ',
          selectedCustomers.data.length,
        );

        const dateTimeDurations = generateTimeRanges(
          selectedCustomers.date,
          selectedCustomers.data.length,
          hour,
          mins,
          durations,
        );

        console.log('dateTimeDurations :>> ', dateTimeDurations);
        const unformattedDate = new Date(selectedCustomers.date);
        const formattedDate = `${unformattedDate.getFullYear()}-${
          unformattedDate.getMonth() + 1
        }-${unformattedDate.getDate()}`;

        const selectedCustomerDate = new Date(formattedDate);

        selectedCustomers.data.forEach(
          (selectedCustomer: any, index: number) => {
            let callFromDateTime = dateTimeDurations[index].start;
            let callToDateTime = dateTimeDurations[index].end;

            if (
              new Date(callFromDateTime).getDay() >
                selectedCustomerDate.getDay() ||
              new Date(callToDateTime).getDay() > selectedCustomerDate.getDay()
            ) {
              const newStartTime = new Date(formattedDate);

              newStartTime.setUTCHours(23, 30, 0);
              callFromDateTime = newStartTime
                .toISOString()
                .replace('T', ' ')
                .slice(0, -1);

              newStartTime.setUTCMinutes(newStartTime.getUTCMinutes() + 30);
              callToDateTime = newStartTime
                .toISOString()
                .replace('T', ' ')
                .slice(0, -1);
            }

            const hoursMins = callFromDateTime.split(' ')[1].split(':');
            hoursMins.pop();
            const preferedCallTime = hoursMins.join('');

            const visitObj = {
              customerInfo: selectedCustomer,
              callFromDateTime,
              callToDateTime,
              preferedCallTime,
            };

            allVisits.push(visitObj);
          },
        );
      } catch (error) {
        console.log('Error => ', error);
      }
    }

    await this.callsService.createNewVisit(allVisits);
    return 'Visit created';
  }

  async getVisits(startDate: string, endDate: string) {
    const data = await this.callsService.getVisitAgenda(startDate, endDate);
    return data;
  }

  async updateStartVisit(idCall: string) {
    return await this.callsService.updateStartVisit(idCall);
  }

  async getOpenVisits() {
    return await this.callsService.getOpenVisits();
  }

  async updateDeleteVisit(idCall: string) {
    return await this.callsService.updateDeleteVisit(idCall);
  }

  async updateEditVisit(obj: any) {
    return await this.callsService.updateEditVisit(obj);
  }

  async getEmployeesObjectives() {
    return await this.employeesObjectiveService.getEmployeesObjectives();
  }

  async exportVisits(visitedFrom: string, visitedTo: string) {
    const employeeInfo = await this.callsService.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const callPlaceNumber =
      employeeInfo.length > 0 ? employeeInfo[0].callPlaceNumber : '';

    const BASE_API_URL = await this.callsService.getDefaultApiUrl();
    const URL = BASE_API_URL + END_POINTS.REPORT_REQUEST;

    const data = {
      reportType: 19,
      requestedEmployee: employeeNo,
      reportParameters: `${callPlaceNumber}|${visitedFrom}|${visitedTo}`,
    };

    const response = await ApiUtil.callPostApi(URL, data);
    const res = {
      statusText: '',
      success: false,
    };

    // For internal server error
    if (response?.response && response?.response?.status === 500) {
      res.statusText = response?.response?.data;
      res.success = false;
    }
    // For network error or any other error
    else if (response?.response) {
      res.statusText = 'Something went wrong!';
      res.success = false;
    }
    // For success
    else {
      res.statusText = response;
      res.success = true;
    }

    return res;
  }
}
export default new VisitsContoller();
