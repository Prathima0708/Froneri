import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import Activities from 'src/storage/OfflineDBStorage/WmDB/models/Activities';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {getISOCurrentDate, getUUID} from 'src/utils/CommonUtil';
import {ACTIVITY_TYPE} from 'src/utils/DbConst';

const ENTITY = OFFLINE_STORAGE.MODEL.ACTIVITIES;

export class ActivitiesRepo extends BaseRepo<Activities> {
  /**
   * Function returns true/false based on update status
   * @returns
   */
  async insertTaRequestCustomerJournal(
    tradeAssetId: string,
    customerNumber: string,
  ) {
    try {
      const collection = this.getCollection(ENTITY);
      const employeeInfo = await this.getLoggedInEmployeeInfo();

      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
      const callPlaceNumber =
        employeeInfo.length > 0 ? employeeInfo[0].callPlaceNumber : '';

      const uniqueId = getUUID();

      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.idActivity = uniqueId;
          rec.activityType = ACTIVITY_TYPE.SERVICE_WORKFLOW_REQUEST;
          rec.employeeNumber = employeeNo;
          rec.customerShipTo = customerNumber;
          rec.callPlaceNumber = callPlaceNumber;
          rec.activityDatetime = '';
          rec.idObject = tradeAssetId;
          rec.sentDatetime = null;
        });
      });
      return true;
    } catch (error) {
      console.log('insertTaRequestCustomerJournal error :>> ', error);
      return false;
    }
  }

  /**
   * Function returns true/false based on update status
   * @returns
   */
  async insertOrUpdateServiceWorkflowActivities(serviceWorkflowData: any) {
    try {
      const collection = this.getCollection(ENTITY);
      const employeeInfo = await this.getLoggedInEmployeeInfo();

      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
      const currentDate = getISOCurrentDate();
      const idActivity = getUUID();
      const idServiceRequestCustomer =
        serviceWorkflowData?.idServiceRequestCustomer ?? '';
      const customerShipTo = serviceWorkflowData?.customerShipTo ?? '';
      const callPlaceNumber = serviceWorkflowData?.callPlaceNumber ?? '';

      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.idActivity = idActivity;
          rec.activityType = ACTIVITY_TYPE.SERVICE_WORKFLOW_REQUEST;
          rec.employeeNumber = employeeNo;
          rec.customerShipTo = customerShipTo;
          rec.callPlaceNumber = callPlaceNumber;
          rec.activityDatetime = currentDate;
          rec.idObject = idServiceRequestCustomer;
          rec.sentDatetime = null;
        });
      });

      return true;
    } catch (error) {
      console.log('insertOrUpdateServiceWorkflowActivities error :>> ', error);
      return true;
    }
  }
}
