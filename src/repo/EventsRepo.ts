import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {getISOCurrentDate, getUUID} from 'src/utils/CommonUtil';
import Events from 'src/storage/OfflineDBStorage/WmDB/models/Events';

const ENTITY = OFFLINE_STORAGE.MODEL.EVENTS;

export class EventsRepo extends BaseRepo<Events> {
  /**
   * Events - Insert data
   * @returns
   */
  async createEvent() {
    try {
      const prospect = await this.getPLProspectInfo();
      const discoveryId = prospect?.discoveryId ? prospect.discoveryId : '';

      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
      const currentDate = getISOCurrentDate();

      const collection = this.getCollection(ENTITY);

      const idEvent = getUUID();

      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.idEvent = idEvent;
          rec.eventType = '12';
          rec.eventDatetime = currentDate;
          rec.result = '1';
          rec.requestMessageTriggered = '1';
          rec.resultMessageTriggered = '0';
          rec.sourceEmployeeNumber = employeeNo;
          rec.destinationEmployeeNumber = '';
          rec.idObject = discoveryId;
          rec.idWorkflowEvent = '';
          rec.mailToDestinationRequired = '1';
          rec.mailToSourceRequired = '1';
          rec.resultAdditionalComment = '';
        });
      });

      return true;
    } catch (error) {
      console.log('createEvent error :>> ', error);
      return false;
    }
  }
}
