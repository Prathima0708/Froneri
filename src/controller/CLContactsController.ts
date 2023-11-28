import {CustomerContactsService} from 'src/services/CustomerContactsService';
import {PersonTitlesService} from 'src/services/PersonTitlesService';

class CLContactsController {
  private personTitlesService: PersonTitlesService;
  private customerContactsService: CustomerContactsService;

  constructor() {
    this.personTitlesService = new PersonTitlesService();
    this.customerContactsService = new CustomerContactsService();
  }

  async getDropdownData() {
    const dropdownData = await this.personTitlesService.getDropdownData();

    return dropdownData;
  }

  async createOrUpdateContactDetails(contactDetails: any) {
    const success =
      await this.customerContactsService.createOrUpdateContactDetails(
        contactDetails,
      );

    return success;
  }

  async deleteContact(idCustomerContact: any) {
    const success = await this.customerContactsService.deleteContact(
      idCustomerContact,
    );

    return success;
  }
}
export default new CLContactsController();
