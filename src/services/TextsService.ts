import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import Texts from 'src/storage/OfflineDBStorage/WmDB/models/Texts';
import {TextsRepo} from 'src/repo/TextsRepo';

export class TextsService extends BaseApiService<Texts, TextsRepo> {
  private readonly TextsRepository: TextsRepo = new TextsRepo();

  getRepo(): TextsRepo {
    return this.TextsRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.TEXTS;
  }

  async getTextsValue(controlName: string, additionalQuery?: any) {
    return await this.getRepo().getTextsValue(controlName, additionalQuery);
  }

  async getTextsData(lang: string) {
    const data = await this.getRepo().getTextsData(lang);
    const transformedData = {};

    data.forEach(item => {
      const androidControlName = item.android_control_name;
      const text = item.text;

      if (androidControlName && text) {
        transformedData[androidControlName] = text;
      }
    });
    return transformedData;
  }
}
