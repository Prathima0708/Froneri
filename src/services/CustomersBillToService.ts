import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import CustomersBillTo from 'src/storage/OfflineDBStorage/WmDB/models/CustomersBillTo';
import {CustomersBillToRepo} from 'src/repo/CustomersBillToRepo';

export class CustomersBillToService extends BaseApiService<
  CustomersBillTo,
  CustomersBillToRepo
> {
  private readonly CustomersBillToRepository: CustomersBillToRepo =
    new CustomersBillToRepo();

  getRepo(): CustomersBillToRepo {
    return this.CustomersBillToRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CUSTOMERS_BILL_TO;
  }

  async getCustomersBillToInfo() {
    return await this.getRepo().getCustomersBillToInfo();
  }

  async getPLPCustomerBillToData() {
    return await this.getRepo().getPLPCustomerBillToData();
  }
}
