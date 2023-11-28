import BaseApiService from './BaseApiService';
import QuestionAnswers from 'src/storage/OfflineDBStorage/WmDB/models/QuestionAnswers';
import {QuestionAnswersRepo} from 'src/repo/QuestionAnswersRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';

export class QuestionAnswersService extends BaseApiService<
  QuestionAnswers,
  QuestionAnswersRepo
> {
  private readonly repo: QuestionAnswersRepo = new QuestionAnswersRepo();

  getRepo(): QuestionAnswersRepo {
    return this.repo;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.QUESTION_ANSWERS;
  }

  async getSalesMaterialBrochureCount() {
    return await this.getRepo().getSalesMaterialBrochureCount();
  }

  async getSalesMaterialFileCount(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    return await this.getRepo().getSalesMaterialFileCount(
      customerShipTo,
      salesOrganization,
      distributionChannel,
    );
  }
}
