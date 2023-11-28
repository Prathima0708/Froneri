import BaseApiService from './BaseApiService';
import ENV from '../env/env.config';
import {IS_FORM_DIRTY, LOCAL_STORAGE} from 'src/storage/Storage';

const IS_ROUTE_GUARD = ENV.IS_ROUTE_GUARD;

class ACLService {
  // return the route guard status
  isRouteGuardApplicable() {
    return IS_ROUTE_GUARD;
  }

  // saves form dirty status
  async saveAclGuardStatusToStorage(value: boolean) {
    try {
      LOCAL_STORAGE.saveData(IS_FORM_DIRTY, value);
    } catch (err) {}
  }

  // get form dirty status
  async isFormDirty() {
    let isDirty = await LOCAL_STORAGE.getData(IS_FORM_DIRTY);

    if (isDirty != null && isDirty) {
      return true;
    } else {
      return false;
    }
  }
}

export default new ACLService();
