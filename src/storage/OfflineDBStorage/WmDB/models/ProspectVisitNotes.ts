
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class ProspectVisitNotes extends Model {
	static table = 'prospect_visit_notes';

	@field('prospect_visit_notes_id') prospectVisitNotesId!: string;
	@field('discovery_id') discoveryId!: string;
	@field('id_call') idCall!: string;
	@field('visit_note') visitNote!: string;
	@field('updated_employee_number') updatedEmployeeNumber!: string;
	@field('updated_datetime') updatedDatetime!: string;
	@field('sent_datetime') sentDatetime!: string;
	@field('note_type') noteType!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default ProspectVisitNotes;
