import {CustomersBillToService} from 'src/services/CustomersBillToService';
import {CustomersDifferentDeliveryAddressService} from 'src/services/CustomersDifferentDeliveryAddressService';
import {CustomersService} from 'src/services/CustomersService';
import {DiscoveryContactsService} from 'src/services/DiscoveryContactsService';
import {DiscoveryControlsService} from 'src/services/DiscoveryControlsService';
import {DiscoveryListValuesService} from 'src/services/DiscoveryListValuesService';
import {DiscoveryService} from 'src/services/DiscoveryService';
import {LangagesService} from 'src/services/LanguagesService';
import {ParametersValuesService} from 'src/services/ParametersValuesService';
import {ProspectsService} from 'src/services/ProspectsService';
import {
  PLP_BILL_TO_CONTROL_NAME,
  PLP_DELIVERY_ADDRESS_CONTROL_NAME,
  PLP_SHIP_TO_CONTROL_NAME,
} from 'src/utils/ControlName';

class PLBasicInfoController {
  private discoveryListValuesService: DiscoveryListValuesService;
  private prospectsService: ProspectsService;
  private langagesService: LangagesService;
  private discoveryService: DiscoveryService;
  private customersBillToService: CustomersBillToService;
  private customersDifferentDeliveryAddressService: CustomersDifferentDeliveryAddressService;
  private customersService: CustomersService;
  private parametersValuesService: ParametersValuesService;
  private discoveryContactsService: DiscoveryContactsService;
  private discoveryControlsService: DiscoveryControlsService;

  constructor() {
    this.discoveryListValuesService = new DiscoveryListValuesService();
    this.prospectsService = new ProspectsService();
    this.langagesService = new LangagesService();
    this.discoveryService = new DiscoveryService();
    this.customersBillToService = new CustomersBillToService();
    this.customersDifferentDeliveryAddressService =
      new CustomersDifferentDeliveryAddressService();
    this.customersService = new CustomersService();
    this.parametersValuesService = new ParametersValuesService();
    this.discoveryContactsService = new DiscoveryContactsService();
    this.discoveryControlsService = new DiscoveryControlsService();
  }

  // get country and distribution channel list
  async getDropdownListValues(controlName: string) {
    return await this.discoveryListValuesService.getDropdownListValues(
      controlName,
    );
  }

  async getShipToPrepopulatedData() {
    const prospectInfo: any = await this.prospectsService.getPLProspectInfo();
    const statusType = prospectInfo?.statusType ? prospectInfo?.statusType : '';
    if (statusType.toLowerCase() === 'p') {
      const prospectShipToData =
        await this.prospectsService.getPLPProspectShipToData();
      return prospectShipToData;
    } else {
      return await this.customersService.getPLPCustomerShipToData();
    }
  }

  async getBillToPrepopulatedData() {
    const prospectInfo: any = await this.prospectsService.getPLProspectInfo();
    const statusType = prospectInfo?.statusType ? prospectInfo?.statusType : '';
    if (statusType.toLowerCase() === 'p') {
      return await this.discoveryService.getPLPProspectBillToData();
    } else {
      return await this.customersBillToService.getPLPCustomerBillToData();
    }
  }

  async getDeliveryAddressPrepopulatedData() {
    const prospectInfo: any = await this.prospectsService.getPLProspectInfo();
    const statusType = prospectInfo?.statusType ? prospectInfo?.statusType : '';
    if (statusType.toLowerCase() === 'p') {
      const prospectShipToData =
        await this.discoveryService.getPLPProspectDeliveryAddressData();
      return prospectShipToData;
    } else {
      return await this.customersDifferentDeliveryAddressService.getPLPCustomerDeliveryAddressData();
    }
  }

  async getLanguageDropdownData() {
    return await this.langagesService.getLanguagesData();
  }

  async updateProspectShipToInfo(data: any) {
    const prospectsResponse =
      await this.prospectsService.updatePLPProspectShipToData(data);
    if (!prospectsResponse) {
      return false;
    }

    const discoveryResponse =
      await this.discoveryService.updateProspectDiscoveryInfo(data);
    if (!discoveryResponse) {
      return false;
    }

    const parameterValue = await this.parametersValuesService.getParameterValue(
      'Enable_CRM_Data_Copy_Contacts',
    );
    if (parameterValue == '1') {
      const discoveryContactsResponse =
        await this.discoveryContactsService.createOrUpdateProspectDiscoveryContactsInfo(
          data,
        );
      if (!discoveryContactsResponse) {
        return false;
      }
    }

    return true;
  }

