import BaseApiService from './BaseApiService';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import ServiceRequestTypes from 'src/storage/OfflineDBStorage/WmDB/models/ServiceRequestTypes';
import {ServiceRequestTypesRepo} from 'src/repo/ServiceRequestTypesRepo';

export class ServiceRequestTypesService extends BaseApiService<
  ServiceRequestTypes,
  ServiceRequestTypesRepo
> {
  private readonly serviceRequestTypesRepository: ServiceRequestTypesRepo =
    new ServiceRequestTypesRepo();

  getRepo(): ServiceRequestTypesRepo {
    return this.serviceRequestTypesRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.SERVICE_REQUEST_TYPES;
  }

  async getServiceRequestTypeDropdownData(
    searchText: string = '',
    idServiceRequestType: string = '',
  ) {
    return await this.getRepo().getServiceRequestTypeDropdownData(
      searchText,
      idServiceRequestType,
    );
  }

  async getNumberOfDaysOfRequestedDate(idServiceRequestType: number) {
    return await this.getRepo().getNumberOfDaysOfRequestedDate(
      idServiceRequestType,
    );
  }

  async getServiceRequestTypeDescription(idServiceRequestType: number) {
    return await this.getRepo().getServiceRequestTypeDescription(
      idServiceRequestType,
    );
  }

  async checkServiceWorkflowClaimType(idServiceRequestType: number) {
    return await this.getRepo().checkServiceWorkflowClaimType(
      idServiceRequestType,
    );
  }

  async getClaimsLayoutDropdownData(idServiceRequestType: number) {
    return await this.getRepo().getClaimsLayoutDropdownData(
      idServiceRequestType,
    );
  }
}
export default new ServiceRequestTypesService();
