import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import DiscoveryAgreementRequests from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryAgreementRequests';
import {DiscoveryAgreementRequestsRepo} from 'src/repo/DiscoveryAgreementRequestsRepo';

export class DiscoveryAgreementRequestsService extends BaseApiService<
  DiscoveryAgreementRequests,
  DiscoveryAgreementRequestsRepo
> {
  private readonly DiscoveryAgreementRequestsRepository: DiscoveryAgreementRequestsRepo =
    new DiscoveryAgreementRequestsRepo();

  getRepo(): DiscoveryAgreementRequestsRepo {
    return this.DiscoveryAgreementRequestsRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.DISCOVERY_AGREEMENT_REQUESTS;
  }

  async createFinalizeAgreementRequest(
    requestedAgreementType: string,
    fieldData: any,
    financialData: any,
  ) {
    return await this.getRepo().createFinalizeAgreementRequest(
      requestedAgreementType,
      fieldData,
      financialData,
    );
  }
}
