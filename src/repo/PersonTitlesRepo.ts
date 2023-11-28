import BaseRepo from './BaseRepo';
import PersonTitles from 'src/storage/OfflineDBStorage/WmDB/models/PersonTitles';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';

const ENTITY = OFFLINE_STORAGE.MODEL.PERSON_TITLES;

export class PersonTitlesRepo extends BaseRepo<PersonTitles> {
  /**
   * Function returns dropdown list data
   * @returns []
   */
  async getDropdownData() {
    const collection = this.getCollection(ENTITY);
    let results = await collection
      .query(
        Q.unsafeSqlQuery(
          "select '' as personTitle, " +
            "'' as description union " +
            'select person_titles.person_title as personTitle, ' +
            'person_titles.description_language_1 ' +
            'as description from person_titles',
        ),
      )
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns dropdown list data
   * @returns []
   */
  async getContactDropdownData() {
    const collection = this.getCollection(ENTITY);
    let results = await collection
      .query(
        Q.unsafeSqlQuery(
          'SELECT ' +
            'person_title AS personTitle, ' +
            'description_language_1 AS description ' +
            'FROM person_titles',
        ),
      )
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }
}
