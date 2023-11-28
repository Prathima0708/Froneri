import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import TerritoriesSalesRepresentatives from 'src/storage/OfflineDBStorage/WmDB/models/TerritoriesSalesRepresentatives';
import {OFFLINE_STORAGE} from 'src/storage/Storage';

const ENTITY = OFFLINE_STORAGE.MODEL.TERRITORIES_SALES_REPRESENTATIVES;

export class TerritoriesSalesRepresentativesRepo extends BaseRepo<TerritoriesSalesRepresentatives> {
  /**
   * Function to get Employee Territory for loggedIn user to update in redux store
   * @param {employeeNo} string
   * @returns -> Employee Territory Obj
   */
  async findLoggedInEmployeeTerritoryInfo(employeeNo: string) {
    const empTerritoryCollection = this.getCollection(ENTITY);

    let results = await empTerritoryCollection
      .query(
        Q.unsafeSqlQuery(
          'select id_territory as idTerritory from ' +
            'territories_sales_representatives as tsr ' +
            'inner join sales_representatives as sr ' +
            'on sr.partner_number = tsr.partner_number ' +
            'where sr.employee_number = ?',
          [employeeNo],
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
