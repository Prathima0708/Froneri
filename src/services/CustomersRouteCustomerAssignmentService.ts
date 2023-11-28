import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import CustomersRouteCustomerAssignment from 'src/storage/OfflineDBStorage/WmDB/models/CustomersRouteCustomerAssignment';
import {CustomersRouteCustomerAssignmentRepo} from 'src/repo/CustomersRouteCustomerAssignmentRepo';

export class CustomersRouteCustomerAssignmentService extends BaseApiService<
  CustomersRouteCustomerAssignment,
  CustomersRouteCustomerAssignmentRepo
> {
  private readonly CRCARepository: CustomersRouteCustomerAssignmentRepo =
    new CustomersRouteCustomerAssignmentRepo();

  getRepo(): CustomersRouteCustomerAssignmentRepo {
    return this.CRCARepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CUSTOMERS_ROUTE_CUSTOMER_ASSIGNMENT;
  }

  async getCustomerCRCAInfo() {
    return await this.getRepo().getCustomerCRCAInfo();
  }

  async getCustomerCRCAInfoWithCallPlace() {
    return await this.getRepo().getCustomerCRCAInfoWithCallPlace();
  }

  async getCallsAndDeliveriesInformation(prevCustomerShipTo: string) {
    return await this.getRepo().getCallsAndDeliveriesInformation(
      prevCustomerShipTo,
    );
  }

  async getAlternativeDeliveryInformation(prevCustomerShipTo: string) {
    return await this.getRepo().getAlternativeDeliveryInformation(
      prevCustomerShipTo,
    );
  }

  async getOpeningAndVisitingHours() {
    return await this.getRepo().getOpeningAndVisitingHours();
  }
}
