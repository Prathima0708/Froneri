import BaseRepo from './BaseRepo';
import CustomersAbcClassifications from 'src/storage/OfflineDBStorage/WmDB/models/CustomersAbcClassifications';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';

const ENTITY = OFFLINE_STORAGE.MODEL.CUSTOMERS_ABC_CLASSIFICATIONS;

export class CustomersAbcClassificationsRepo extends BaseRepo<CustomersAbcClassifications> {
  /**
   * Function returns Customers ABC Classification
   * @returns
   */
  async getCustomersAbcClassification() {
    const CustomersABcClassificationsRepoCollection =
      this.getCollection(ENTITY);

    let results = await CustomersABcClassificationsRepoCollection.query(
      Q.unsafeSqlQuery(
        'SELECT Customers_ABC_Classifications.ABC_Classification as abcClassification, ' +
          'Description_Language_1 as descriptionLanguage ' +
          'FROM Customers_ABC_Classifications',
      ),
    ).unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }
}
