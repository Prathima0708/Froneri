import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import ProspectVisitNotes from 'src/storage/OfflineDBStorage/WmDB/models/ProspectVisitNotes';
import {ProspectVisitNotesRepo} from 'src/repo/ProspectVisitNotesRepo';

export class ProspectVisitNotesService extends BaseApiService<
  ProspectVisitNotes,
  ProspectVisitNotesRepo
> {
  private readonly ProspectVisitNotesRepository: ProspectVisitNotesRepo =
    new ProspectVisitNotesRepo();

  getRepo(): ProspectVisitNotesRepo {
    return this.ProspectVisitNotesRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.PROSPECT_VISIT_NOTES;
  }

  async getVisitNotes() {
    return await this.getRepo().getVisitNotes();
  }

  async updateOrInsertVisitNotes(notes: string, visitNoteId?: string) {
    return await this.getRepo().updateOrInsertVisitNotes(notes, visitNoteId);
  }
}
