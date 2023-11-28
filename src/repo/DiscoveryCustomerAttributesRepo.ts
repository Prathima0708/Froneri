import BaseRepo from './BaseRepo';
import DiscoveryCustomerAttributes from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryCustomerAttributes';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import {getISOCurrentDate} from 'src/utils/CommonUtil';

const ENTITY = OFFLINE_STORAGE.MODEL.DISCOVERY_CUSTOMER_ATTRIBUTES;

export class DiscoveryCustomerAttributesRepo extends BaseRepo<DiscoveryCustomerAttributes> {
  /**
   * create new prospect - discovery customer attributues info insert function
   * Function returns true/false based on prospect is inserted or not
   * previousCustomerShipTo, discoveryId, prospectCanvasserData, previousCustomerBasicInfo - get from screen
   * @returns
   */
  async saveCreateProspectDiscoveryCustomerAttributeInfo(
    previousCustomerShipTo: string,
    discoveryId: string,
    prospectCanvasser: any,
    previousCustomerBasicInfoData: any,
  ) {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectCanvasserData = prospectCanvasser[0];
      const previousCustomerBasicInfo = previousCustomerBasicInfoData[0];

      // previous customer basic info
      const abcClassification = previousCustomerBasicInfo?.abcClassification
        ? previousCustomerBasicInfo.abcClassification
        : '';

      // prospect canvasser data
      const partnerNumber = prospectCanvasserData?.partnerNumber
        ? prospectCanvasserData.partnerNumber
        : '';

      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.discoveryId = discoveryId;
          rec.canvasserEmployeeNumber = partnerNumber;
          rec.sentDatetime = null;

          if (previousCustomerShipTo !== '') {
            rec.abcClassification = abcClassification;
          }
        });
      });
      return true;
    } catch (error) {
      console.log(
        'saveCreateProspectDiscoveryCustomerAttributeInfo error :>> ',
        error,
      );
      return false;
    }
  }

  /**
   * PLP - Customer attribute info -> get prospect info
   * @returns
   */
  async getProspectCustomerAttributeInfo() {
    const collection = this.getCollection(ENTITY);

    const prospectData = await this.getPLProspectInfo();
    const discoveryId = prospectData?.discoveryId
      ? prospectData.discoveryId
      : '';

    let results = await collection
      .query(
        Q.unsafeSqlQuery(
          'select discovery_customer_attributes.abc_classification as abcClassification, ' +
            'discovery_customer_attributes.priority as priority, ' +
            'discovery_customer_attributes.start_customer_business_datetime as startCustomerBusinessDatetime, ' +
            'discovery_customer_attributes.id_customer_business_reason_start as idCustomerBusinessReasonStart, ' +
            'discovery_customer_attributes.canvasser_employee_number as canvasserEmployeeNumber, ' +
            'discovery_customer_attributes.indirect_customer as indirectCustomer, ' +
            'discovery_customer_attributes.wholesaler_customer_number as wholesalerCustomerNumber, ' +
            'discovery_customer_attributes.id_distributors as idDistributors,' +
            'discovery_customer_attributes.scooping as scooping, ' +
            'discovery_customer_attributes.key_account_gln_code as keyAccountGlnCode, ' +
            'discovery_customer_attributes.owner_deputy_first_name as ownerDeputyFirstName, ' +
            'discovery_customer_attributes.owner_deputy_last_name as ownerDeputyLastName, ' +
            'discovery_customer_attributes.owner_deputy_dob as ownerDeputyDob ' +
            'from discovery_customer_attributes where discovery_id = ? ',
          [discoveryId],
        ),
      )
      .unsafeFetchRaw();

    return results;
  }

  /**
   * PLP - Customer attribute info -> insert/update
   * @returns
   */

  async insertOrUpdateCustomerAttributeInfo(customerAttributeData: any) {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';
      const statusType = prospectData?.statusType
        ? prospectData.statusType
        : 'p';

      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
      const currentDate = getISOCurrentDate();

      const customerAttributeDataObj = await collection
        .query(Q.where('discovery_id', discoveryId))
        .fetch();

      const abcClassification = customerAttributeData?.abcClassification ?? '';
      const priority = customerAttributeData?.priority ?? '';
      const scooping = customerAttributeData?.scooping ? '1' : '0';
      const startCustomerBusinessDatetime =
        customerAttributeData?.startBusinessDate
          ? customerAttributeData?.startBusinessDate
              .toISOString()
              .replace('T', ' ')
              .replace('Z', '')
          : '';
      const idCustomerBusinessReasonStart =
        customerAttributeData?.startBusinessReason
          ? customerAttributeData?.startBusinessReason
          : '';
      const keyAccountGlnCode = customerAttributeData?.keyAccountGLNCode
        ? customerAttributeData?.keyAccountGLNCode
        : '';
      const indirectCustomer = customerAttributeData?.indirectCustomer
        ? '1'
        : '0';
      const wholesalerCustomerNumber =
        customerAttributeData?.wholeSalerCustomerNumber
          ? customerAttributeData?.wholeSalerCustomerNumber
          : '';
      const idDistributors = customerAttributeData?.distributer
        ? Number(customerAttributeData?.distributer)
        : 0;
      const ownerDeputyFirstName = customerAttributeData?.firstName ?? '';
      const ownerDeputyLastName = customerAttributeData?.lastName ?? '';
      const name = customerAttributeData?.name ?? '';

      if (customerAttributeDataObj.length > 0) {
        //update
        await OFFLINE_STORAGE.getDB().write(async () => {
          await customerAttributeDataObj[0].update((rec: any) => {
            if (statusType.toLowerCase() == 'p') {
              rec.abcClassification = abcClassification;
              rec.priority = priority;
              rec.scooping = scooping;
              rec.startCustomerBusinessDatetime = startCustomerBusinessDatetime;
              rec.idCustomerBusinessReasonStart = idCustomerBusinessReasonStart;
              rec.keyAccountGlnCode = keyAccountGlnCode;
              rec.indirectCustomer = indirectCustomer;
              rec.wholesalerCustomerNumber = wholesalerCustomerNumber;
              rec.idDistributors = idDistributors;
              rec.ownerDeputyFirstName = ownerDeputyFirstName;
              rec.ownerDeputyLastName = ownerDeputyLastName;
              rec.name = name;
            } else {
              rec.priority = priority;
              rec.scooping = scooping;
              rec.idDistributors = idDistributors;
              rec.updateEmployeeNumber = employeeNo;
              rec.updateDatetime = currentDate;
              rec.sentDatetime = null;
            }
          });
        });
      } else {
        // inserting
        await OFFLINE_STORAGE.getDB().write(async () => {
          await collection.create((rec: any) => {
            if (statusType.toLowerCase() == 'p') {
              rec.discoveryId = discoveryId;
              rec.abcClassification = abcClassification;
              rec.priority = priority;
              rec.scooping = scooping;
              rec.startCustomerBusinessDatetime = startCustomerBusinessDatetime;
              rec.idCustomerBusinessReasonStart = idCustomerBusinessReasonStart;
              rec.keyAccountGlnCode = keyAccountGlnCode;
              rec.indirectCustomer = indirectCustomer;
              rec.wholesalerCustomerNumber = wholesalerCustomerNumber;
              rec.idDistributors = idDistributors;
              rec.ownerDeputyFirstName = ownerDeputyFirstName;
              rec.ownerDeputyLastName = ownerDeputyLastName;
              rec.name = name;
            } else {
              rec.discoveryId = discoveryId;
              rec.priority = priority;
              rec.scooping = scooping;
              rec.idDistributors = idDistributors;
              rec.updateEmployeeNumber = employeeNo;
              rec.updateDatetime = currentDate;
              rec.sentDatetime = null;
            }
          });
        });
      }
      return true;
    } catch (error) {
      console.log('insertOrUpdateCustomerAttributeInfo error :>> ', error);
      return false;
    }
  }
}
