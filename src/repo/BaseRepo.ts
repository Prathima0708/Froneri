import {Model, Q} from '@nozbe/watermelondb';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {store} from 'src/store';
import {Q_EQ} from 'src/utils/DbConst';

export abstract class BaseRepo<T extends Model> {
  constructor() {}

  async getLoggedInEmployeeInfo() {
    const state = store.getState();
    return state.userContext.employee;
  }

  async getLoggedInSalesRepInfo() {
    const state = store.getState();
    return state.userContext.salesRep;
  }

  async getLoggedInDelegatedEmployeeInfo() {
    const state = store.getState();
    return state.userContext.delegatedEmployee;
  }

  async getLoggedInEmployeeTerritoryInfo() {
    const state = store.getState();
    return state.userContext.employeeTerritory;
  }

  async getDelegatedEmployeeIdTerritoryInfo() {
    const state = store.getState();
    return state.userContext.delegatedEmployeeIdTerritory;
  }

  async getEmployeeAndDelegatedTerritoryStr() {
    const state = store.getState();
    return state.userContext.employeeDelegatedTerritoryStr;
  }

  async getSelectedLanguageInfo() {
    const state = store.getState();
    return state.userContext.selectedLanguage;
  }

  async getCLCustomerInfo() {
    const state = store.getState();
    return state.customerLanding.customerInfo;
  }

  async getPLProspectInfo() {
    const state = store.getState();
    return state.prospectLanding.prospectInfo;
  }

  /**
   * Function to get collection
   * @param {string} collectionName
   * @returns collection
   */
  getCollection(collectionName: string) {
    if (collectionName) {
    } else {
      return undefined;
    }
    const collection = OFFLINE_STORAGE.getDB().collections.get(collectionName);
    if (collection) {
      return collection;
    } else {
      return undefined;
    }
  }

  /**
   * Function to save the data into DB
   * @param {string} collectionName
   * @param {T} entity
   * @returns -> entity
   */
  async save(collectionName: string, entity: T) {
    const collection = this.getCollection(collectionName);
    if (entity) {
    } else {
      return undefined;
    }

    if (Array.isArray(entity) && entity.length > 0) {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await OFFLINE_STORAGE.getDB().batch(
          ...entity.map((obj: any) =>
            collection.prepareCreate((rec: any) => {
              rec = Object.assign(rec, obj); // critical to copy this way
            }),
          ),
        );
      });

