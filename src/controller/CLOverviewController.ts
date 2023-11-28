import {CallsService} from 'src/services/CallsService';
import {CustomerContactsService} from 'src/services/CustomerContactsService';
import {CustomerVacationsService} from 'src/services/CustomerVacationsService';
import {CustomersService} from 'src/services/CustomersService';
import {EmployeesObjectivesService} from 'src/services/EmployeesObjectivesService';
import {OrdersService} from 'src/services/OrdersService';
import {QuestionAnswersService} from 'src/services/QuestionAnswersService';
import {ServiceRequestsCustomersService} from 'src/services/ServiceRequestsCustomersService';
import {TasksService} from 'src/services/TasksService';
import {TurnoverGroupsService} from 'src/services/TurnoverGroupsService';
import {store} from 'src/store';
import {
  formatDateReverse,
  getDateWithMonthName,
  getDuration,
  getISOCurrentDate,
  getLocaleNumberFormatter,
  getOnlyDate,
  getOnlyTime,
} from 'src/utils/CommonUtil';
import {VISITS_CALL_STATUS} from 'src/utils/DbConst';

class CLOverviewController {
  private customersService: CustomersService;
  private customerContactsService: CustomerContactsService;
  private questionAnswersService: QuestionAnswersService;
  private serviceRequestsCustomersService: ServiceRequestsCustomersService;
  private tasksService: TasksService;
  private turnoverGroupService: TurnoverGroupsService;
  private ordersService: OrdersService;
  private employeesObjectivesService: EmployeesObjectivesService;
  private callsService: CallsService;
  private customerVacationsService: CustomerVacationsService;

  constructor() {
    this.customersService = new CustomersService();
    this.customerContactsService = new CustomerContactsService();
    this.questionAnswersService = new QuestionAnswersService();
    this.serviceRequestsCustomersService =
      new ServiceRequestsCustomersService();
    this.tasksService = new TasksService();
    this.turnoverGroupService = new TurnoverGroupsService();
    this.ordersService = new OrdersService();
    this.employeesObjectivesService = new EmployeesObjectivesService();
    this.callsService = new CallsService();
    this.customerVacationsService = new CustomerVacationsService();
  }

  async getCustomerInfo(customerInfo: any) {
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : customerInfo.customer_ship_to;

    const salesOrganization = customerInfo.salesOrganization
      ? customerInfo.salesOrganization
      : customerInfo.sales_organization;

    const distributionChannel = customerInfo.distributionChannel
      ? customerInfo.distributionChannel
      : customerInfo.distribution_channel;

    const customers = await this.customersService.getCustomerInfo(
      customerShipTo,
      salesOrganization,
      distributionChannel,
    );

    return customers;
  }

  async getContacts(customerInfo: any) {
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : customerInfo.customer_ship_to;

    const salesOrganization = customerInfo.salesOrganization
      ? customerInfo.salesOrganization
      : customerInfo.sales_organization;

    const distributionChannel = customerInfo.distributionChannel
      ? customerInfo.distributionChannel
      : customerInfo.distribution_channel;

    const contacts = await this.customerContactsService.getContactDetails(
      customerShipTo,
      salesOrganization,
      distributionChannel,
    );

    return contacts;
  }

  // ! Note: Doesn't have task execution table data in watermelon db
  async getSalesMaterialBrochureCount(customerInfo: any) {
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : customerInfo.customer_ship_to;

    const salesOrganization = customerInfo.salesOrganization
      ? customerInfo.salesOrganization
      : customerInfo.sales_organization;

    const distributionChannel = customerInfo.distributionChannel
      ? customerInfo.distributionChannel
      : customerInfo.distribution_channel;

    const brochureCount =
      await this.questionAnswersService.getSalesMaterialFileCount(
        customerShipTo,
        salesOrganization,
        distributionChannel,
      );

    return brochureCount;
  }

  async getTasksListing(customerInfo: any) {
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : customerInfo.customer_ship_to;

    const salesOrganization = customerInfo.salesOrganization
      ? customerInfo.salesOrganization
      : customerInfo.sales_organization;

    const distributionChannel = customerInfo.distributionChannel
      ? customerInfo.distributionChannel
      : customerInfo.distribution_channel;

    const customerInfoData: any = await this.callsService.getCLCustomerInfo();

    const isRemoteCustomer = customerInfoData?.isCallApi;

    let tasksCount = 0;

    if (isRemoteCustomer) {
      tasksCount = await this.tasksService.getTasksListingOnline(
        customerShipTo,
        salesOrganization,
        distributionChannel,
      );
    } else {
      tasksCount = await this.tasksService.getTasksListing(
        customerShipTo,
        salesOrganization,
        distributionChannel,
      );
    }

    return tasksCount;
  }

