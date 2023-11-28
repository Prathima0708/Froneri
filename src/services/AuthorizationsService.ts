import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import Authorizations from 'src/storage/OfflineDBStorage/WmDB/models/Authorizations';
import {AuthorizationsRepo} from 'src/repo/AuthorizationsRepo';

export class AuthorizationsService extends BaseApiService<
  Authorizations,
  AuthorizationsRepo
> {
  private readonly AuthorizationsRepository: AuthorizationsRepo =
    new AuthorizationsRepo();

  getRepo(): AuthorizationsRepo {
    return this.AuthorizationsRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.AUTHORIZATIONS;
  }

  async getDeleteAccess() {
    return await this.getRepo().getDeleteAccess();
  }
}
