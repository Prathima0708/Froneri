import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import TextsReports from 'src/storage/OfflineDBStorage/WmDB/models/TextsReports';
import {TextsReportsRepo} from 'src/repo/TextsReportsRepo';

export class TextsReportsService extends BaseApiService<TextsReports, TextsReportsRepo> {
  private readonly TextsReportsRepository: TextsReportsRepo = new TextsReportsRepo();

  getRepo(): TextsReportsRepo {
    return this.TextsReportsRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.TEXTS_REPORTS;
  }

  async getTextsReportsValue(labelName: string) {
    return await this.getRepo().getTextsReportsValue(labelName);
  }
}
