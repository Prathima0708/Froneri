import {DiscoveryService} from 'src/services/DiscoveryService';
import {ProspectVisitNotesService} from 'src/services/ProspectVisitNotesService';

class PLNotesController {
  private discoveryService: DiscoveryService;
  private prospectVisitNotesService: ProspectVisitNotesService;

  constructor() {
    this.discoveryService = new DiscoveryService();
    this.prospectVisitNotesService = new ProspectVisitNotesService();
  }

  async getSRNotes() {
    // Call DB to get all the info
    return await this.discoveryService.getSRNotes();
  }

  async updateSRNotes(notes: string) {
    //Call DB to update info
    return await this.discoveryService.updateSRNotes(notes);
  }

  async getVisitNotes() {
    // Call DB to get prospect visit notes
    return await this.prospectVisitNotesService.getVisitNotes();
  }

  async updateOrInsertVisitNotes(notes: string, visitNoteId?: string) {
    //Call DB to update or insert info
    return await this.prospectVisitNotesService.updateOrInsertVisitNotes(
      notes,
      visitNoteId,
    );
  }
}
export default new PLNotesController();
