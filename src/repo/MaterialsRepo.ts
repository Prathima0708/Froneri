import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import Materials from 'src/storage/OfflineDBStorage/WmDB/models/Materials';

const ENTITY = OFFLINE_STORAGE.MODEL.MATERIALS;

export class MaterialsRepo extends BaseRepo<Materials> {
  /**
   * Function returns TA listing data for the particular prospect
   * @returns
   */
  async getTADescription(searchText: string, materialNumber: string) {
    try {
      const collection = this.getCollection(ENTITY);

      let QUERY =
        'select distinct materials.description_language_1 as [description], ' +
        'cast(materials.material_number as number) as materialNumber, ' +
        '(cast(coalesce(trade_assets_minimum_turnover.minimum_turnover, ' +
        '0) as varchar)) as minimumTurnover, price, brand from materials ' +
        'left join trade_assets_minimum_turnover on materials.material_number ' +
        "= trade_assets_minimum_turnover.material_number where materials.material_type = 'ZGNV'" +
        `and description like '%${searchText}%' `;

      if (materialNumber.trim().length > 0) {
        QUERY += `and (materials.material_number = '${materialNumber}' or cast(materials.material_number as INT) = '${materialNumber}') `;
      }

      QUERY += ' limit 10';

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getTADescription error :>> ', error);
      return [];
    }
  }
  /**
   * Function returns sales unit dropdown data
   * @returns
   */
  async getSalesUnitTypeDropdownData() {
    try {
      const collection = this.getCollection(ENTITY);

      let QUERY = `select  
      unit_of_measure as unitOfMeasure ,description_language_1 as unitOfMeasureDesc  
      from  units_of_measures`;

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getSalesUnitTypeDropdownData error :>> ', error);
      return [];
    }
  }

  /**
   * Function returns material number dropdown data
   * @returns
   */
  async getMaterailNumberDropdownData(
    customerPickingPlantNumber: string,
    customerSalesOrganization: string,
    customerDistributionChannel: string,
    value: string,
  ) {
    try {
      const CustomersIndustryCodesCollection = this.getCollection(ENTITY);

      let BASE_QUERY = `select abs(materials.material_number) as materialNumber,   
    cast(materials.material_number AS INT) || ' - ' || Description_Language_1 as description,   
    materials.material_hierarchy_from_sap_node_l2, 
    materials.material_hierarchy_node_l2, 
    materials.main_sales_unit as salesUnit  
    from  materials   
    left join  materials_not_available   
    on  materials.material_number = materials_not_available.material_number   
    and  ( materials_not_available.plant_number = '${customerPickingPlantNumber}' or  materials_not_available.plant_number = 'all' )   
    where  active_in_tess = '1' and ( materials_not_available.hide_material <> '1' or  materials_not_available.hide_material is null )  
    and  sales_organization = '${customerSalesOrganization}' and  distribution_channel = '${customerDistributionChannel}'
    `;
      if (value.length > 0) {
        BASE_QUERY =
          BASE_QUERY +
          `and (materialNumber like '%${value}%'  OR Description_Language_1 like '%${value}%') `;
      }
      BASE_QUERY = BASE_QUERY + 'order by Description_Language_1  LIMIT 10';
      let results = await CustomersIndustryCodesCollection.query(
        Q.unsafeSqlQuery(BASE_QUERY),
      ).unsafeFetchRaw();
      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getMaterailNumberDropdownData error :>> ', error);
      return [];
    }
  }

  /**
   * Function returns Claims Type dropdown data
   * @returns
   */
  async getClaimsTypeDropdownData() {
    try {
      const collection = this.getCollection(ENTITY);
      let QUERY = `select claim_code,description_language_1 as description  
      from claims_configurations 
      where claims_config_code ='1'`;
      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getClaimsTypeDropdownData error :>> ', error);
      return [];
    }
  }
  /**
   * Function returns Product Condition dropdown data
   * @returns
   */
  async getProductConditionDropdownData() {
    try {
      const collection = this.getCollection(ENTITY);

      let QUERY = `select claim_code,description_language_1 as description  
      from claims_configurations 
      where claims_config_code ='2'`;

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getProductConditionDropdownData error :>> ', error);
      return [];
    }
  }
  /**
   * Function returns Product Condition dropdown data
   * @returns
   */
  async getPriorityDropdownData() {
    try {
      const collection = this.getCollection(ENTITY);

      let QUERY = `select claim_code,description_language_1 as description  
      from claims_configurations 
      where claims_config_code ='3'`;

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getPriorityDropdownData error :>> ', error);
      return [];
    }
  }
}