  async updateProspectBillToDiscoveryInfo(data: any) {
    return await this.discoveryService.updateProspectBillToDiscoveryInfo(data);
  }

  async updateProspectDeliveryAddressInfo(data: any) {
    return await this.discoveryService.updateProspectDeliveryAddressInfo(data);
  }

  // get ship to mandatory field
  async getShipToMandatoryFieldsConfig() {
    const name1 = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_SHIP_TO_CONTROL_NAME.TXT_NAME1,
    );
    const name2 = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_SHIP_TO_CONTROL_NAME.TXT_NAME2,
    );
    const name3 = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_SHIP_TO_CONTROL_NAME.TXT_NAME3,
    );
    const name4 = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_SHIP_TO_CONTROL_NAME.TXT_NAME4,
    );
    const email = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_SHIP_TO_CONTROL_NAME.TXT_EMAIL,
    );
    const phoneNumber =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_SHIP_TO_CONTROL_NAME.TXT_PHONE_NO,
      );
    const mobileNumber =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_SHIP_TO_CONTROL_NAME.TXT_MOBILE_NO,
      );
    const fax = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_SHIP_TO_CONTROL_NAME.TXT_FAX,
    );
    const houseNumber =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_SHIP_TO_CONTROL_NAME.TXT_HOUSE_NO,
      );
    const address1 =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_SHIP_TO_CONTROL_NAME.TXT_ADDRESS1,
      );
    const address2 =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_SHIP_TO_CONTROL_NAME.TXT_ADDRESS2,
      );
    const address3 =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_SHIP_TO_CONTROL_NAME.TXT_ADDRESS3,
      );
    const zipCode =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_SHIP_TO_CONTROL_NAME.TXT_ZIP_CODE,
      );
    const poBox = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_SHIP_TO_CONTROL_NAME.TXT_PO_BOX,
    );
    const city = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_SHIP_TO_CONTROL_NAME.TXT_CITY,
    );
    const country =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_SHIP_TO_CONTROL_NAME.DDL_COUNTRY,
      );
    const outlet = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_SHIP_TO_CONTROL_NAME.DDL_OUTLET,
    );
    const distributionChannel =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_SHIP_TO_CONTROL_NAME.DDL_DISTRIBUTION_CHANNEL,
      );
    const customerHierarchy =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_SHIP_TO_CONTROL_NAME.DDL_CUSTOMER_HIERARCHY,
      );
    const website =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_SHIP_TO_CONTROL_NAME.TXT_WEBSITE,
      );
    const shopNumber =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_SHIP_TO_CONTROL_NAME.TXT_SHOP_NO,
      );
    const language =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_SHIP_TO_CONTROL_NAME.DDL_LANGUAGE,
      );
    const previousCustomerShipTo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_SHIP_TO_CONTROL_NAME.TXT_PREVIOUS_CUSTOMER_SHIP_TO,
      );

    return {
      name1: name1,
      name2: name2,
      name3: name3,
      name4: name4,
      email: email,
      phoneNumber: phoneNumber,
      mobileNumber: mobileNumber,
      fax: fax,
      houseNumber: houseNumber,
      address1: address1,
      address2: address2,
      address3: address3,
      zipCode: zipCode,
      poBox: poBox,
      city: city,
      country: country,
      coOrStreet3: 0,
      latitude: 0,
      longitude: 0,
      outlet: outlet,
      salesArea: 0,
      distributionChannel: distributionChannel,
      customerHierarchy: customerHierarchy,
      website: website,
      shopNumber: shopNumber,
      language: language,
      previousCustomerShipTo: previousCustomerShipTo,
    };
  }

  // get bill to mandatory field
  async getBillToMandatoryFieldsConfig() {
    const name1 = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_BILL_TO_CONTROL_NAME.TXT_NAME1,
    );
    const name2 = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_BILL_TO_CONTROL_NAME.TXT_NAME2,
    );
    const name3 = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_BILL_TO_CONTROL_NAME.TXT_NAME3,
    );
    const name4 = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_BILL_TO_CONTROL_NAME.TXT_NAME4,
    );
    const email = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_BILL_TO_CONTROL_NAME.TXT_EMAIL,
    );
    const phoneNumber =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_BILL_TO_CONTROL_NAME.TXT_PHONE_NO,
      );
    const mobileNumber =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_BILL_TO_CONTROL_NAME.TXT_MOBILE_NO,
      );
    const fax = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_BILL_TO_CONTROL_NAME.TXT_FAX,
    );
    const houseNumber =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_BILL_TO_CONTROL_NAME.TXT_HOUSE_NO,
      );
    const address1 =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_BILL_TO_CONTROL_NAME.TXT_ADDRESS1,
      );
    const address2 =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_BILL_TO_CONTROL_NAME.TXT_ADDRESS2,
      );
    const address3 =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_BILL_TO_CONTROL_NAME.TXT_ADDRESS3,
      );
    const zipCode =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_BILL_TO_CONTROL_NAME.TXT_ZIP_CODE,
      );
    const poBox = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_BILL_TO_CONTROL_NAME.TXT_PO_BOX,
    );
    const postalCodePOBox =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_BILL_TO_CONTROL_NAME.TXT_POSTAL_CODE_PO_BOX,
      );
    const cityPOBox =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_BILL_TO_CONTROL_NAME.TXT_CITY_PO_BOX,
      );
    const city = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_BILL_TO_CONTROL_NAME.TXT_CITY,
    );
    const country =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_BILL_TO_CONTROL_NAME.DDL_COUNTRY,
      );

    return {
      name1: name1,
      name2: name2,
      name3: name3,
      name4: name4,
      email: email,
      phoneNumber: phoneNumber,
      mobileNumber: mobileNumber,
      fax: fax,
      houseNumber: houseNumber,
      address1: address1,
      address2: address2,
      address3: address3,
      zipCode: zipCode,
      poBox: poBox,
      postalCodePOBox: postalCodePOBox,
      cityPOBox: cityPOBox,
      city: city,
      country: country,
    };
  }

  // get delivery address mandatory field
  async getDeliveryAddressMandatoryFieldsConfig() {
    const name1 = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_DELIVERY_ADDRESS_CONTROL_NAME.TXT_NAME1,
    );
    const name2 = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_DELIVERY_ADDRESS_CONTROL_NAME.TXT_NAME2,
    );
    const name3 = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_DELIVERY_ADDRESS_CONTROL_NAME.TXT_NAME3,
    );
    const name4 = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_DELIVERY_ADDRESS_CONTROL_NAME.TXT_NAME4,
    );
    const email = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_DELIVERY_ADDRESS_CONTROL_NAME.TXT_EMAIL,
    );
    const phoneNumber =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_DELIVERY_ADDRESS_CONTROL_NAME.TXT_PHONE_NO,
      );
    const mobileNumber =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_DELIVERY_ADDRESS_CONTROL_NAME.TXT_MOBILE_NO,
      );
    const fax = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_DELIVERY_ADDRESS_CONTROL_NAME.TXT_FAX,
    );
    const houseNumber =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_DELIVERY_ADDRESS_CONTROL_NAME.TXT_HOUSE_NO,
      );
    const address1 =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_DELIVERY_ADDRESS_CONTROL_NAME.TXT_ADDRESS1,
      );
    const address2 =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_DELIVERY_ADDRESS_CONTROL_NAME.TXT_ADDRESS2,
      );
    const address3 =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_DELIVERY_ADDRESS_CONTROL_NAME.TXT_ADDRESS3,
      );
    const zipCode =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_DELIVERY_ADDRESS_CONTROL_NAME.TXT_ZIP_CODE,
      );
    const poBox = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_DELIVERY_ADDRESS_CONTROL_NAME.TXT_PO_BOX,
    );
    const postalCodePOBox =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_DELIVERY_ADDRESS_CONTROL_NAME.TXT_POSTAL_CODE_PO_BOX,
      );
    const cityPOBox =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_DELIVERY_ADDRESS_CONTROL_NAME.TXT_CITY_PO_BOX,
      );
    const city = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_DELIVERY_ADDRESS_CONTROL_NAME.TXT_CITY,
    );
    const country =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_DELIVERY_ADDRESS_CONTROL_NAME.DDL_COUNTRY,
      );

    return {
      name1: name1,
      name2: name2,
      name3: name3,
      name4: name4,
      email: email,
      phoneNumber: phoneNumber,
      mobileNumber: mobileNumber,
      fax: fax,
      houseNumber: houseNumber,
      address1: address1,
      address2: address2,
      address3: address3,
      zipCode: zipCode,
      poBox: poBox,
      postalCodePOBox: postalCodePOBox,
      cityPOBox: cityPOBox,
      city: city,
      country: country,
    };
  }
}
export default new PLBasicInfoController();
