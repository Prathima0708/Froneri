import BaseApiService from './BaseApiService';
import InternalMessages from 'src/storage/OfflineDBStorage/WmDB/models/InternalMessages';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {InternalMessagesRepo} from 'src/repo/InternalMessagesRepo';

export class InternalMessagesService extends BaseApiService<
  InternalMessages,
  InternalMessagesRepo
> {
  private readonly InternalMessagesRepo: InternalMessagesRepo =
    new InternalMessagesRepo();

  getRepo(): InternalMessagesRepo {
    return this.InternalMessagesRepo;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.INTERNAL_MESSAGES;
  }

  async getCustomerNotes() {
    return await this.getRepo().getCustomerNotes();
  }

  async createOrUpdateCustomerNotes(notesObj: any) {
    return await this.getRepo().createOrUpdateCustomerNotes(notesObj);
  }

  async deleteCustomerNotes(notesObj: any) {
    return await this.getRepo().deleteCustomerNotes(notesObj);
  }
}
