import {CustomerVacationsService} from 'src/services/CustomerVacationsService';
import {getOnlyDate, getServerDate} from 'src/utils/CommonUtil';
import {VACATIONS_TYPES} from 'src/utils/Constant';

class CLVacationController {
  private customerVacationsService: CustomerVacationsService;

  constructor() {
    this.customerVacationsService = new CustomerVacationsService();
  }

  async getCustomersAllVacations(value: string) {
    let results: any = [];
    if (value === VACATIONS_TYPES.ALL_VACATIONS) {
      results = await this.customerVacationsService.getCustomersAllVacations();
    } else {
      results = await this.customerVacationsService.getCustomersPastVacations();
    }

    let finalResults = [];
    for (let i = 0; i < results.length; i++) {
      // find the active vacation ...
      let isActiveVacation = false;
      let currentDate = new Date();
      let vacationFrom: any = results[i].from ? new Date(results[i].from) : '';
      let vacationTo: any = results[i].to ? new Date(results[i].to) : '';
      currentDate = new Date(currentDate.toISOString().split('T')[0]);
      if (vacationFrom != '') {
        vacationFrom = new Date(vacationFrom.toISOString().split('T')[0]);
      }
      if (vacationTo != '') {
        vacationTo = new Date(vacationTo.toISOString().split('T')[0]);
      }

      if (currentDate >= vacationFrom && currentDate <= vacationTo) {
        isActiveVacation = true;
      } else {
        isActiveVacation = false;
      }
      let obj = {
        ...results[i],
        isActiveVacation: isActiveVacation,
        fromDate: results[i].from ? getOnlyDate(results[i].from) : '-',
        toDate: results[i].to ? getOnlyDate(results[i].to) : '-',
      };
      finalResults.push(obj);
    }
    return finalResults;
  }

  async createOrUpdateCustomerVacation(obj: any) {
    const formattedFromDate = getServerDate(obj.fromDate);
    const formattedToDate = getServerDate(obj.toDate);
    let vacationObj = {
      ...obj,
      fromDate: formattedFromDate,
      toDate: formattedToDate,
    };

    return await this.customerVacationsService.createOrUpdateCustomerVacation(
      vacationObj,
    );
  }
  async deleteCustomerVacation(idCustomerVacations: string) {
    return await this.customerVacationsService.deleteCustomerVacation(
      idCustomerVacations,
    );
  }
}
export default new CLVacationController();
