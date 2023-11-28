import {ActivitiesService} from 'src/services/ActivitiesService';
import {ServiceRequestTypesService} from 'src/services/ServiceRequestTypesService';
import {ServiceRequestsCustomersJournalService} from 'src/services/ServiceRequestsCustomersJournalService';
import {ServiceRequestsCustomersService} from 'src/services/ServiceRequestsCustomersService';
import {getUUID} from 'src/utils/CommonUtil';
import {SERVICE_REQUEST_JOURNAL_STATUS} from 'src/utils/DbConst';

class CLServiceWorkflowController {
  private serviceRequestsCustomersService: ServiceRequestsCustomersService;
  private serviceRequestsCustomersJournalService: ServiceRequestsCustomersJournalService;
  private serviceRequestTypesService: ServiceRequestTypesService;
  private activitiesService: ActivitiesService;

  constructor() {
    this.serviceRequestsCustomersService =
      new ServiceRequestsCustomersService();
    this.serviceRequestsCustomersJournalService =
      new ServiceRequestsCustomersJournalService();
    this.serviceRequestTypesService = new ServiceRequestTypesService();
    this.activitiesService = new ActivitiesService();
  }

  async getServiceWorkflowListingOfCustomer(
    start: number,
    limit: number,
    statusType: string,
    filterObj: any,
  ) {
    return await this.serviceRequestsCustomersService.getServiceWorkflowListingOfCustomer(
      start,
      limit,
      statusType,
      filterObj,
    );
  }

  async insertOrUpdateServiceRequestsCustomersData(
    serviceRequestsCustomersData: any,
  ) {
    let actionType = '';

    if (serviceRequestsCustomersData?.isCreated) {
      actionType = SERVICE_REQUEST_JOURNAL_STATUS.CREATION;
      serviceRequestsCustomersData.idServiceRequestCustomer = getUUID();
      const isActivitiesSaved =
        await this.activitiesService.insertOrUpdateServiceWorkflowActivities(
          serviceRequestsCustomersData,
        );

      if (!isActivitiesSaved) {
        return false;
      }
    } else if (serviceRequestsCustomersData?.isAssignedToUpdated) {
      actionType = SERVICE_REQUEST_JOURNAL_STATUS.ASSIGNMENT;
    } else if (serviceRequestsCustomersData?.status === '3') {
      actionType = SERVICE_REQUEST_JOURNAL_STATUS.COMPLETION;
    } else {
      actionType = SERVICE_REQUEST_JOURNAL_STATUS.UPDATE;
    }

    const serviceRequestsCustomersDataSaved =
      await this.serviceRequestsCustomersService.insertOrUpdateServiceRequestsCustomersData(
        serviceRequestsCustomersData,
      );

    if (!serviceRequestsCustomersDataSaved) {
      return false;
    }

    const isJournalDataSaved =
      await this.serviceRequestsCustomersJournalService.insertOrUpdateServiceWorkflowJournal(
        serviceRequestsCustomersData?.idServiceRequestCustomer,
        actionType,
      );

    if (!isJournalDataSaved) {
      return false;
    }

    return true;
  }

  async deleteServiceWorkflowData(idServiceRequestCustomer: string) {
    return await this.serviceRequestsCustomersService.deleteServiceWorkflowData(
      idServiceRequestCustomer,
    );
  }

  async getNumberOfDaysOfRequestedDate(idServiceRequestType: number) {
    return await this.serviceRequestTypesService.getNumberOfDaysOfRequestedDate(
      idServiceRequestType,
    );
  }

  async getServiceRequestTypeDescription(idServiceRequestType: number) {
    return await this.serviceRequestTypesService.getServiceRequestTypeDescription(
      idServiceRequestType,
    );
  }
}

export default new CLServiceWorkflowController();
