import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import PersonTitles from 'src/storage/OfflineDBStorage/WmDB/models/PersonTitles';
import {PersonTitlesRepo} from 'src/repo/PersonTitlesRepo';

export class PersonTitlesService extends BaseApiService<
  PersonTitles,
  PersonTitlesRepo
> {
  private readonly PersonTitlesRepository: PersonTitlesRepo =
    new PersonTitlesRepo();

  getRepo(): PersonTitlesRepo {
    return this.PersonTitlesRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.PERSON_TITLES;
  }

  async getDropdownData() {
    return await this.getRepo().getDropdownData();
  }

  async getContactDropdownData() {
    return await this.getRepo().getContactDropdownData();
  }
}
