import BaseApiService from './BaseApiService';
import CustomerContacts from 'src/storage/OfflineDBStorage/WmDB/models/CustomerContacts';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {CustomerContactsRepo} from 'src/repo/CustomerContactsRepo';

export class CustomerContactsService extends BaseApiService<
  CustomerContacts,
  CustomerContactsRepo
> {
  private readonly customerContactsRepo: CustomerContactsRepo =
    new CustomerContactsRepo();

  getRepo(): CustomerContactsRepo {
    return this.customerContactsRepo;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CUSTOMER_CONTACTS;
  }

  async getContactDetails(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    return await this.getRepo().getContactDetails(
      customerShipTo,
      salesOrganization,
      distributionChannel,
    );
  }

  async createOrUpdateContactDetails(contactDetails: any) {
    return await this.getRepo().createOrUpdateContactDetails(contactDetails);
  }

  async deleteContact(idCustomerContact: any) {
    return await this.getRepo().deleteContact(idCustomerContact);
  }
}
