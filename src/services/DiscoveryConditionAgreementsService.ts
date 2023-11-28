import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import DiscoveryConditionAgreements from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryConditionAgreements';
import {DiscoveryConditionAgreementsRepo} from 'src/repo/DiscoveryConditionAgreementsRepo';

export class DiscoveryConditionAgreementsService extends BaseApiService<
  DiscoveryConditionAgreements,
  DiscoveryConditionAgreementsRepo
> {
  private readonly discoveryConditionAgreementsRepository: DiscoveryConditionAgreementsRepo =
    new DiscoveryConditionAgreementsRepo();

  getRepo(): DiscoveryConditionAgreementsRepo {
    return this.discoveryConditionAgreementsRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.DISCOVERY_CONDITION_AGREEMENTS;
  }

  async checkConditionAgreement(discoveryId: string) {
    return await this.getRepo().checkConditionAgreement(discoveryId);
  }

  async checkProspectLinkedConditionAgreement() {
    return await this.getRepo().checkProspectLinkedConditionAgreement();
  }

  async getConditionalAgreement(
    isFilterApplied: boolean,
    idContractType: number,
  ) {
    return await this.getRepo().getConditionalAgreement(
      isFilterApplied,
      idContractType,
    );
  }

  async insertOrUpdateConditionalAgreement(
    conditionalAgreementDataData: any,
    conditionAgreementNumber: string,
  ) {
    return await this.getRepo().insertOrUpdateConditionalAgreement(
      conditionalAgreementDataData,
      conditionAgreementNumber,
    );
  }

  async getCADropdownValues(countryCode: string) {
    return await this.getRepo().getCADropdownValues(countryCode);
  }

  async getConditionAgreementForProspect() {
    return await this.getRepo().getConditionAgreementForProspect();
  }

  async getConditionAgreementForCustomer() {
    return await this.getRepo().getConditionAgreementForCustomer();
  }

  async deleteConditionAgreement(conditionAgreementNumber: string) {
    return await this.getRepo().deleteConditionAgreement(
      conditionAgreementNumber,
    );
  }

  async getConditionAgreementHtmlTemplate() {
    return await this.getRepo().getConditionAgreementHtmlTemplate();
  }

  async insertOrUpdateDiscoveryConditionalAgreement(
    conditionalAgreementDataData: any,
  ) {
    return await this.getRepo().insertOrUpdateDiscoveryConditionalAgreement(
      conditionalAgreementDataData,
    );
  }

  async getConditionDataOfProspect(agreementNumber: string) {
    return await this.getRepo().getConditionDataOfProspect(agreementNumber);
  }
}
