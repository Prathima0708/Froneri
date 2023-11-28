import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import ProspectVisitNotes from 'src/storage/OfflineDBStorage/WmDB/models/ProspectVisitNotes';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {getISOCurrentDate, getUUID} from 'src/utils/CommonUtil';

const ENTITY = OFFLINE_STORAGE.MODEL.PROSPECT_VISIT_NOTES;

export class ProspectVisitNotesRepo extends BaseRepo<ProspectVisitNotes> {
  /**
   * Function for get prospect backoffice notes
   * @returns
   */
  async getVisitNotes() {
    const prospectData = await this.getPLProspectInfo();
    const discoveryId = prospectData?.discoveryId
      ? prospectData.discoveryId
      : '';
    const collection = this.getCollection(ENTITY);

    const QUERY =
      'select pvn.visit_note as internalMessage, ' +
      "e.last_name || ' ' || e.first_name as employeeName, " +
      'pvn.updated_employee_number as employeeNumber, ' +
      'coalesce(c.call_from_datetime, pvn.updated_datetime) as visitDate, ' +
      'discovery_id as discoveryId, pvn.id_call, pvn.prospect_visit_notes_id ' +
      'from prospect_visit_notes as pvn ' +
      'left join employees as e on pvn.updated_employee_number = e.employee_number ' +
      'left join calls as c on pvn.id_call = c.id_call ' +
      `where discovery_id = '${discoveryId}' ` +
      'order by visitDate DESC';

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns true/false based on prospect visit notes update or insert
   * @returns
   */
  async updateOrInsertVisitNotes(notes: string, visitNoteId?: string) {
    const prospectData = await this.getPLProspectInfo();
    const discoveryId = prospectData?.discoveryId
      ? prospectData.discoveryId
      : '';
    const collection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const currentDate = getISOCurrentDate();

    if (visitNoteId) {
      //Update Visit Notes
      const prospectObj = await collection
        .query(
          Q.where('discovery_id', discoveryId),
          Q.where('prospect_visit_notes_id', visitNoteId),
        )
        .fetch();
      if (prospectObj.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await prospectObj[0].update((rec: any) => {
            rec.visitNote = notes;
            rec.updatedEmployeeNumber = employeeNo;
            rec.updatedDatetime = currentDate;
            rec.noteType = 0;
          });
        });
        return true;
      } else {
        return false;
      }
    } else {
      //Insert Visit Data
      try {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await collection.create((rec: any) => {
            rec.discoveryId = discoveryId;
            rec.prospectVisitNotesId = getUUID();
            rec.idCall = null;
            rec.visitNote = notes;
            rec.updatedEmployeeNumber = employeeNo;
            rec.updatedDatetime = currentDate;
            rec.sentDatetime = null;
            rec.noteType = 0;
          });
        });
        return true;
      } catch (error) {
        console.log('insertProspectVisitNotesData error :>> ', error);
        return false;
      }
    }
  }
}
