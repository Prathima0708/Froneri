import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import CustomerVacations from 'src/storage/OfflineDBStorage/WmDB/models/CustomerVacations';
import {CustomerVacationsRepo} from 'src/repo/CustomerVacationsRepo';

export class CustomerVacationsService extends BaseApiService<
  CustomerVacations,
  CustomerVacationsRepo
> {
  private readonly customerVacationsRepository: CustomerVacationsRepo =
    new CustomerVacationsRepo();

  getRepo(): CustomerVacationsRepo {
    return this.customerVacationsRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CUSTOMER_VACATIONS;
  }

  async checkUnavailableCustomers(customersShipTo: string[], date: string) {
    return await this.getRepo().checkUnavailableCustomers(
      customersShipTo,
      date,
    );
  }

  async checkIsCustomerOnVacation(customersShipTo: string) {
    return await this.getRepo().checkIsCustomerOnVacation(customersShipTo);
  }

  async getCustomersAllVacations() {
    return await this.getRepo().getCustomersAllVacations();
  }

  async getCustomersPastVacations() {
    return await this.getRepo().getCustomersPastVacations();
  }

  async createOrUpdateCustomerVacation(obj: any) {
    return await this.getRepo().createOrUpdateCustomerVacation(obj);
  }

  async deleteCustomerVacation(idCustomerVacations: string) {
    return await this.getRepo().deleteCustomerVacation(idCustomerVacations);
  }
}

export default new CustomerVacationsService();
