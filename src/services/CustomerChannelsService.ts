import BaseApiService from './BaseApiService';
import CustomerChannels from 'src/storage/OfflineDBStorage/WmDB/models/CustomerChannels';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {CustomerChannelsRepo} from 'src/repo/CustomerChannelsRepo';

export class CustomerChannelsService extends BaseApiService<
  CustomerChannels,
  CustomerChannelsRepo
> {
  private readonly CustomerChannelsRepo: CustomerChannelsRepo =
    new CustomerChannelsRepo();

  getRepo(): CustomerChannelsRepo {
    return this.CustomerChannelsRepo;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CUSTOMER_CONTACTS;
  }

  async getCustomerChannelDescription(idCustomerChannel: string) {
    return await this.getRepo().getCustomerChannelDescription(
      idCustomerChannel,
    );
  }
}
