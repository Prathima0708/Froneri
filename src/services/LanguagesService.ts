import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {LanguagesRepo} from 'src/repo/LanguagesRepo';
import Languages from 'src/storage/OfflineDBStorage/WmDB/models/Languages';

export class LangagesService extends BaseApiService<Languages, LanguagesRepo> {
  private readonly languagesRepository: LanguagesRepo = new LanguagesRepo();

  getRepo(): LanguagesRepo {
    return this.languagesRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.LANGUAGES;
  }

  async getLanguagesData() {
    let languagesData = [];

    const data = await this.getRepo().getLanguagesData();

    for (let i = 1; i <= 4; i++) {
      if (data[0][`enable_language_${i}`] === '1') {
        let obj = {
          language: data[0][`language${i}`] || '',
          descriptionLanguage: data[0][`description_language_${i}`] || '',
          languageKey: data[0][`language${i}`].slice(0, 2) || '',
          indexLanguage: i,
        };

        languagesData.push(obj);
      }
    }

    return languagesData;
  }
}

export default new LangagesService();
