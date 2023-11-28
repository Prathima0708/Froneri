import {CustomerHierarchiesShipToService} from 'src/services/CustomerHierarchiesShipToService';
import {CustomersAbcClassificationsService} from 'src/services/CustomersAbcClassificationsService';
import {CustomersIndustryCodesService} from 'src/services/CustomersIndustryCodesService';
import {CustomersService} from 'src/services/CustomersService';
import {DistributorsService} from 'src/services/DistributorsService';
import {ParametersValuesService} from 'src/services/ParametersValuesService';
import {TurnoverGroupsService} from 'src/services/TurnoverGroupsService';
import {getOnlyDate} from 'src/utils/CommonUtil';

class CustomersSearchController {
  private customersService: CustomersService;
  private customerHierarchiesShipTOService: CustomerHierarchiesShipToService;
  private customersAbcClassificationsService: CustomersAbcClassificationsService;
  private turnoverGroupsService: TurnoverGroupsService;
  private distributorsService: DistributorsService;
  private customersIndustryCodesService: CustomersIndustryCodesService;
  private parametersValuesService: ParametersValuesService;

  constructor() {
    this.customersService = new CustomersService();
    this.customerHierarchiesShipTOService =
      new CustomerHierarchiesShipToService();
    this.customersAbcClassificationsService =
      new CustomersAbcClassificationsService();
    this.turnoverGroupsService = new TurnoverGroupsService();
    this.distributorsService = new DistributorsService();
    this.customersIndustryCodesService = new CustomersIndustryCodesService();
    this.parametersValuesService = new ParametersValuesService();
  }

  async searchCustomers(
    isAllRegion: boolean,
    start: number,
    limit: number,
    customerType: string,
    filterObj: any,
  ) {
    let customers = await this.customersService.searchCustomers(
      isAllRegion,
      start,
      limit,
      customerType,
      filterObj,
    );

    let results: any = {results: [], totalCount: customers.totalCount};
    const parametersValuesService = new ParametersValuesService();
    const isShowTurnOver = Number(
      await parametersValuesService.getParameterValue(
        'Turnover_Information_In_Customer_Export_From_Tess_Mobile',
      ),
    );

    for (const customer of customers.results) {
      let obj: any = {};
      if (filterObj.inActiveCustomerOnly) {
        // check whether customers is active or inactive ...
        const endCustomerBusinessDatetime = customer.endCustomerBusinessDatetime
          ? new Date(customer.endCustomerBusinessDatetime) >= new Date()
          : true;

        obj = {
          ...customer,
          isShowTurnOver: isShowTurnOver ? isShowTurnOver : 1,
          isActiveCustomer: endCustomerBusinessDatetime,
          lastVisitDatetime: customer.lastVisitDatetime
            ? getOnlyDate(customer.lastVisitDatetime)
            : '',
        };
      } else {
        obj = {
          ...customer,
          isShowTurnOver: isShowTurnOver ? isShowTurnOver : 1,
          isActiveCustomer: true,
          lastVisitDatetime: customer.lastVisitDatetime
            ? getOnlyDate(customer.lastVisitDatetime)
            : '',
        };
      }
      results.results.push(obj);
    }

    return results;
  }

  async getCustomerHierarchiesShipTo(value: string) {
    return await this.customerHierarchiesShipTOService.getCustomerHierarchiesShipTo(
      value,
    );
  }

  async getCustomersAbcClassification() {
    return await this.customersAbcClassificationsService.getCustomersAbcClassification();
  }

  async getProductGroup() {
    return await this.turnoverGroupsService.getProductGroup();
  }

  async getDistributors() {
    return await this.distributorsService.getDistributors();
  }

  async getCustomerAttributeDistributors() {
    return await this.distributorsService.getCustomerAttributeDistributors();
  }

  async getOutletClassification(value: string) {
    return await this.customersIndustryCodesService.getOutletClassification(
      value,
    );
  }

  async getCreatePastVisitInDays() {
    return await this.parametersValuesService.getParameterValue(
      'Create_Past_Visit_In_Days',
    );
  }
}
export default new CustomersSearchController();
