import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import TextsReports from 'src/storage/OfflineDBStorage/WmDB/models/TextsReports';
import {OFFLINE_STORAGE} from 'src/storage/Storage';

const ENTITY = OFFLINE_STORAGE.MODEL.TEXTS_REPORTS;

export class TextsReportsRepo extends BaseRepo<TextsReports> {
  /**
   * Function returns value of texts Report table
   * @returns string
   */
  async getTextsReportsValue(labelName: string) {
    const collection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    // const employeeLanguage = employeeInfo[0].language
    //   ? employeeInfo[0].language
    //   : 'ENG';
    const employeeLanguage = 'ENG';

    let QUERY = 'select * from texts_reports where label = ? and language = ? ';

    const VALUES = [labelName, employeeLanguage];

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY, VALUES))
      .unsafeFetchRaw();

    if (results.length > 0) {
      return results[0].text;
    } else {
      return '';
    }
  }
}