  async getServiceWorkflow(customerInfo: any) {
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : customerInfo.customer_ship_to;

    const customerInfoData: any = await this.callsService.getCLCustomerInfo();

    const isRemoteCustomer = customerInfoData?.isCallApi;

    let serviceWorkflow = 0;

    if (isRemoteCustomer) {
      serviceWorkflow =
        await this.serviceRequestsCustomersService.getOpenWorkflowOfCustomerFromOnline(
          customerShipTo,
        );
    } else {
      serviceWorkflow =
        await this.serviceRequestsCustomersService.getOpenServiceWorkflowCount(
          customerShipTo,
        );
    }

    return serviceWorkflow;
  }

  async getTurnover(customerInfo: any) {
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : customerInfo.customer_ship_to;

    const customerInfoData: any = await this.callsService.getCLCustomerInfo();

    const isRemoteCustomer = customerInfoData?.isCallApi;

    let turnover = [];

    if (isRemoteCustomer) {
      turnover = await this.turnoverGroupService.getTurnoverDetailsOnline(
        customerShipTo,
      );
    } else {
      turnover = await this.turnoverGroupService.getTurnoverDetails(
        customerShipTo,
      );
    }

    if (turnover.length > 0) {
      const turnoverObj = turnover[0];

      const turnoverInString = Object.keys(turnoverObj).reduce(
        (acc: any, key: string) => {
          acc[key] = String(turnoverObj[key]);
          return acc;
        },
        {},
      );

      return turnoverInString;
    }

    return {};
  }

  async getLastOrder(customerInfo: any) {
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : customerInfo.customer_ship_to;

    const salesOrganization = customerInfo.salesOrganization
      ? customerInfo.salesOrganization
      : customerInfo.sales_organization;

    const distributionChannel = customerInfo.distributionChannel
      ? customerInfo.distributionChannel
      : customerInfo.distribution_channel;

    const customerInfoData: any = await this.callsService.getCLCustomerInfo();

    const isRemoteCustomer = customerInfoData?.isCallApi;

    let orderDetails: any = [];

    if (isRemoteCustomer) {
      orderDetails = await this.ordersService.getLastOrderOnline(
        customerShipTo,
        salesOrganization,
        distributionChannel,
      );
    } else {
      orderDetails = await this.ordersService.getLastOrder(
        customerShipTo,
        salesOrganization,
        distributionChannel,
      );
    }

    if (orderDetails.length > 0) {
      const orderDetailsObj = orderDetails[0];
      orderDetailsObj.creationDatetime = getOnlyDate(
        orderDetailsObj.creationDatetime,
      );
      orderDetailsObj.deliveryDatetime = getOnlyDate(
        orderDetailsObj.deliveryDatetime,
      );
      orderDetailsObj.netAmount = orderDetailsObj?.netAmount
        ? getLocaleNumberFormatter(orderDetailsObj?.netAmount, 2)
        : 0;
      return orderDetailsObj;
    }

    return {};
  }

  async getVisitFromIdCall(customerInfo: any, isProspect: boolean = false) {
    const idCall = customerInfo?.id_call
      ? customerInfo?.id_call
      : customerInfo?.idCall;

    const currentVisitObjective = await this.callsService.getVisitFromIdCall(
      idCall,
      isProspect,
    );

    return currentVisitObjective;
  }

  async getUpcomingVisitInformation(customerInfo: any) {
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : customerInfo.customer_ship_to;

    const salesOrganization = customerInfo.salesOrganization
      ? customerInfo.salesOrganization
      : customerInfo.sales_organization;

    const distributionChannel = customerInfo.distributionChannel
      ? customerInfo.distributionChannel
      : customerInfo.distribution_channel;

    const customerInfoData: any = await this.callsService.getCLCustomerInfo();
    const state = store.getState();
    const upcomingVisitIdCall = state.customerLanding.upcomingVisitIdCall;
    console.log('upcomingVisitIdCall :>> ', upcomingVisitIdCall);

    const isRemoteCustomer = customerInfoData?.isCallApi;

    let upcomingVisit;

    if (isRemoteCustomer) {
      upcomingVisit = await this.callsService.getUpcomingVisitOnline(
        customerShipTo,
      );
      upcomingVisit = [upcomingVisit];
    } else {
      upcomingVisit = await this.callsService.getUpcomingVisits(
        customerShipTo,
        salesOrganization,
        distributionChannel,
        upcomingVisitIdCall,
      );
    }

    if (upcomingVisit.length > 0) {
      return upcomingVisit;
    } else {
      return [];
    }
  }

