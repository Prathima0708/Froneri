import {Model} from '@nozbe/watermelondb';
import axios from 'axios';
import ENV from 'src/env/env.config';
import BaseRepo from 'src/repo/BaseRepo';
import {KEY_AUTH_USER_INFO, SECURE_STORAGE} from 'src/storage/Storage';
import {store} from 'src/store';
import {authenticationDataConfig} from 'src/utils/data';

const prod = true;

const DEFAULT_API_PATH = ENV.BASE_API_URL;
export abstract class BaseApiService<T extends Model, V extends BaseRepo<T>> {
  constructor() {}

  async getDefaultApiUrl() {
    let market = await this.getCurrentUserMarket();
    console.log('market', market);
    let BASE_API_URL = DEFAULT_API_PATH + market + '/api/V1/';
    console.log('BASE_API_URL', BASE_API_URL);
    return BASE_API_URL;
  }

  getAxios() {
    return axios;
  }

  getDummyData() {
    let res = {
      status: 200,
      data: {
        message: 'Dummy Data',
      },
    };
    return res;
  }

  isApiEnvDev() {
    return !prod;
  }

  // Get userinfo from keystore/keychain
  async getUserInfo() {
    return await SECURE_STORAGE.getData(KEY_AUTH_USER_INFO)
      .then(res => {
        if (res) {
          return res;
        } else {
          let userInfo = {
            isDummyToken: true,
          };
          return userInfo;
        }
      })
      .catch(() => {
        let userInfo = {
          isDummyToken: true,
        };
        return userInfo;
      });
  }

  // get users market based on selected user for sync data
  async getCurrentUserMarket() {
    const state = await store.getState();
    const userName = state.userContext.user;
    let market = '';
    if (
      userName === authenticationDataConfig[0].label ||
      userName === authenticationDataConfig[1].label ||
      userName === authenticationDataConfig[4].label
    ) {
      market = 'DEAT';
    } else if (userName === authenticationDataConfig[2].label) {
      market = 'FI';
    } else {
      market = 'CH';
    }

    return market;
  }

  abstract getRepo(): V;

  abstract getCollectionName(): string;

  async save(entity: T) {
    entity = await this.getRepo().save(this.getCollectionName(), entity);

    console.log('create: successful');

    return entity;
  }

  async update(entity: T) {
    entity = await this.getRepo().update(this.getCollectionName(), entity);

    console.log('update: successful');

    return entity;
  }

  async findAll(query: [], start: number, limit: number) {
    let finalQuery = this.getRepo().prepareWhereCriteriaList(query);
    let entity = await this.getRepo().findAll(
      this.getCollectionName(),
      finalQuery,
      start,
      limit,
    );
    return entity;
  }

  async findById(id: string) {
    let entity = await this.getRepo().findById(this.getCollectionName(), id);

    console.log('Find by id');

    return entity;
  }

  async drop() {
    return await this.getRepo().drop(this.getCollectionName());
  }

  async delete(id: string) {
    return await this.getRepo().delete(this.getCollectionName(), id);
  }

  async getLoggedInEmployeeInfo() {
    return this.getRepo().getLoggedInEmployeeInfo();
  }

  async getLoggedInSalesRepInfo() {
    return this.getRepo().getLoggedInSalesRepInfo();
  }

  async getDelegatedEmployeeObj() {
    return this.getRepo().getLoggedInDelegatedEmployeeInfo();
  }

  async getCLCustomerInfo() {
    return this.getRepo().getCLCustomerInfo();
  }

  async getPLProspectInfo() {
    return this.getRepo().getPLProspectInfo();
  }

  async getLoggedInEmployeeTerritoryInfo() {
    return this.getRepo().getLoggedInEmployeeTerritoryInfo();
  }
}

export default BaseApiService;
