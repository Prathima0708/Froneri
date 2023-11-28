import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import CustomersClaimsWorkflowHeader from 'src/storage/OfflineDBStorage/WmDB/models/CustomersClaimsWorkflowHeader';

const ENTITY = OFFLINE_STORAGE.MODEL.CUSTOMERS_CLAIMS_WORKFLOW_HEADER;

export class CustomersClaimsWorkflowHeaderRepo extends BaseRepo<CustomersClaimsWorkflowHeader> {
  /**
   * Function returns true/false based on deletion
   * @returns
   */
  async deleteWorkflowHeaderData(idServiceRequestCustomer: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const workflowHeaderData = await collection
        .query(Q.where('id_service_request_customer', idServiceRequestCustomer))
        .fetch();

      console.log('workflowHeaderData length :>> ', workflowHeaderData.length);

      if (workflowHeaderData.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          for (const workflowHeaderDataItem of workflowHeaderData) {
            await workflowHeaderDataItem.destroyPermanently();
          }
        });
        return true;
      }

      return true;
    } catch (error) {
      console.log('deleteWorkflowHeaderData error :>> ', error);
      return false;
    }
  }

  /**
   * Function returns Product Claim Data
   * @returns []
   */
  async getProductClaimCustomerData(idServiceRequestCustomer: string) {
    try {
      const collection = this.getCollection(ENTITY);
      const QUERY = `select * from  customers_claims_workflow_header   
      inner join  
      customers_claims_workflow_claims_data   
      on customers_claims_workflow_header.id_service_request_customer = customers_claims_workflow_claims_data.id_service_request_customer  
      inner join  
      customers_claims_workflow_settlement_data   
      on customers_claims_workflow_header.id_service_request_customer = customers_claims_workflow_settlement_data.id_service_request_customer  
      where  
      customers_claims_workflow_header.id_service_request_customer = '${idServiceRequestCustomer}'`;
      let results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();
      return results;
    } catch (error) {
      console.log(
        'error while fetching getProductClaimCustomerData data :>>',
        error,
      );
    }
  }

  /**
   * Create / Update WorkFlowHeader details
   * @returns
   */
  async createWorkFlowHeaderDetails(
    idServiceRequestCustomer: string,
    customerShipTo: string,
    salesOrganisation: string,
    distributionChannel: string,
  ) {
    const collection = this.getCollection(ENTITY);
    await OFFLINE_STORAGE.getDB().write(async () => {
      await collection.create((rec: any) => {
        rec.idServiceRequestCustomer = idServiceRequestCustomer;
        rec.customerShipTo = customerShipTo;
        rec.salesOrganization = salesOrganisation;
        rec.distributionChannel = distributionChannel;

        rec.sentDatetime = null;
      });
    });
    return true;
  }

  /**
   * Function returns populate controls in delivery mistake claims form
   * @returns
   */
  async getDeliveryMistakeClaimsDataPopulation(
    serviceRequestCustomerId: string,
  ) {
    try {
      const CustomersIndustryCodesCollection = this.getCollection(ENTITY);
      const QUERY =
        'SELECT ' +
        "coalesce(SAP_Document_Number,'') AS orderNumber, " +
        "coalesce(Complete_Delivery,'') AS completeDelivery, " +
        "coalesce(Reason_For_Claim,'') AS reasonForClaim, " +
        "coalesce(Free_Good_Approver,'') AS freeGoodApprover, " +
        "coalesce(Settlement_Type,'') AS settlementType, " +
        "coalesce(Settlement_Done_By,'') AS settlementDoneBy, " +
        "coalesce(Notes,'') AS notes " +
        'FROM Customers_Claims_WorkFlow_Header CCWH ' +
        'LEFT JOIN ' +
        'Customers_Claims_WorkFlow_Claims_Data CCWCD ' +
        'ON CCWH.ID_Service_Request_Customer = CCWCD.ID_Service_Request_Customer ' +
        'LEFT JOIN ' +
        'Customers_Claims_WorkFlow_Settlement_Data CCWSD ' +
        'ON CCWH.ID_Service_Request_Customer = CCWSD.ID_Service_Request_Customer ' +
        `where CCWH.id_service_request_customer = '${serviceRequestCustomerId}'`;

      let results = await CustomersIndustryCodesCollection.query(
        Q.unsafeSqlQuery(QUERY),
      ).unsafeFetchRaw();
      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getDeliveryMistakeClaimsDataPopulation error :>> ', error);
      return [];
    }
  }

  /**
   * Function for insert data in customer claims workflow header
   * @returns
   */
  async insertCustomersClaimsWorkFlowHeader(
    idServiceRequestCustomer: string,
    customerShipTo: any,
    salesOrganization: any,
    distributionChannel: any,
    sapDocumentNumber: any,
    completeDelivery: any,
  ) {
    try {
      const collection = this.getCollection(ENTITY);

      //inserting data
      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.idServiceRequestCustomer = idServiceRequestCustomer;
          rec.customerShipTo = customerShipTo;
          rec.salesOrganization = salesOrganization;
          rec.distributionChannel = distributionChannel;
          rec.sapDocumentNumber = sapDocumentNumber;
          rec.completeDelivery = completeDelivery;
          rec.sentDatetime = null;
        });
      });

      return true;
    } catch (error) {
      console.log('InsertCustomersClaimsWorkFlowHeader error :>> ', error);
      return false;
    }
  }
}
