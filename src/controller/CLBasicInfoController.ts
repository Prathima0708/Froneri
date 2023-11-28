import {CustomerChannelsService} from 'src/services/CustomerChannelsService';
import {CustomerHierarchiesShipToService} from 'src/services/CustomerHierarchiesShipToService';
import {CustomersBillToService} from 'src/services/CustomersBillToService';
import {CustomersIndustryCodesService} from 'src/services/CustomersIndustryCodesService';
import {CustomersPayerService} from 'src/services/CustomersPayerService';
import {CustomersPaymentTermsService} from 'src/services/CustomersPaymentTermsService';
import {CustomersService} from 'src/services/CustomersService';
import {CustomersSoldToService} from 'src/services/CustomersSoldToService';
import {EmployeesService} from 'src/services/EmployeesService';
import {InternalMessagesService} from 'src/services/InternalMessagesService';
import {ParametersValuesService} from 'src/services/ParametersValuesService';
import {getDecodedData} from 'src/utils/CommonUtil';
import {PRICE_GROUP_TYPE} from 'src/utils/DbConst';

class CLBasicInfoController {
  private customersBillToService: CustomersBillToService;
  private customersSoldToService: CustomersSoldToService;
  private customersPayerService: CustomersPayerService;
  private customerHierarchiesShipToService: CustomerHierarchiesShipToService;
  private customersService: CustomersService;
  private customerIndustryCodesService: CustomersIndustryCodesService;
  private customerChannelsService: CustomerChannelsService;
  private customersPaymentTermsService: CustomersPaymentTermsService;
  private parametersValuesService: ParametersValuesService;
  private internalMessagesService: InternalMessagesService;
  private employeesService: EmployeesService;

  constructor() {
    this.customersBillToService = new CustomersBillToService();
    this.customersSoldToService = new CustomersSoldToService();
    this.customersPayerService = new CustomersPayerService();
    this.customerHierarchiesShipToService =
      new CustomerHierarchiesShipToService();
    this.customersService = new CustomersService();
    this.customerIndustryCodesService = new CustomersIndustryCodesService();
    this.customerChannelsService = new CustomerChannelsService();
    this.customersPaymentTermsService = new CustomersPaymentTermsService();
    this.parametersValuesService = new ParametersValuesService();
    this.internalMessagesService = new InternalMessagesService();
    this.employeesService = new EmployeesService();
  }

  async getPartnerDetails() {
    const partnerDetails = {
      customersShipToInfo: {},
      customersBillToInfo: {},
      customersSoldToInfo: {},
      customersPayerInfo: {},
    };
    const customersShipToInfo =
      await this.customersService.getCustomerInfoFromRedux();
    const customersBillToInfo =
      await this.customersBillToService.getCustomersBillToInfo();
    const customersSoldToInfo =
      await this.customersSoldToService.getCustomersSoldToInfo();
    const customersPayerInfo =
      await this.customersPayerService.getCustomersPayerInfo();

    // create customerShipTo Obj -> get info from redux
    let customerShipObj: any = {};

    const salesOrganization = customersShipToInfo.salesOrganization
      ? customersShipToInfo.salesOrganization
      : '';
    const distributionChannel = customersShipToInfo.distributionChannel
      ? customersShipToInfo.distributionChannel
      : '';
    const address1 = customersShipToInfo.address1
      ? customersShipToInfo.address1
      : '';
    const houseNumber = customersShipToInfo.houseNumber
      ? customersShipToInfo.houseNumber
      : '';
    const p_code = customersShipToInfo.postalCode
      ? customersShipToInfo.postalCode
      : '';
    const city = customersShipToInfo.city ? customersShipToInfo.city : '';
    const phone1 = customersShipToInfo.phone1 ? customersShipToInfo.phone1 : '';
    const phone2 = customersShipToInfo.phone2 ? customersShipToInfo.phone2 : '';
    const fax = customersShipToInfo.fax ? customersShipToInfo.fax : '';

    customerShipObj.customerShipTo = customersShipToInfo.customerShipTo
      ? customersShipToInfo.customerShipTo
      : '';
    customerShipObj.salesArea = salesOrganization + ' ' + distributionChannel;
    customerShipObj.name1 = customersShipToInfo.name1
      ? customersShipToInfo.name1
      : '';
    customerShipObj.name2 = customersShipToInfo.name2
      ? customersShipToInfo.name2
      : '';
    customerShipObj.name3 = customersShipToInfo.name3
      ? customersShipToInfo.name3
      : '';
    customerShipObj.address = address1 + ' ' + houseNumber;
    customerShipObj.postalCode = p_code + ' ' + city;
    customerShipObj.phone = phone1 + ' ' + phone2;
    customerShipObj.fax = fax;
    customerShipObj.email = customersShipToInfo.mailAddress
      ? customersShipToInfo.mailAddress
      : '';
    partnerDetails.customersShipToInfo = customerShipObj;

    //

    if (customersBillToInfo.length > 0) {
      partnerDetails.customersBillToInfo = customersBillToInfo[0];
    }
    if (customersSoldToInfo.length > 0) {
      partnerDetails.customersSoldToInfo = customersSoldToInfo[0];
    }
    if (customersPayerInfo.length > 0) {
      partnerDetails.customersPayerInfo = customersPayerInfo[0];
    }

    return partnerDetails;
  }

