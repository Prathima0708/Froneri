import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import Texts from 'src/storage/OfflineDBStorage/WmDB/models/Texts';
import {OFFLINE_STORAGE} from 'src/storage/Storage';

const ENTITY = OFFLINE_STORAGE.MODEL.TEXTS;

export class TextsRepo extends BaseRepo<Texts> {
  /**
   * Function returns value of text table
   * @returns string
   */
  async getTextsValue(controlName: string, additionalQuery?: any) {
    const collection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeLanguage = employeeInfo[0].language
      ? employeeInfo[0].language
      : 'ENG';

    let QUERY = 'select * from texts where control = ? and language = ? ';
    additionalQuery ? QUERY + additionalQuery : QUERY;

    const VALUES = [controlName, employeeLanguage];

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY, VALUES))
      .unsafeFetchRaw();

    if (results.length > 0) {
      return results[0].text;
    } else {
      return '';
    }
  }

  /**
   * Function returns value of text table
   * @returns string
   */
  async getTextsData(lang: string) {
    const collection = this.getCollection(ENTITY);

    let QUERY =
      'select * from texts where language = ? and android_control_name != "" ';

    const VALUES = [lang];

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY, VALUES))
      .unsafeFetchRaw();

    if (results.length > 0) {
      return results;
    } else {
      return [];
    }
  }
}
