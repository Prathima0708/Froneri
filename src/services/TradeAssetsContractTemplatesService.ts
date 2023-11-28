import BaseApiService from './BaseApiService';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {TradeAssetsContractTemplatesRepo} from 'src/repo/TradeAssetsContractTemplatesRepo';
import TradeAssetsContractTemplates from 'src/storage/OfflineDBStorage/WmDB/models/TradeAssetsContractTemplates';

export class TradeAssetsContractTemplatesService extends BaseApiService<
  TradeAssetsContractTemplates,
  TradeAssetsContractTemplatesRepo
> {
  private readonly tradeAssetsContractTemplatesRepo: TradeAssetsContractTemplatesRepo =
    new TradeAssetsContractTemplatesRepo();

  getRepo(): TradeAssetsContractTemplatesRepo {
    return this.tradeAssetsContractTemplatesRepo;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.TRADE_ASSETS_CONTRACT_TEMPLATES;
  }

  async getTermsAndConditionsTemplateName(
    abcClassification: string,
    isProspect: boolean,
    language: string,
    market: string,
  ) {
    return await this.getRepo().getTermsAndConditionsTemplateName(
      market,
      abcClassification,
      language,
      isProspect,
    );
  }
}
