import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import CustomersClaimsWorkflowSettlementData from 'src/storage/OfflineDBStorage/WmDB/models/CustomersClaimsWorkflowSettlementData';
import {getServerDate} from 'src/utils/CommonUtil';
import LanguagesService from 'src/services/LanguagesService';

const ENTITY = OFFLINE_STORAGE.MODEL.CUSTOMERS_CLAIMS_WORKFLOW_SETTLEMENT_DATA;

export class CustomersClaimsWorkflowSettlementDataRepo extends BaseRepo<CustomersClaimsWorkflowSettlementData> {
  /**
   * Function returns true/false based on deletion
   * @returns
   */
  async deleteWorkflowSettlementData(idServiceRequestCustomer: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const workflowSettlementData = await collection
        .query(Q.where('id_service_request_customer', idServiceRequestCustomer))
        .fetch();

      console.log(
        'workflowSettlementData length :>> ',
        workflowSettlementData.length,
      );

      if (workflowSettlementData.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          for (const workflowSettlementDataItem of workflowSettlementData) {
            await workflowSettlementDataItem.destroyPermanently();
          }
        });
        return true;
      }

      return true;
    } catch (error) {
      console.log('deleteWorkflowSettlementData error :>> ', error);
      return false;
    }
  }

  /**
   * Function returns Grid: Free products
   * @returns []
   */
  async getGridFreeProducts(idServiceRequestCustomer: any) {
    try {
      const CustomersIndustryCodesCollection = this.getCollection(ENTITY);
      const languagesData = await LanguagesService.getLanguagesData();
      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const languageIndex = languagesData.find(
        (languageData: any) =>
          languageData.language === employeeInfo[0].language,
      )?.indexLanguage;
      const QUERY =
        'SELECT ' +
        'CAST(CCWSD.Free_Good_Number as DECIMAL(10,2)) AS materialNumber, ' +
        `description_language_${languageIndex} As materialDescription, ` +
        'CCWSD.Free_Good_Quantity as quantity, ' +
        'CCWSD.Free_Good_Quantity_Sales_Units as salesUnit, ' +
        'CAST(coalesce(CCWSD.Free_Good_Value, 0) As Decimal(10, 2)) As price ' +
        'FROM Customers_Claims_WorkFlow_Settlement_Data CCWSD ' +
        'INNER JOIN Customers_Claims_WorkFlow_Header CCWH ' +
        'ON CCWSD.ID_Service_Request_Customer = CCWH.ID_Service_Request_Customer ' +
        'INNER JOIN Materials ' +
        "ON Materials.Material_Number = substr('000000000000000000' || CCWSD.Free_Good_Number, length(CCWSD.Free_Good_Number) + 1, 18) " +
        'AND CCWH.Sales_organization=Materials.Sales_organization ' +
        'AND CCWH.Distribution_channel=Materials.Distribution_channel ' +
        `WHERE CCWH.ID_Service_Request_Customer = '${idServiceRequestCustomer}'`;

      let results = await CustomersIndustryCodesCollection.query(
        Q.unsafeSqlQuery(QUERY),
      ).unsafeFetchRaw();
      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getGridFreeProducts error :>> ', error);
      return [];
    }
  }

  /**
   * Function returns true/false based on insertion
   * @returns
   */
  async insertCustomersClaimsWorkFlowSettlementData(claimDataObj: any) {
    try {
      const collection = this.getCollection(ENTITY);

      // inserting data
      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.idServiceRequestCustomer = claimDataObj.idServiceRequestCustomer;
          rec.idCustomersClaimsWorkflowSettlementData = Number(
            claimDataObj.idCustomersClaimsWorkflowSettlementData,
          );
          rec.freeGoodNumber = claimDataObj.freeGoodNumber;
          rec.freeGoodQuantity = Number(claimDataObj.freeGoodQuantity);
          rec.freeGoodQuantitySalesUnits =
            claimDataObj.freeGoodQuantitySalesUnits;
          rec.freeGoodValue = Number(claimDataObj.freeGoodValue);
          rec.freeGoodApprover = claimDataObj.freeGoodApprover;
          rec.settlementType = claimDataObj.settlementType;
          rec.settlementDoneBy = claimDataObj.settlementDoneBy;
          rec.notes = claimDataObj.notes;
          rec.sentDatetime = null;
        });
      });

      return true;
    } catch (error) {
      console.log(
        'InsertCustomersClaimsWorkFlowSettlementData error :>> ',
        error,
      );
      return false;
    }
  }

  /**
   * Create  WorkFlow Settlement  details
   * @returns
   */
  async createWorkFlowSettlementDetails(settlementData: any) {
    try {
      const collection = this.getCollection(ENTITY);
      const qualityTeamAnswerDate = settlementData?.qualityTeamAnswerDate
        ? getServerDate(settlementData?.qualityTeamAnswerDate)
        : '';
      const customerDestructionInfoDate =
        settlementData?.customerDestructionInfoDate
          ? getServerDate(settlementData?.customerDestructionInfoDate)
          : '';
      const productPickupDate = settlementData?.productPickupDate
        ? getServerDate(settlementData?.productPickupDate)
        : '';
      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.idServiceRequestCustomer =
            settlementData.idServiceRequestCustomer;
          rec.idCustomersClaimsWorkflowSettlementData =
            settlementData.idCustomersClaimsWorkflowSettlementData;
          rec.minorDamage = settlementData.minorDamage;
          rec.freeGoodNumber = settlementData.freeGoodNumber;
          rec.freeGoodQuantity = settlementData.freeGoodQuantity;
          rec.freeGoodQuantitySalesUnits =
            settlementData.freeGoodQuantitySalesUnits;
          rec.freeGoodValue = settlementData.freeGoodValue;
          rec.freeGoodApprover = settlementData.freeGoodApprover;
          rec.claimId = settlementData.claimId;
          rec.priority = settlementData.priority;
          rec.qualityTeamAnswerDate = qualityTeamAnswerDate;
          rec.replyLetterToCustomer = settlementData.replyLetterToCustomer;
          rec.productsDestroyed = settlementData.productsDestroyed;
          rec.customerDestructionInfoDate = customerDestructionInfoDate;
          rec.productPickupNecessary = settlementData.productPickupNecessary;
          rec.productPickupDate = productPickupDate;
          rec.sentDatetime = null;
        });
      });
      return true;
    } catch (error) {
      console.log('createWorkFlowSettlementDetails error :>> ', error);
      return false;
    }
  }

  /**
   * Create  WorkFlow Settlement  details
   * @returns
   */
  async createPDByTASettlementDetails(settlementData: any) {
    try {
      const collection = this.getCollection(ENTITY);
      const taServiceTechnicianRequestDate =
        settlementData?.taServiceTechnicianRequestDate
          ? getServerDate(settlementData?.taServiceTechnicianRequestDate)
          : null;
      const taReportRequestDate = settlementData?.taReportRequestDate
        ? getServerDate(settlementData?.taReportRequestDate)
        : null;

      console.log(taServiceTechnicianRequestDate, taReportRequestDate);

      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.idServiceRequestCustomer =
            settlementData.idServiceRequestCustomer;
          rec.idCustomersClaimsWorkflowSettlementData = Number(
            settlementData.idCustomersClaimsWorkflowSettlementData,
          );

          rec.settlementDoneBy = settlementData.settlementDoneBy;
          rec.freeGoodApprover = settlementData.freeGoodApprover;
          rec.rdcNumber = settlementData.rdcNumber;
          rec.taReportRequestDate = taReportRequestDate;
          rec.taServiceTechnicianRequestDate = taServiceTechnicianRequestDate;
          rec.netValueOfProductDestroyed =
            settlementData.netValueOfProductDestroyed;
          rec.refundPercentage = settlementData.refundPercentage;
          rec.defectStatus = settlementData.defectStatus;
          rec.settlementStatus = settlementData.settlementStatus;
          rec.notes = settlementData.notes;
          rec.sentDatetime = null;
        });
      });
      return true;
    } catch (error) {
      console.log('createPDByTASettlementDetails error :>> ', error);
      return false;
    }
  }
  /**
   * Function returns PD by TA Claim settlement data
   * @returns []
   */
  async getPDClaimSettlementData(idServiceRequestCustomer: any) {
    try {
      const CustomersIndustryCodesCollection = this.getCollection(ENTITY);

      const QUERY = `select  
        settlement_done_by,  
        ta_report_request_date,  
        ta_service_technician_request_date,  
        coalesce(rdc_number,'') as rdc_number,  
        coalesce(net_value_of_product_destroyed,'') as net_value_of_product_destroyed , 
        coalesce(refund_percentage,'') as refund_percentage,  
        coalesce(defect_status,'') as defect_status,  
        coalesce(settlement_status,'') as  settlement_status,  
        coalesce(notes,'') as notes,  
        coalesce(free_good_approver,'') as free_good_approver  
        from  
        customers_claims_workflow_settlement_data ccwsd 
        where  
        ccwsd.id_service_request_customer = '${idServiceRequestCustomer}'`;

      let results = await CustomersIndustryCodesCollection.query(
        Q.unsafeSqlQuery(QUERY),
      ).unsafeFetchRaw();
      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getPDClaimSettlementData error :>> ', error);
      return [];
    }
  }
}