  async getVisit(customerInfo: any, isUpcomingVisit: boolean = false) {
    console.log('customerInfo controller :>> ', customerInfo);
    const employeeInfo = await this.callsService.getLoggedInEmployeeInfo();
    const delegatedEmployeeInfo =
      await this.callsService.getDelegatedEmployeeObj();
    const customerInfoData: any = await this.callsService.getCLCustomerInfo();

    const isRemoteCustomer = customerInfoData?.isCallApi;

    let visitInformation: any = [];
    let showButtons;

    if (isUpcomingVisit) {
      // Fetch upcoming visit information
      visitInformation = await this.getUpcomingVisitInformation(customerInfo);
      console.log(
        'upcoming visit Information controller :>> ',
        visitInformation,
      );
    } else {
      // Fetch current visit information
      visitInformation = await this.getVisitFromIdCall(customerInfo);
      console.log(
        'current visit Information controller :>> ',
        visitInformation,
      );
    }

    if (visitInformation.length > 0) {
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
      const delegatedEmployeeNo =
        delegatedEmployeeInfo.length > 0
          ? delegatedEmployeeInfo[0].employeeNumber
          : '';
      const employeeNoToMatch = [employeeNo, delegatedEmployeeNo];

      const visitInfoObj = visitInformation[0];

      const visitDate =
        (visitInfoObj?.callFromDatetime &&
          getDateWithMonthName(visitInfoObj?.callFromDatetime)) ||
        '';
      const visitDateFull =
        (visitInfoObj?.callFromDatetime &&
          formatDateReverse(new Date(visitInfoObj?.callFromDatetime))) ||
        '';
      const visitStartTime =
        (visitInfoObj?.callFromDatetime &&
          getOnlyTime(visitInfoObj?.callFromDatetime)) ||
        '';
      const visitEndTime =
        (visitInfoObj?.callToDatetime &&
          getOnlyTime(visitInfoObj?.callToDatetime)) ||
        '';
      const visitDuration =
        (visitInfoObj?.callFromDatetime &&
          visitInfoObj?.callToDatetime &&
          getDuration(
            visitInfoObj?.callFromDatetime,
            visitInfoObj?.callToDatetime,
          )) ||
        '';

      if (
        isRemoteCustomer ||
        visitInfoObj.callStatus === VISITS_CALL_STATUS.FINISHED
      ) {
        showButtons = false;
      } else if (isUpcomingVisit) {
        const date1 = visitInfoObj?.callFromDatetime;
        const date2 = getISOCurrentDate();

        const extractedDate1 = date1.split(' ')[0];
        const extractedDate2 = date2.split(' ')[0];

        showButtons = extractedDate1 === extractedDate2;

        // TODO: Need to match employee number with the visit employee number for online customer (fine for offline customer also)
        // showButtons =
        //   getOnlyDate(visitInfoObj?.callFromDatetime) <=
        //   getOnlyDate(getISOCurrentDate());
        // &&
        // callStatus !== VISITS_CALL_STATUS.FINISHED;
        //  &&
        // employeeNoToMatch.includes(visitInfo?.employeeNumber);
      } else {
        const date1 = visitInfoObj?.callFromDatetime;
        const date2 = getISOCurrentDate();

        const extractedDate1 = date1.split(' ')[0];
        const extractedDate2 = date2.split(' ')[0];

        showButtons =
          visitInfoObj?.callFromDatetime <= getISOCurrentDate() ||
          extractedDate1 === extractedDate2;
      }

      const formattedVisitData = {
        name1: customerInfo?.name1 ?? customerInfo?.customer_name,
        name2: customerInfo?.name2,
        name3: customerInfo?.name3,
        address: customerInfo?.address1,
        visitDate,
        visitDateFull,
        visitStartTime,
        visitEndTime,
        visitDuration,
        visitObjective: visitInfoObj?.visitObjective || '',
        visitCallStatus: visitInfoObj.callStatus,
        visitType: visitInfoObj?.visitType,
        callPlaceNumber: visitInfoObj?.callPlaceNumber,
        idCall: visitInfoObj?.idCall,
        callFromDateTime: visitInfoObj?.callFromDatetime,
        callToDateTime: visitInfoObj?.callToDatetime,
        idEmployeeObjective: visitInfoObj?.idEmployeeObjective,
        visitNotes: visitInfoObj?.visitPreparationNotes,
        showButtons,
      };

      visitInformation = [formattedVisitData];
    }

    return visitInformation;
  }

  async pauseVisit(callPlaceNumber: string, idCall: string) {
    const pauseVisit = await this.callsService.pauseVisit(
      callPlaceNumber,
      idCall,
    );

    return pauseVisit;
  }

  async resumeVisit(idCall: string) {
    const resumeVisit = await this.callsService.resumeVisit(idCall);

    return resumeVisit;
  }

  async checkOrderLinkWithFinishVisit(idCall: string) {
    const linkOrders = await this.callsService.getOrderLinkWithFinishVisit(
      idCall,
    );

    if (linkOrders.length > 0) {
      return false;
    }
    return true;
  }

  async finishVisit(idCall: string) {
    const finishVisit = await this.callsService.finishVisit(idCall);

    return finishVisit;
  }

  async isCustomerOnVacation(customerInfo: any) {
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : customerInfo.customer_ship_to;
    const customerVacationResult =
      await this.customerVacationsService.checkIsCustomerOnVacation(
        customerShipTo,
      );

    if (customerVacationResult.length > 0) {
      const customerVacationObj = customerVacationResult[0];
      customerVacationObj.endVacationDateTime = getDateWithMonthName(
        customerVacationObj.endVacationDateTime,
      );

      return customerVacationObj;
    }
    return false;
  }
}
export default new CLOverviewController();
