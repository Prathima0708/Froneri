import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import DiscoveryListValues from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryListValues';
import {
  PLP_FINANCIAL_INFO_CONTROL_NAME,
  DROPDOWN_CONTROL_NAME,
} from 'src/utils/ControlName';

const ENTITY = OFFLINE_STORAGE.MODEL.DISCOVERY_LIST_VALUES;

export class DiscoveryListValuesRepo extends BaseRepo<DiscoveryListValues> {
  /**
   * Function returns country dropdown values
   */
  async getCountries() {
    const collection = this.getCollection(ENTITY);
    const controlName = DROPDOWN_CONTROL_NAME.COUNTRY_SHIP_TO;

    const QUERY =
      'select discovery_list_values_id as discoveryListValuesId, discovery_list_values.description_language_1 ' +
      'as description, item_value as itemValue, sequence from discovery_list_values inner join ' +
      'discovery_controls on discovery_list_values.control_id = ' +
      `discovery_controls.discovery_control_id where control_name = '${controlName}' ` +
      'order by sequence';

    const results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    if (results.length > 0) {
      return results;
    } else {
      return [];
    }
  }

  async getDropdownListValues(controlName: string) {
    const collection = this.getCollection(ENTITY);

    const QUERY =
      'select case when (dlv.description_language_1 is null or dlv.description_language_1 = "")  ' +
      'then " " else dlv.description_language_1 end as description, ' +
      'dlv.discovery_list_values_id as discoveryListValuesId,  ' +
      'dlv.item_value as itemValue, dlv.sequence,  "" as deleted,  ' +
      `'${controlName}'  as controlName  ` +
      'from discovery_controls dc ' +
      'inner join discovery_list_values dlv ' +
      'on dc.discovery_control_id = dlv.control_id ' +
      `where control_name = '${controlName}'  ` +
      'order by sequence';

    const results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    if (results.length > 0) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns dropdown values for given control name
   */
  async getDiscoveryListByControlName(controlName: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const QUERY =
        'select discovery_list_values_id as discoveryListValuesId, ' +
        'discovery_list_values.description_language_1 as description ' +
        'from discovery_list_values inner join discovery_controls on ' +
        'discovery_list_values.control_id = discovery_controls.discovery_control_id ' +
        `where control_name = '${controlName}' order by sequence`;

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getDesignList error :>> ', error);
      return [];
    }
  }

  /**
   * get final country code
   */
  async getCountryCode(country: string) {
    const collection = this.getCollection(ENTITY);
    const QUERY =
      'select item_value ' +
      'from discovery_list_values ' +
      'inner join discovery_controls ' +
      'on discovery_list_values.control_id = discovery_controls.discovery_control_id ' +
      `where discovery_list_values_id ='${country}'`;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }
}
