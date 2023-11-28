import BaseApiService from './BaseApiService';

import CustomerHierarchiesShipTo from 'src/storage/OfflineDBStorage/WmDB/models/CustomerHierarchiesShipTo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {CustomerHierarchiesShipToRepo} from 'src/repo/CustomerHierarchiesShipToRepo';

export class CustomerHierarchiesShipToService extends BaseApiService<
  CustomerHierarchiesShipTo,
  CustomerHierarchiesShipToRepo
> {
  private readonly CustomerHierarchiesShipToRepository: CustomerHierarchiesShipToRepo =
    new CustomerHierarchiesShipToRepo();

  getRepo(): CustomerHierarchiesShipToRepo {
    return this.CustomerHierarchiesShipToRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CUSTOMER_HIERARCHIES_SHIP_TO;
  }

  async getCustomerHierarchiesShipTo(value: string) {
    return await this.getRepo().getCustomerHierarchiesShipTo(value);
  }

  async getCustomerHierarchiesForSelectedCustomers() {
    return await this.getRepo().getCustomerHierarchiesForSelectedCustomers();
  }

  async getCustomerHierarchies(
    salesOrganization: string,
    distributionChannel: string,
    searchText?: string,
  ) {
    return await this.getRepo().getCustomerHierarchies(
      salesOrganization,
      distributionChannel,
      searchText,
    );
  }
}
