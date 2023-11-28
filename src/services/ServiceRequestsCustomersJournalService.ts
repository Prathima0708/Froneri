import BaseApiService from './BaseApiService';
import ServiceRequestsCustomersJournal from 'src/storage/OfflineDBStorage/WmDB/models/ServiceRequestsCustomersJournal';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {ServiceRequestsCustomersJournalRepo} from 'src/repo/ServiceRequestsCustomersJournalRepo';

export class ServiceRequestsCustomersJournalService extends BaseApiService<
  ServiceRequestsCustomersJournal,
  ServiceRequestsCustomersJournalRepo
> {
  private readonly serviceRequestsCustomersJournalRepository: ServiceRequestsCustomersJournalRepo =
    new ServiceRequestsCustomersJournalRepo();

  getRepo(): ServiceRequestsCustomersJournalRepo {
    return this.serviceRequestsCustomersJournalRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.SERVICE_REQUESTS_CUSTOMERS_JOURNAL;
  }

  async insertTaRequestCustomerJournal(tradeAssetId: string) {
    return await this.getRepo().insertTaRequestCustomerJournal(tradeAssetId);
  }

  async insertOrUpdateServiceWorkflowJournal(
    idServiceRequestCustomer: string,
    actionType: string,
  ) {
    return await this.getRepo().insertOrUpdateServiceWorkflowJournal(
      idServiceRequestCustomer,
      actionType,
    );
  }

  async getTraceGridDataOfCustomer(idServiceRequestCustomer: string) {
    return await this.getRepo().getTraceGridDataOfCustomer(
      idServiceRequestCustomer,
    );
  }
}
