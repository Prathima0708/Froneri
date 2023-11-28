import BaseRepo from './BaseRepo';
import DiscoveryAgreementRequests from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryAgreementRequests';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {getISOCurrentDate, getUUID} from 'src/utils/CommonUtil';
import {YAMBS_WORKFLOW_STATUS_TYPE} from 'src/utils/DbConst';

const ENTITY = OFFLINE_STORAGE.MODEL.DISCOVERY_AGREEMENT_REQUESTS;
export class DiscoveryAgreementRequestsRepo extends BaseRepo<DiscoveryAgreementRequests> {
  /**
   * Create Agreement Finalize Request
   * @returns
   */
  async createFinalizeAgreementRequest(
    requestedAgreementType: string,
    fieldData: any,
    financialData: any,
  ) {
    try {
      const prospect = await this.getPLProspectInfo();
      const discoveryId = prospect?.discoveryId ? prospect.discoveryId : '';

      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
      const currentDate = getISOCurrentDate();

      const collection = this.getCollection(ENTITY);
      const idAgreementRequest = getUUID();
      const agreementNumber = fieldData.agreementNumber
        ? fieldData.agreementNumber
        : '';
      const expectedTurnover1 = financialData.expectedTurnover1
        ? Number(financialData.expectedTurnover1)
        : null;
      const expectedTurnover2 = financialData.expectedTurnover2
        ? Number(financialData.expectedTurnover2)
        : null;
      const expectedTurnover3 = financialData.expectedTurnover3
        ? Number(financialData.expectedTurnover3)
        : null;

      console.log(
        'db insert data',
        discoveryId,
        idAgreementRequest,
        agreementNumber,
        requestedAgreementType,
        expectedTurnover1,
        expectedTurnover2,
        expectedTurnover3,
      );

      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.discoveryId = discoveryId;
          rec.idAgreementRequest = idAgreementRequest;
          rec.agreementNumber = agreementNumber;
          rec.requestedAgreementType = requestedAgreementType;
          rec.requestedStatus = YAMBS_WORKFLOW_STATUS_TYPE.REQUESTED;
          rec.requestedBy = employeeNo;
          rec.requestedDatetime = currentDate;
          rec.expectedTurnover1 = expectedTurnover1;
          rec.expectedTurnover2 = expectedTurnover2;
          rec.expectedTurnover3 = expectedTurnover3;
          rec.sentDatetime = null;
        });
      });

      return true;
    } catch (error) {
      console.log('createFinalizeAgreementRequest error :>> ', error);
      return false;
    }
  }
}