      return;
    } else if (typeof entity === 'object') {
      // create
      await OFFLINE_STORAGE.getDB().write(async () => {
        entity = await collection.create((rec: any) => {
          rec = Object.assign(rec, entity); // critical to copy this way
        });
      });
      let entityObj = this.completeAssign(entity);
      return entityObj;
    } else {
      return undefined;
    }
  }

  /**
   * Function to update the data into DB
   * @param {string} collectionName
   * @param {T} entity
   * @returns -> entity
   */
  async update(collectionName: string, entity: T) {
    const collection = this.getCollection(collectionName);
    let obj: any = undefined;
    if (entity) {
    } else {
      return obj;
    }

    if (entity.id) {
      obj = await collection.find(entity.id);
    } else {
      return undefined;
    }

    if (obj) {
      console.log(`Update ${collectionName} `);
      // update
      await OFFLINE_STORAGE.getDB().action(async () => {
        await obj.update((rec: any) => {
          let keys = Object.keys(entity);
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            rec[key] = entity[key];
          }
        });
      });
    }

    obj = this.completeAssign(obj);
    return obj;
  }

  /**
   * Function to drop the table into DB
   * @param {string} collectionName
   * @returns -> entity
   */
  async drop(collectionName: string) {
    console.log(`delete : ${collectionName} `);

    const collection = this.getCollection(collectionName);
    await OFFLINE_STORAGE.getDB().action(async () => {
      await collection.query().destroyAllPermanently();
    });
    console.log(`delete : ${collectionName} End`);
    return;
  }

  async delete(collectionName: string, id: string) {
    const collection = this.getCollection(collectionName);

    if (id) {
    } else {
      return undefined;
    }
    // deleteById
    const recordToDelete = collection.find(id);
    await recordToDelete.destroyPermanently();

    return;
  }

  /**
   * Function to get all the data from db
   * @param {string} collectionName
   * @returns {Array} results
   */
  async findAll(
    collectionName: string,
    query: any = [],
    start?: number,
    limit?: number,
  ) {
    console.log(`findAllRecordsFromDB : ${collectionName}`);
    const collection = this.getCollection(collectionName);
    if (collection) {
      let results = [];
      if (query.length > 0 && start && limit) {
        results = await collection
          .query(...query, Q.skip(start), Q.take(limit))
          .fetch();
      } else if (query.length > 0 && !start && !limit) {
        results = await collection.query(...query).fetch();
      } else if (start && limit) {
        results = await collection.query(Q.skip(start), Q.take(limit)).fetch();
      } else {
        results = await collection.query().fetch();
      }

      if (results) {
        console.log(`findAllFromDB : ${collectionName} found.`);
        results = this.copyPropertiesFromDBObjToResultsObj(results);

        return results;
      } else {
        console.log(`findAllFromDB : ${collectionName} not found.`);
        return [];
      }
    } else {
      return [];
    }
  }

  /**
   * Function to get all the data from db
   * @param {string} schemaName
   * @returns {Array} results
   */
  async findById(collectionName: string, id: string) {
    console.log(`CollectionsService : findByIdFromDB : ${collectionName}`);
    const collection = this.getCollection(collectionName);
    if (collection) {
      let entity = await collection.find(id);
      if (entity) {
        console.log(
          `CollectionsService : findByIdFromDB : ${collectionName} found.`,
        );
        entity = this.completeAssign(entity);
        return entity;
      } else {
        console.log(
          `CollectionsService : findByIdFromDB : ${collectionName} not found.`,
        );
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  /**
   * @param {Array} dbObjList
   */
  copyPropertiesFromDBObjToResultsObj(dbObjList: []) {
    let results: any = [];
    if (dbObjList && dbObjList.length > 0) {
    } else {
      return results;
    }
    for (let i = 0; i < dbObjList.length; i++) {
      let result = this.completeAssign(dbObjList[i]);
      if (result) {
        results.push(result);
      }
    }
    return results;
  }

  /**
   * selectively copies only the required Model defined fields + id field
   * @param  {*} source
   */
  completeAssign(source: any) {
    let specialFields = [
      'syncStatus',
      'database',
      'db',
      'asModel',
      'table',
      'collection',
    ];
    let target = {};

    let src = source._raw;

    //
    let src2 = Object.getPrototypeOf(source);
    let objCopy = Object.keys(src2).reduce((objCopy, key) => {
      if (key.startsWith('_') || specialFields.includes(key)) {
        //skip
      } else {
        objCopy[key] = source[key];
      }
      return objCopy;
    }, {});

    //

    // By default, Object.assign copies enumerable Symbols, too
    Object.getOwnPropertySymbols(src).forEach(sym => {
      let descriptor = Object.getOwnPropertyDescriptor(src, sym);
      if (descriptor.enumerable) {
        descriptors[sym] = descriptor;
      }
    });

    target = Object.assign({}, objCopy);

    return target;
  }

  // Helpers
  prepareWhereCriteriaList(searchCriteriaList: string | any[]) {
    let criteriaList = [];
    if (searchCriteriaList && Array.isArray(searchCriteriaList)) {
      for (const element of searchCriteriaList) {
        let criteria = element;
        if (criteria.key && criteria.condition) {
          criteriaList.push(
            Q.where(criteria.key, criteria.condition(criteria.value)),
          );
        }
      }
      return criteriaList;
    }
    return [];
  }

  prepareSearchCriteria(key: any, value: any, condition = Q_EQ) {
    if (key) {
      return {key, condition, value};
    } else return {};
  }
}
export default BaseRepo;
