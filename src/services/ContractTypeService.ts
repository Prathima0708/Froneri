import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import ContractType from 'src/storage/OfflineDBStorage/WmDB/models/ContractType';
import {ContractTypeRepo} from 'src/repo/ContractTypeRepo';

export class ContractTypeService extends BaseApiService<
  ContractType,
  ContractTypeRepo
> {
  private readonly contractTypeRepository: ContractTypeRepo =
    new ContractTypeRepo();

  getRepo(): ContractTypeRepo {
    return this.contractTypeRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CONTRACT_TYPE;
  }

  async getHtmlTemplate(contractId: any) {
    return await this.getRepo().getHtmlTemplate(contractId);
  }

  async getCATermsAndConditionsTemplateName(idContractType: any) {
    return await this.getRepo().getCATermsAndConditionsTemplateName(
      idContractType,
    );
  }
}
