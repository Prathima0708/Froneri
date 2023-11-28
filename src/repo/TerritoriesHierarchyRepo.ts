import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import TerritoriesHierarchy from 'src/storage/OfflineDBStorage/WmDB/models/TerritoriesHierarchy';
import {OFFLINE_STORAGE} from 'src/storage/Storage';

const ENTITY = OFFLINE_STORAGE.MODEL.TERRITORIES_HIERARCHY;

export class TerritoriesHierarchyRepo extends BaseRepo<TerritoriesHierarchy> {
  /**
   * Fetch Connected User all territories
   * @returns -> Array
   */
  async getConnectedUserAllTerritories(connectedUserIdTerriroty: string) {
    const collection = this.getCollection(ENTITY);

    const QUERY =
      'select id_territory as idTerritory ' +
      'from territories_hierarchy ' +
      `where id_territory_parent = '${connectedUserIdTerriroty}' `;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    if (results.length > 0) {
      return results;
    } else {
      return [];
    }
  }
  /**
   * Fetch Connected User all territories
   * @returns -> Array
   */
  async getSalesRepDetail(customerShipTo: string) {
    const collection = this.getCollection(ENTITY);

    const QUERY = `select 
     territories.id_territory as territory, 
     territories_sales_representatives.partner_number, 
     sales_representatives.first_name || ' ' || sales_representatives.last_name as salesRep, 
     sales_representatives.phone, 
     territories_customers.partner_function as pf 
     from 
     territories  
     inner join 
     territories_customers  
     on territories.id_territory = territories_customers.id_territory 
     inner join 
     territories_sales_representatives   
     on territories.id_territory = territories_sales_representatives.id_territory 
     inner join 
     sales_representatives  
     on territories_sales_representatives.partner_number = sales_representatives.partner_number 
     where  
     customer_ship_to = '${customerShipTo}'`;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    if (results.length > 0) {
      return results;
    } else {
      return [];
    }
  }
}
