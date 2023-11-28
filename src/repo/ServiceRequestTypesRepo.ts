import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import ServiceRequestTypes from 'src/storage/OfflineDBStorage/WmDB/models/ServiceRequestTypes';

const ENTITY = OFFLINE_STORAGE.MODEL.SERVICE_REQUEST_TYPES;

export class ServiceRequestTypesRepo extends BaseRepo<ServiceRequestTypes> {
  /**
   * Function returns service request types dropdown data
   * @returns
   */
  async getServiceRequestTypeDropdownData(
    searchText: string,
    idServiceRequestType: string,
  ) {
    try {
      const collection = this.getCollection(ENTITY);

      let conditionQuery = " where inactive = '0' ";

      if (idServiceRequestType) {
        conditionQuery = ` where (inactive = '0' and id_service_request_type = '${idServiceRequestType}') `;
      }

      let QUERY =
        'select id_service_request_type as idServiceRequestType, ' +
        "case when (description_language_1 is null or description_language_1 = '') " +
        "then '' else description_language_1 end as description, is_claim_type as isClaimType from " +
        'service_request_types ' +
        conditionQuery;

      if (searchText && searchText.trim() !== '') {
        QUERY += ` and description like '%${searchText}%' `;
      }

      QUERY += ' order by description_language_1 limit 10 ';

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getServiceRequestTypeDropdownData error :>> ', error);
      return [];
    }
  }

  /**
   * Function returns no. of days for requested date
   * @returns
   */
  async getNumberOfDaysOfRequestedDate(idServiceRequestType: number) {
    try {
      const collection = this.getCollection(ENTITY);

      const QUERY =
        'select number_of_days as numberOfDays from service_request_types where id_service_request_type = ?';

      const QUERY_VALUES = [idServiceRequestType];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getNumberOfDaysOfRequestedDate error :>> ', error);
      return [];
    }
  }

  /**
   * Function returns description based on service request type id
   * @returns
   */
  async getServiceRequestTypeDescription(idServiceRequestType: number) {
    try {
      const collection = this.getCollection(ENTITY);

      const QUERY =
        "select coalesce(pretext, '') as description from service_request_types where id_service_request_type = ?";

      const QUERY_VALUES = [idServiceRequestType];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getServiceRequestTypeDescription error :>> ', error);
      return [];
    }
  }

  /**
   * Function returns data of claim type based on service request type id
   * @returns
   */
  async checkServiceWorkflowClaimType(idServiceRequestType: number) {
    try {
      const collection = this.getCollection(ENTITY);

      const QUERY =
        "select * from service_request_types where id_service_request_type = ?  and is_claim_type = '1'";

      const QUERY_VALUES = [idServiceRequestType];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('checkServiceWorkflowClaimType error :>> ', error);
      return false;
    }
  }

  /**
   * Function returns data of claim layout based on service request type id
   * @returns
   */
  async getClaimsLayoutDropdownData(idServiceRequestType: number) {
    try {
      const collection = this.getCollection(ENTITY);

      const QUERY =
        'select claims_screen_layout as claimsScreenLayout,' +
        "case when claims_screen_layout = 1 then 'Product Claims' " +
        "when claims_screen_layout = 2 then 'Delivery Mistakes Claims' " +
        "when claims_screen_layout = 3 then 'Product Destroyed By TA Claims' " +
        "end as description from service_request_types where is_claim_type = '1' " +
        'and id_service_request_type = ?';

      const QUERY_VALUES = [idServiceRequestType];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getClaimsLayoutDropdownData error :>> ', error);
      return [];
    }
  }
}
