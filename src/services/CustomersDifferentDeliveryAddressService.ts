import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import CustomersDifferentDeliveryAddress from 'src/storage/OfflineDBStorage/WmDB/models/CustomersDifferentDeliveryAddress';
import {CustomersDifferentDeliveryAddressRepo} from 'src/repo/CustomersDifferentDeliveryAddressRepo';

export class CustomersDifferentDeliveryAddressService extends BaseApiService<
  CustomersDifferentDeliveryAddress,
  CustomersDifferentDeliveryAddressRepo
> {
  private readonly CustomersDifferentDeliveryAddressRepository: CustomersDifferentDeliveryAddressRepo =
    new CustomersDifferentDeliveryAddressRepo();

  getRepo(): CustomersDifferentDeliveryAddressRepo {
    return this.CustomersDifferentDeliveryAddressRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CUSTOMERS_DIFFERENT_DELIVERY_ADDRESS;
  }

  async getPLPCustomerDeliveryAddressData() {
    return await this.getRepo().getPLPCustomerDeliveryAddressData();
  }
}
