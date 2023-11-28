import BaseApiService from './BaseApiService';
import Events from 'src/storage/OfflineDBStorage/WmDB/models/Events';
import {EventsRepo} from 'src/repo/EventsRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';

export class EventsService extends BaseApiService<Events, EventsRepo> {
  private readonly eventRepository: EventsRepo = new EventsRepo();

  getRepo(): EventsRepo {
    return this.eventRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.EVENTS;
  }

  async createEvent() {
    return await this.getRepo().createEvent();
  }
}
export default new EventsService();
