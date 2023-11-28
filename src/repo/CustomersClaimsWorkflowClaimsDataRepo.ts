import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import CustomersClaimsWorkflowClaimsData from 'src/storage/OfflineDBStorage/WmDB/models/CustomersClaimsWorkflowClaimsData';
import {getServerDate} from 'src/utils/CommonUtil';
import LanguagesService from 'src/services/LanguagesService';
import {CLAIMS_MATERIAL_TYPES} from 'src/utils/DbConst';

const ENTITY = OFFLINE_STORAGE.MODEL.CUSTOMERS_CLAIMS_WORKFLOW_CLAIMS_DATA;
const TEMP_ICE_ENTITY = OFFLINE_STORAGE.MODEL.TEMP_ICE;
export class CustomersClaimsWorkflowClaimsDataRepo extends BaseRepo<CustomersClaimsWorkflowClaimsData> {
  /**
   * Function returns true/false based on deletion
   * @returns
   */
  async deleteWorkflowClaimsData(idServiceRequestCustomer: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const workflowClaimsData = await collection
        .query(Q.where('id_service_request_customer', idServiceRequestCustomer))
        .fetch();

      console.log('workflowClaimsData length :>> ', workflowClaimsData.length);

      if (workflowClaimsData.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          for (const workflowClaimsDataItem of workflowClaimsData) {
            await workflowClaimsDataItem.destroyPermanently();
          }
        });
        return true;
      }

      return true;
    } catch (error) {
      console.log('deleteWorkflowClaimsData error :>> ', error);
      return false;
    }
  }
  /**
   * get /    getOfflineIcedProducts

   * @returns
   */
  async getOfflineIcedProducts(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
    idServiceRequestCustomer: string,
  ) {
    try {
      const CustomersIndustryCodesCollection = this.getCollection(ENTITY);

      let BASE_QUERY = `select
        abs(ccwcd.material_number) as materialNumber,
        description_language1 as materialDescription,
        0 as quantityDeliveredInLast52Weeks,
        ccwcd.quantity_of_claimed_products as quantity,
        ccwcd.quantity_of_claimed_products_sales_units as salesUnit,
        convert(varchar, ccwcd.net_amount) as 'price' 
    from
        customers_claims_workflow_claims_data ccwcd 
        inner join customers_claims_workflow_header ccwh  on ccwcd.id_service_request_customer = ccwh.id_service_request_customer
        inner join materials  on materials.material_number = ccwcd.material_number
        and ccwh.sales_organization = materials.sales_organization
        and ccwh.distribution_channel = materials.distribution_channel
    where
        ccwh.id_service_request_customer = '${idServiceRequestCustomer}'
        and ccwcd.claim_settlement_product_type = claims_material_types.ice_products
    select
        distinct abs(materials.material_number) as materialNumber,
        isnull(materials.description_language1, '') as materialDescription,
        cast(
            isnull(customers_materials.last_n_deliveries, 0) as REAL
        ) as quantityDeliveredInLast52Weeks,
        isnull(temp.quantity, '') as quantity,
        isnull(temp.sales_unit, customers_materials.sales_unit) as salesUnit,
        isnull(temp.price, '') as 'price'
    from
        customers_materials 
        inner join materials  on customers_materials.material_number = materials.material_number
        and customers_materials.sales_organization = materials.sales_organization
        and customers_materials.distribution_channel = materials.distribution_channel
        inner join layout_groups 
        inner join layout_groups_material_hierarchies  on layout_groups.id_layout_group = layout_groups_material_hierarchies.id_layout_group on materials.material_hierarchy_node_l5 = layout_groups_material_hierarchies.material_hierarchy_node
        or materials.material_hierarchy_node_l4 = layout_groups_material_hierarchies.material_hierarchy_node
        or materials.material_hierarchy_node_l3 = layout_groups_material_hierarchies.material_hierarchy_node
        or materials.material_hierarchy_node_l2 = layout_groups_material_hierarchies.material_hierarchy_node
        or materials.material_hierarchy_node_l1 = layout_groups_material_hierarchies.material_hierarchy_node
        inner join layout_groups_materials  on layout_groups.id_layout_group = layout_groups_materials.id_layout_group
        and materials.material_number = layout_groups_materials.material_number
        left join #tempice temp 
        on temp.material_number = abs(materials.material_number)
    where
        customers_materials.customer_ship_to = '${customerShipTo}'
        and customers_materials.sales_organization = '${salesOrganization}'
        and customers_materials.distribution_channel = '${distributionChannel}'
        and layout_groups.claim_products_destroy_ta_relevant = '1'`;

      let results = await CustomersIndustryCodesCollection.query(
        Q.unsafeSqlQuery(BASE_QUERY),
      ).unsafeFetchRaw();
      if (results) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getOfflineIcedProducts error :>> ', error);
      return false;
    }
  }

  /**
   * Function returns populate the grid.
   * @returns
   */
  async getGridUndeliveredProducts(idServiceRequestCustomer: any) {
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
        'CAST(CCWCD.material_number as DECIMAL(10,2)) AS materialNumber, ' +
        `description_language_${languageIndex} As materialDescription, ` +
        "'' AS productGroup, " +
        'CCWCD.Quantity_Of_Claimed_Products AS quantity, ' +
        'CCWCD.Quantity_Of_Claimed_Products_Sales_Units AS salesUnit, ' +
        'CAST(coalesce(CCWCD.Net_Amount,0) AS DECIMAL(10,2)) AS price ' +
        'FROM Customers_Claims_WorkFlow_Claims_Data CCWCD ' +
        'INNER JOIN ' +
        'Customers_Claims_WorkFlow_Header CCWH ' +
        'ON CCWCD.ID_Service_Request_Customer = CCWH.ID_Service_Request_Customer ' +
        'INNER JOIN Materials ' +
        'ON Materials.Material_Number=CCWCD.Material_Number ' +
        'AND CCWH.Sales_organization=Materials.Sales_organization ' +
        'AND CCWH.Distribution_channel=Materials.Distribution_channel ' +
        `WHERE CCWH.ID_Service_Request_Customer = '${idServiceRequestCustomer}' ` +
        `AND CCWCD.Claim_Settlement_Product_Type = '${CLAIMS_MATERIAL_TYPES.UNDELIVERED_PRODUCTS}'`;
      let results = await CustomersIndustryCodesCollection.query(
        Q.unsafeSqlQuery(QUERY),
      ).unsafeFetchRaw();
      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getGridUndeliveredProducts error :>> ', error);
      return [];
    }
  }

  /**
   * Function returns populate the grid: Instead delivered products
   * @returns
   */
  async getGridInsteadDeliveredProducts(idServiceRequestCustomer: any) {
    try {
      const CustomersIndustryCodesCollection = this.getCollection(ENTITY);
      const QUERY =
        'SELECT  ' +
        'CAST(CCWCD.material_number as DECIMAL(10,2)) AS materialNumber, ' +
        'description_language_1 As materialDescription, ' +
        "'' AS productGroup, " +
        'CCWCD.Quantity_Of_Claimed_Products as quantity, ' +
        'CCWCD.Quantity_Of_Claimed_Products_Sales_Units as salesUnit, ' +
        'CAST(coalesce(CCWCD.Net_Amount,0) AS DECIMAL(10,2)) AS price ' +
        'FROM Customers_Claims_WorkFlow_Claims_Data CCWCD ' +
        'INNER JOIN Customers_Claims_WorkFlow_Header CCWH ' +
        'ON CCWCD.ID_Service_Request_Customer = CCWH.ID_Service_Request_Customer ' +
        'INNER JOIN Materials ' +
        'ON Materials.Material_Number=CCWCD.Material_Number ' +
        'AND CCWH.Sales_organization=Materials.Sales_organization ' +
        'AND CCWH.Distribution_channel=Materials.Distribution_channel ' +
        `WHERE CCWH.ID_Service_Request_Customer = '${idServiceRequestCustomer}' ` +
        `AND CCWCD.Claim_Settlement_Product_Type = '${CLAIMS_MATERIAL_TYPES.INSTEAD_DELIVERED_PRODUCTS}'`;

      let results = await CustomersIndustryCodesCollection.query(
        Q.unsafeSqlQuery(QUERY),
      ).unsafeFetchRaw();
      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getGridInsteadDeliveredProducts error :>> ', error);
      return [];
    }
  }

  /**
   * Function returns true/false based on insertion
   * @returns
   */
  async insertCustomersClaimsWorkFlowClaimsData(claimDataObj: any) {
    try {
      const collection = this.getCollection(ENTITY);

      //inserting data
      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.idServiceRequestCustomer = claimDataObj.idServiceRequestCustomer;
          rec.idCustomersClaimsWorkflowClaimsData =
            claimDataObj.idCustomersClaimsWorkflowClaimsData;
          rec.materialNumber = claimDataObj.materialNumber;
          rec.quantityOfClaimedProducts =
            claimDataObj.quantityOfClaimedProducts;
          rec.quantityOfClaimedProductsSalesUnits =
            claimDataObj.quantityOfClaimedProductsSalesUnits;
          rec.reasonForClaim = claimDataObj.reasonForClaim;
          rec.claimSettlementProductType =
            claimDataObj.claimSettlementProductType;
          rec.netAmount = claimDataObj.netAmount;
          rec.sentDatetime = null;
        });
      });

      return true;
    } catch (error) {
      console.log('InsertCustomersClaimsWorkFlowClaimsData error :>> ', error);
      return false;
    }
  }

  /**
   * Create / Update WorkFlowHeader details
   * @returns
   */
  async createWorkFlowClaimsDetails(claimDataObject: any) {
    const collection = this.getCollection(ENTITY);

    const bestBeforDate = claimDataObject?.bestBeforeDate
      ? getServerDate(claimDataObject?.bestBeforeDate)
      : '';
    await OFFLINE_STORAGE.getDB().write(async () => {
      await collection.create((rec: any) => {
        rec.idServiceRequestCustomer = claimDataObject.idServiceRequestCustomer;
        rec.idCustomersClaimsWorkflowClaimsData =
          claimDataObject.idCustomersClaimsWorkflowClaimsData;
        rec.materialNumber = claimDataObject.materialNumber;
        rec.batchCodeOrDeliveryDate = claimDataObject.batchCodeOrDeliveryDate;
        rec.bestBeforeDate = bestBeforDate;
        rec.bestBeforeDateTime = claimDataObject.bestBeforeDateTime;
        rec.quantityOfClaimedProducts =
          claimDataObject.quantityOfClaimedProducts;
        rec.quantityOfClaimedProductsSalesUnits =
          claimDataObject.quantityOfClaimedProductsSalesUnits;
        rec.reasonForClaim = claimDataObject.reasonForClaim;
        rec.conditionOfProduct = claimDataObject.conditionOfProduct;
        rec.descriptionClaimReason = claimDataObject.descriptionClaimReason;
        rec.claimedProductsAvailable = claimDataObject.claimedProductsAvailable;
        rec.foreignProductAvailable = claimDataObject.foreignProductAvailable;
        rec.feedbackRequestedFromCustomer =
          claimDataObject.feedbackRequestedFromCustomer;
        rec.sentDatetime = null;
      });
    });
    return true;
  }

  /**
   * Create / Update WorkFlowHeader details
   * @returns
   */
  async createWorkFlowClaimsDetailsPDByTA(claimDataObject: any) {
    const collection = this.getCollection(ENTITY);
    try {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.idServiceRequestCustomer =
            claimDataObject?.idServiceRequestCustomer;
          rec.idCustomersClaimsWorkflowClaimsData = Number(
            claimDataObject?.idCustomersClaimsWorkflowClaimsData,
          );
          rec.materialNumber = claimDataObject?.materialNumber;
          rec.quantityOfClaimedProducts =
            claimDataObject?.quantityOfClaimedProducts;
          rec.quantityOfClaimedProductsSalesUnits =
            claimDataObject?.quantityOfClaimedProductsSalesUnits;
          rec.claimSettlementProductType =
            claimDataObject?.claimSettlementProductType;
          rec.equipmentNumber = claimDataObject?.equipmentNumber;
          rec.netAmount = Number(claimDataObject?.netAmount);
          rec.sentDatetime = null;
        });
      });
      console.log(claimDataObject, 'Inside');
      return true;
    } catch (er) {
      console.log('createWorkFlowClaimsDetailsPDByTA error :->', er);
      return false;
    }
  }
  /**
   * Create / Update WorkFlowHeader details
   * @returns
   */
  async createWorkFlowClaimsDetailsBlockedProducts(claimDataObject: any) {
    const collection = this.getCollection(ENTITY);
    try {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.idServiceRequestCustomer =
            claimDataObject?.idServiceRequestCustomer;
          rec.idCustomersClaimsWorkflowClaimsData = Number(
            claimDataObject?.idCustomersClaimsWorkflowClaimsData,
          );
          rec.materialNumber = claimDataObject?.materialNumber;
          rec.quantityOfClaimedProducts =
            claimDataObject?.quantityOfClaimedProducts;
          rec.quantityOfClaimedProductsSalesUnits =
            claimDataObject?.quantityOfClaimedProductsSalesUnits;
          rec.claimSettlementProductType =
            claimDataObject?.claimSettlementProductType;
          rec.netAmount = Number(claimDataObject?.netAmount);
          rec.sentDatetime = null;
        });
      });
      console.log(claimDataObject, 'Inside');
      return true;
    } catch (er) {
      console.log('createWorkFlowClaimsDetailsPDByTA error :->', er);
      return false;
    }
  }
  /**
   * Function returns populate the grid: other / blocked  products
   * @returns
   */
  async getGridBlockedroducts(idServiceRequestCustomer: any) {
    try {
      const CustomersIndustryCodesCollection = this.getCollection(ENTITY);
      const QUERY =
        "SELECT '' AS search, " +
        'ABS(CCWCD.Material_Number) AS materialNumber, ' +
        'description_language_1 As materialDescription, ' +
        "'' AS productGroup, " +
        'CCWCD.Quantity_Of_Claimed_Products as quantity, ' +
        'CCWCD.Quantity_Of_Claimed_Products_Sales_Units as salesUnit, ' +
        'CAST(coalesce(CCWCD.Net_Amount,0) AS DECIMAL(10,2)) AS price ' +
        'FROM Customers_Claims_WorkFlow_Claims_Data CCWCD ' +
        'INNER JOIN Customers_Claims_WorkFlow_Header CCWH ' +
        'ON CCWCD.ID_Service_Request_Customer = CCWH.ID_Service_Request_Customer ' +
        'INNER JOIN Materials ' +
        'ON Materials.Material_Number=CCWCD.Material_Number ' +
        'AND CCWH.Sales_organization=Materials.Sales_organization ' +
        'AND CCWH.Distribution_channel=Materials.Distribution_channel ' +
        `WHERE CCWH.ID_Service_Request_Customer = '${idServiceRequestCustomer}'` +
        `AND CCWCD.Claim_Settlement_Product_Type = '${CLAIMS_MATERIAL_TYPES.BLOCKED_PRODUCTS}'`;

      let results = await CustomersIndustryCodesCollection.query(
        Q.unsafeSqlQuery(QUERY),
      ).unsafeFetchRaw();
      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getGridBlockedroducts error :>> ', error);
      return [];
    }
  }
  /**
   * Function adds temporary data in temp_hierarchy table
   * @returns []
   */
  async insertTemporaryDataInIce(rows: any) {
    try {
      const database = OFFLINE_STORAGE.getDB();

      const tempTable = this.getCollection(TEMP_ICE_ENTITY);
      console.log(tempTable, 'TempTable');

      await database.write(async () => {
        for (const row of rows) {
          await tempTable.create((record: any) => {
            record.materialNumber = row.materialNumber;
            record.materialDescription = row.materialDescription;
            record.quantityDeliveredInLast52Weeks =
              row.quantityDeliveredInLast52Weeks;
            record.quantity = row.quantity;
            record.salesUnit = row.salesUnit;
            record.price = row.price;
          });
        }
      });
    } catch (er) {
      console.log('error while insertTemporaryDataInIce data :>>', er);
    }
  }

  /**
   * Function removes temporary data from temp_ice table
   * @returns []
   */
  async removeTemporaryDataInIce() {
    try {
      const database = OFFLINE_STORAGE.getDB();

      const tempTable = this.getCollection(TEMP_ICE_ENTITY);

      await database.write(async () => {
        const allRecords = await tempTable.query().fetch();
        console.log('allRecords length', allRecords.length);

        if (allRecords.length > 0) {
          for (const record of allRecords) {
            await record.destroyPermanently();
          }
          console.log('All records deleted from temp_ice table');
        }
      });
    } catch (error) {
      console.log('Error while deleting temp data from temp_ice table', error);
    }
  }
  /**
   * Function returns ICED products
   * @returns []
   */
  async fetchIcedProducts(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
    idServiceRequestCustomer: string,
  ) {
    try {
      const collection = this.getCollection(ENTITY);

      const rows = await collection
        .query(
          Q.unsafeSqlQuery(
            `select
          CAST(ccwcd.material_number as DECIMAL(10,2)) AS materialNumber,
          description_language_1 as materialDescription,
          0 as quantityDeliveredInLast52Weeks,
          ccwcd.quantity_of_claimed_products as quantity,
          ccwcd.quantity_of_claimed_products_sales_units as salesUnit,
          cast(ccwcd.net_amount as REAL) as 'price'
          from
          customers_claims_workflow_claims_data ccwcd 
          inner join customers_claims_workflow_header ccwh  on ccwcd.id_service_request_customer = ccwh.id_service_request_customer
          inner join materials  on materials.material_number = ccwcd.material_number
          and ccwh.sales_organization = materials.sales_organization
          and ccwh.distribution_channel = materials.distribution_channel
          where
          ccwh.id_service_request_customer = '${idServiceRequestCustomer}'
          and ccwcd.claim_settlement_product_type = '${CLAIMS_MATERIAL_TYPES.ICE_PRODUCTS}'
          `,
          ),
        )
        .unsafeFetchRaw();

      await this.insertTemporaryDataInIce(rows);

      const shipTo = '' + `${customerShipTo}`;
      const sales = '' + `${salesOrganization}`;
      const distribution = '' + `${distributionChannel}`;
      console.log(
        'ROWS',
        typeof shipTo,
        typeof sales,
        typeof distribution,
        shipTo,
        sales,
        distribution,
        'harry',
      );
      const QUERY =
        `
    select
        distinct (materials.material_number) as materialNumber,
        coalesce(materials.description_language_1, '') as materialDescription,
        cast(
            coalesce(customers_materials.last_n_deliveries, 0) as REAL
        ) as quantityDeliveredInLast52Weeks,
        temp_ice.quantity as quantity,
        temp_ice.sales_unit, customers_materials.sales_unit as salesUnit,
        (temp_ice.price) as 'price'
        from
        customers_materials
        inner join materials
            on customers_materials.material_number = materials.material_number
            and customers_materials.sales_organization = materials.sales_organization
            and customers_materials.distribution_channel = materials.distribution_channel
        inner join layout_groups
            inner join layout_groups_material_hierarchies
               on layout_groups.id_layout_group =abs( layout_groups_material_hierarchies.id_layout_group)
                and (materials.material_hierarchy_node_l5 = layout_groups_material_hierarchies.material_hierarchy_node
                    or materials.material_hierarchy_node_l4 = layout_groups_material_hierarchies.material_hierarchy_node
                    or materials.material_hierarchy_node_l3 = layout_groups_material_hierarchies.material_hierarchy_node
                    or materials.material_hierarchy_node_l2 = layout_groups_material_hierarchies.material_hierarchy_node
                    or materials.material_hierarchy_node_l1 = layout_groups_material_hierarchies.material_hierarchy_node)
        inner join layout_groups_materials
          on layout_groups.id_layout_group = abs(layout_groups_materials.id_layout_group)
        and materials.material_number = layout_groups_materials.material_number
        left join temp_ice 
        on temp_ice.material_number = materials.material_number
   where` +
        ` customers_materials.customer_ship_to = '${shipTo}'` +
        `        and customers_materials.sales_organization = '${sales}'
      and customers_materials.distribution_channel = '${distribution}'
      and layout_groups.claim_products_destroy_ta_relevant = '1'`;

      let results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      // await this.removeTemporaryDataInIce();

      return results;
    } catch (error) {
      console.log('error while fetching material hierarchy data :>>', error);
    }
  }
}
