import {DiscoveryContactsService} from 'src/services/DiscoveryContactsService';
import {DiscoveryControlsService} from 'src/services/DiscoveryControlsService';
import {PersonTitlesService} from 'src/services/PersonTitlesService';
import {PLP_CONTACTS_CONTROL_NAME} from 'src/utils/ControlName';
import {IContactInfo} from 'src/views/private/ProspectLanding/PLContacts/PLContacts';

class PLContactsController {
  private personTitlesService: PersonTitlesService;
  private discoveryContactService: DiscoveryContactsService;
  private discoveryControlsService: DiscoveryControlsService;

  constructor() {
    this.personTitlesService = new PersonTitlesService();
    this.discoveryContactService = new DiscoveryContactsService();
    this.discoveryControlsService = new DiscoveryControlsService();
  }

  async getContactDropdownData() {
    const dropdownData =
      await this.personTitlesService.getContactDropdownData();

    return dropdownData;
  }

  async getContactsData() {
    return await this.discoveryContactService.getContactsData();
  }

  async updateOrInsertDiscoveryContacts(
    contacts1obj: IContactInfo,
    contacts2obj: IContactInfo,
  ) {
    return await this.discoveryContactService.updateOrInsertDiscoveryContacts(
      contacts1obj,
      contacts2obj,
    );
  }

  async getMandatoryFieldsConfig() {
    const designationContact1 =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CONTACTS_CONTROL_NAME.DDL_CONTACTS1_TITLE,
      );
    const designationContact2 =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CONTACTS_CONTROL_NAME.DDL_CONTACTS2_TITLE,
      );
    const contact1FirstName =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CONTACTS_CONTROL_NAME.TXT_CONTACTS1_FIRST_NAME,
      );
    const contact2FirstName =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CONTACTS_CONTROL_NAME.TXT_CONTACTS2_FIRST_NAME,
      );
    const contact1LastName =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CONTACTS_CONTROL_NAME.TXT_CONTACTS1_LAST_NAME,
      );
    const contact2LastName =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CONTACTS_CONTROL_NAME.TXT_CONTACTS2_LAST_NAME,
      );
    const contact1PhoneNo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CONTACTS_CONTROL_NAME.TXT_CONTACTS1_PHONE_NO,
      );
    const contact2PhoneNo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CONTACTS_CONTROL_NAME.TXT_CONTACTS2_PHONE_NO,
      );
    const contact1MobileNo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CONTACTS_CONTROL_NAME.TXT_CONTACTS1_MOBILE_NO,
      );
    const contact2MobileNo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CONTACTS_CONTROL_NAME.TXT_CONTACTS2_MOBILE_NO,
      );
    const contact1FaxNo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CONTACTS_CONTROL_NAME.TXT_CONTACTS1_FAX_NO,
      );
    const contact2FaxNo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CONTACTS_CONTROL_NAME.TXT_CONTACTS2_FAX_NO,
      );
    const contact1Email =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CONTACTS_CONTROL_NAME.TXT_CONTACTS1_EMAIL,
      );
    const contact2Email =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CONTACTS_CONTROL_NAME.TXT_CONTACTS2_EMAIL,
      );
    const contact1Notes =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CONTACTS_CONTROL_NAME.TXT_CONTACTS1_NOTES,
      );
    const contact2Notes =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CONTACTS_CONTROL_NAME.TXT_CONTACTS2_NOTES,
      );

    return {
      designationContact1,
      designationContact2,
      contact1FirstName,
      contact2FirstName,
      contact1LastName,
      contact2LastName,
      contact1PhoneNo,
      contact2PhoneNo,
      contact1MobileNo,
      contact2MobileNo,
      contact1FaxNo,
      contact2FaxNo,
      contact1Email,
      contact2Email,
      contact1Notes,
      contact2Notes,
    };
  }
}
export default new PLContactsController();