  async getCustomerDetails() {
    const customerDetails = {
      generalInfo: {},
      hierarchyInfo: {},
      territoryInfo: {},
    };

    // get from redux
    const customerInfo = await this.customersService.getCustomerInfoFromRedux();

    // Get cusotmer hierarchy info
    const customerHierarchyDetails =
      await this.customerHierarchiesShipToService.getCustomerHierarchiesForSelectedCustomers();
    let hierarchyDetails: any = {};
    if (customerHierarchyDetails.length > 0) {
      hierarchyDetails.level3 =
        customerHierarchyDetails[0].customer_hier_l3 +
        ' - ' +
        customerHierarchyDetails[0].name_hier_l3;
      hierarchyDetails.level4 =
        customerHierarchyDetails[0].customer_hier_l4 +
        ' - ' +
        customerHierarchyDetails[0].name_hier_l4;
      hierarchyDetails.level5 =
        customerHierarchyDetails[0].customer_hier_l5 +
        ' - ' +
        customerHierarchyDetails[0].name_hier_l5;
      hierarchyDetails.level6 =
        customerHierarchyDetails[0].customer_hier_l6 +
        ' - ' +
        customerHierarchyDetails[0].name_hier_l6;
    }
    customerDetails.hierarchyInfo = hierarchyDetails;

    // Wholesaler  info...
    const customerWholeSalerOutletInfo =
      await this.customersService.getCustomerWholeSaleInfo();

    // Outlet classification  -> Industry_Code + Description of industry code / Description of customer channel
    const industryCodeChannelInfo =
      await this.customerIndustryCodesService.getCustomerIndustryCodeChannelDescription();
    let customerChannelInfo: any = '';
    if (
      industryCodeChannelInfo.length > 0 &&
      industryCodeChannelInfo[0].idCustomerChannel.length > 0
    ) {
      // call only when idCustomerChannel is not empty
      customerChannelInfo =
        await this.customerChannelsService.getCustomerChannelDescription(
          industryCodeChannelInfo[0].idCustomerChannel,
        );
    }
    const paymentTermDescriptionInfo =
      await this.customersPaymentTermsService.getCustomerPaymentTermDescription();
    const customerPriceGroupValue =
      await this.parametersValuesService.getParameterValue(
        'Display_Customer_Price_Group_In_Factsheet',
      );

    // general Info obj .....
    let generalInfoObj: any = {};
    let outletClassification = '';
    if (customerWholeSalerOutletInfo.length > 0) {
      generalInfoObj.wholesaler = customerWholeSalerOutletInfo[0].wholesaler;
    }

    if (industryCodeChannelInfo.length > 0) {
      outletClassification =
        industryCodeChannelInfo[0].industryCode +
        ' ' +
        industryCodeChannelInfo[0].descriptionLanguage;
    }
    if (customerChannelInfo.length > 0) {
      outletClassification =
        outletClassification +
        ' / ' +
        customerChannelInfo[0].descriptionLanguage;
    }
    generalInfoObj.outletClassification = outletClassification;
    generalInfoObj.abcClassification = customerInfo.abcClassification
      ? customerInfo.abcClassification
      : '-';

    if (paymentTermDescriptionInfo.length > 0) {
      generalInfoObj.paymentTerm =
        paymentTermDescriptionInfo[0].paymentTerm +
        ' ' +
        paymentTermDescriptionInfo[0].descriptionLanguage;
    }

    if (customerPriceGroupValue == PRICE_GROUP_TYPE.CUSTOMER_PRICE_GROUP) {
      const customerPriceGroup = customerInfo.customerPriceGroup
        ? customerInfo.customerPriceGroup
        : '';

      generalInfoObj.paymentTerm +=
        customerPriceGroup.length > 0 ? ' / ' + customerPriceGroup : '';
    }

    const vat_reg_no = customerInfo.vatRegistrationNumber
      ? customerInfo.vatRegistrationNumber
      : '';
    generalInfoObj.vatRegistrationNumber = vat_reg_no;

    customerDetails.generalInfo = generalInfoObj;

    // Territory Info Obj ....

    let territoryObj: any = {};

    const territoryInfoData =
      await this.customersService.getCustomerTerritoryInfo();

    let salesRepresentativeName = '-';
    let salesManagerName = '-';
    let keyAccountManagerName = '-';
    let salesResponsibleName = '-';

    if (territoryInfoData.length > 0) {
      const territoryInfoObj = territoryInfoData[0];
      salesRepresentativeName = territoryInfoObj?.salesRepresentative
        ? territoryInfoObj?.salesRepresentative
        : '-';
      salesManagerName = territoryInfoObj?.salesManager
        ? territoryInfoObj?.salesManager
        : '-';
      keyAccountManagerName = territoryInfoObj?.keyAccountManager
        ? territoryInfoObj?.keyAccountManager
        : '-';
      salesResponsibleName = territoryInfoObj?.salesResponsible
        ? territoryInfoObj?.salesResponsible
        : '-';
    }

    territoryObj.salesRepresentative = salesRepresentativeName;
    territoryObj.salesManager = salesManagerName;
    territoryObj.keyAccountManager = keyAccountManagerName;
    territoryObj.salesResponsible = salesResponsibleName;
    customerDetails.territoryInfo = territoryObj;

    // ...

    return customerDetails;
  }
  async getCustomerNotes() {
    let customerNotes = await this.internalMessagesService.getCustomerNotes();

    return customerNotes;
  }

  async createOrUpdateCustomerNotes(notesObj: any) {
    return await this.internalMessagesService.createOrUpdateCustomerNotes(
      notesObj,
    );
  }
  async deleteCustomerNotes(notesObj: any) {
    return await this.internalMessagesService.deleteCustomerNotes(notesObj);
  }
}
export default new CLBasicInfoController();
