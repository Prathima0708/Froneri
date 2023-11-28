import {VISITS_CALL_STATUS} from 'src/utils/DbConst';
import {CallsService} from 'src/services/CallsService';
import {DiscoveryService} from 'src/services/DiscoveryService';
import {TasksService} from 'src/services/TasksService';
import {QuestionAnswersService} from 'src/services/QuestionAnswersService';
import {ServiceRequestsCustomersService} from 'src/services/ServiceRequestsCustomersService';
import {formatDate, getLocaleNumberFormatter} from 'src/utils/CommonUtil';
import {TextsService} from 'src/services/TextsService';

class HomeContoller {
  private callsService: CallsService;
  private discoveryService: DiscoveryService;
  private tasksService: TasksService;
  private questionAnswersService: QuestionAnswersService;
  private serviceRequestsCustomersService: ServiceRequestsCustomersService;
  private textsService: TextsService;

  constructor() {
    this.callsService = new CallsService();
    this.discoveryService = new DiscoveryService();
    this.tasksService = new TasksService();
    this.questionAnswersService = new QuestionAnswersService();
    this.serviceRequestsCustomersService =
      new ServiceRequestsCustomersService();
    this.textsService = new TextsService();
  }

  async getWorkflowCustomerProspectTaskSalesCount() {
    // Call DB to get all the info

    // service workflows
    let serviceWorkflowAssignedByMeCount =
      await this.serviceRequestsCustomersService.getOpenRequestAssignedToMeCount();

    let serviceWorkflowCreatedByMeCount =
      await this.serviceRequestsCustomersService.getOpenRequestCreatedByMeCount();

    // customers
    let customersToVisitTodayCount =
      await this.callsService.getCustomersToVisitToday();
    let delegatedCustomerVisitsCount =
      await this.callsService.getDelegatedCustomersVisit();
    //prospects
    let delegatedPropectVisitsCount =
      await this.callsService.getDelegatedProspectsVisit();
    let prospectsToVisitTodayCount =
      await this.callsService.getProspectsToVisitToday();

    let prospectsActiveCount = await this.discoveryService.getActiveProspects();
    let prospectsNewCustomerRequestCount =
      await this.discoveryService.getProspectNewCustomerRequestVisit();

    // Tasks
    let vaildTaskTodayCount = await this.tasksService.getValidOpenTasks();
    let completedTaskTodayCount = await this.tasksService.getCompletedTasks();
    // Sales material
    let brochureCount =
      await this.questionAnswersService.getSalesMaterialBrochureCount();

    serviceWorkflowAssignedByMeCount = getLocaleNumberFormatter(
      serviceWorkflowAssignedByMeCount,
    );
    serviceWorkflowCreatedByMeCount = getLocaleNumberFormatter(
      serviceWorkflowCreatedByMeCount,
    );
    customersToVisitTodayCount = getLocaleNumberFormatter(
      customersToVisitTodayCount,
    );
    delegatedCustomerVisitsCount = getLocaleNumberFormatter(
      delegatedCustomerVisitsCount,
    );
    delegatedPropectVisitsCount = getLocaleNumberFormatter(
      delegatedPropectVisitsCount,
    );
    prospectsToVisitTodayCount = getLocaleNumberFormatter(
      prospectsToVisitTodayCount,
    );
    prospectsActiveCount = getLocaleNumberFormatter(prospectsActiveCount);
    prospectsNewCustomerRequestCount = getLocaleNumberFormatter(
      prospectsNewCustomerRequestCount,
    );

    vaildTaskTodayCount = getLocaleNumberFormatter(vaildTaskTodayCount);
    completedTaskTodayCount = getLocaleNumberFormatter(completedTaskTodayCount);
    brochureCount = getLocaleNumberFormatter(brochureCount);

    // Update DB value into respective key..
    const res = {
      serviceWorkflowAssignedByMeCount: serviceWorkflowAssignedByMeCount,
      serviceWorkflowCreatedByMeCount: serviceWorkflowCreatedByMeCount,
      customersToVisitTodayCount: customersToVisitTodayCount,
      delegatedCustomerVisitsCount: delegatedCustomerVisitsCount,
      delegatedPropectVisitsCount: delegatedPropectVisitsCount,
      prospectsToVisitTodayCount: prospectsToVisitTodayCount,
      prospectsActiveCount: prospectsActiveCount,
      prospectsNewCustomerRequestCount: prospectsNewCustomerRequestCount,
      validOpenTasks: vaildTaskTodayCount,
      completedTasks: completedTaskTodayCount,
      brochureCount: brochureCount,
    };

    return res;
  }

  async getTodaysOpenPausedCompletedVisits() {
    let todaysVisits = {
      open: [],
      paused: [],
      completed: [],
    };
    let todaysDate = new Date();
    let startDate = formatDate(todaysDate);
    let endDate = formatDate(todaysDate);

    const getAllVisits = await this.callsService.getVisitAgenda(
      startDate,
      endDate,
    );
    if (getAllVisits.length > 0) {
      // Open Visits - Sum of callStatus - 0 & 1
      const todaysOpenVisit = getAllVisits.filter(
        (item: any) =>
          item.call_status === VISITS_CALL_STATUS.INITIAL ||
          item.call_status === VISITS_CALL_STATUS.OPEN,
      );

      // Paused Visits - Sum of callStatus - 8
      const todaysPausedVisits = getAllVisits.filter(
        (item: any) => item.call_status === VISITS_CALL_STATUS.ONHOLD,
      );

      // Completed Visits - Sum of callStatus - 2, 3, 4, 5
      const todaysCompletedVisits = getAllVisits.filter(
        (item: any) =>
          item.call_status === VISITS_CALL_STATUS.ORDER ||
          item.call_status === VISITS_CALL_STATUS.NO_ORDER ||
          item.call_status === VISITS_CALL_STATUS.FINISHED ||
          item.call_status === VISITS_CALL_STATUS.CLOSED,
      );

      todaysVisits.open = todaysOpenVisit;
      todaysVisits.paused = todaysPausedVisits;
      todaysVisits.completed = todaysCompletedVisits;
    }

    return todaysVisits;
  }

  async getMissedVisitAgenda(start: number, limit: number) {
    // Call DB to get all the info
    console.log('start, limit', start, limit);
    const missedVisits = await this.callsService.getMissedVisitAgenda(
      start,
      limit,
    );
    return missedVisits;
  }

  async getTextsData(lang: string) {
    return await this.textsService.getTextsData(lang);
  }
}
export default new HomeContoller();
