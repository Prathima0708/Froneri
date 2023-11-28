import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import CustomerChannels from 'src/storage/OfflineDBStorage/WmDB/models/CustomerChannels';
import {OFFLINE_STORAGE} from 'src/storage/Storage';

const ENTITY = OFFLINE_STORAGE.MODEL.CUSTOMER_CHANNELS;

export class CustomerChannelsRepo extends BaseRepo<CustomerChannels> {
  /**
   * Function returns customer channel description
   * @returns []
   */
  async getCustomerChannelDescription(idCustomerChannel: string) {
    const collection = this.getCollection(ENTITY);
    const id = Number(idCustomerChannel);

    let QUERY =
      'select customer_channels.description_language_1 as descriptionLanguage ' +
      'from customer_channels ' +
      `where customer_channels.id_customer_channel = ${id}`;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }
}
