import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import ParametersValues from 'src/storage/OfflineDBStorage/WmDB/models/ParametersValues';
import {ParametersValuesRepo} from 'src/repo/ParametersValuesRepo';

export class ParametersValuesService extends BaseApiService<
  ParametersValues,
  ParametersValuesRepo
> {
  private readonly parametersValuesRepository: ParametersValuesRepo =
    new ParametersValuesRepo();

  getRepo(): ParametersValuesRepo {
    return this.parametersValuesRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.PARAMETERS_VALUES;
  }

  async getParameterValue(parameterName: string) {
    return await this.getRepo().getParameterValue(parameterName);
  }
}
