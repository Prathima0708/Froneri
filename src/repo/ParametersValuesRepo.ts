import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import ParametersValues from 'src/storage/OfflineDBStorage/WmDB/models/ParametersValues';
import {Q} from '@nozbe/watermelondb';

const ENTITY = OFFLINE_STORAGE.MODEL.PARAMETERS_VALUES;

export class ParametersValuesRepo extends BaseRepo<ParametersValues> {
  /**
   * Function returns value of parameter
   * @returns string
   */
  async getParameterValue(parameterName: string) {
    const collection = this.getCollection(ENTITY);
    let results = await collection
      .query(Q.where('parameter_name', parameterName))
      .fetch();

    if (results.length > 0) {
      results = this.copyPropertiesFromDBObjToResultsObj(results);
      return results[0].parameterValue;
    } else {
      return '';
    }
  }
}
