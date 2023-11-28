import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import Calendars from 'src/storage/OfflineDBStorage/WmDB/models/Calendars';
import {CalendarsRepo} from 'src/repo/CalendarsRepo';

export class CalendarsService extends BaseApiService<Calendars, CalendarsRepo> {
  private readonly calendarsRepository: CalendarsRepo = new CalendarsRepo();

  getRepo(): CalendarsRepo {
    return this.calendarsRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CALENDARS;
  }

  async getSeasonData() {
    return await this.getRepo().getSeasonData();
  }
}

export default new CalendarsService();
