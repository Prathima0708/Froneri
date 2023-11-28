import {CustomersService} from 'src/services/CustomersService';
import {DiscoveryControlsService} from 'src/services/DiscoveryControlsService';
import {DiscoveryCustomerAttributesService} from 'src/services/DiscoveryCustomerAttributesService';
import {DiscoveryService} from 'src/services/DiscoveryService';
import {PLP_CUSTOMER_ATTRIBUTE_INFO_ANDROID_CONTROL_NAME} from 'src/utils/ControlName';

class PLCustomerInfoController {
  private discoveryCustomerAttributesService: DiscoveryCustomerAttributesService;
  private discoveryService: DiscoveryService;
  private customersService: CustomersService;
  private discoveryControlsService: DiscoveryControlsService;

  constructor() {
    this.discoveryCustomerAttributesService =
      new DiscoveryCustomerAttributesService();
    this.discoveryService = new DiscoveryService();
    this.customersService = new CustomersService();
    this.discoveryControlsService = new DiscoveryControlsService();
  }

  async getProspectOrCustomerAttributeInfo() {
    const prospectData = await this.discoveryService.getPLProspectInfo();
    let customerAttributeInformation = [];

    if (
      prospectData?.statusType &&
      prospectData?.statusType.toLowerCase() === 'c'
    ) {
      customerAttributeInformation =
        await this.customersService.getPLPCustomerAttibuteInfoData();
    } else {
      customerAttributeInformation =
        await this.discoveryCustomerAttributesService.getProspectCustomerAttributeInfo();
    }

    return customerAttributeInformation;
  }

  async insertOrUpdateCustomerAttributeInfo(customerAttributeData: any) {
    const iscustomerAttributeInfoInsertedOrUpdated =
      await this.discoveryCustomerAttributesService.insertOrUpdateCustomerAttributeInfo(
        customerAttributeData,
      );

    return iscustomerAttributeInfoInsertedOrUpdated;
  }

  async getMandatoryFieldsConfig() {
    const abcClassification =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CUSTOMER_ATTRIBUTE_INFO_ANDROID_CONTROL_NAME.DDL_ABC_CLASSIFICATION,
      );
    const priority =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CUSTOMER_ATTRIBUTE_INFO_ANDROID_CONTROL_NAME.DDL_PRIORITY,
      );
    const scooping =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CUSTOMER_ATTRIBUTE_INFO_ANDROID_CONTROL_NAME.CB_SCOOPING,
      );
    const startBusinessDate =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CUSTOMER_ATTRIBUTE_INFO_ANDROID_CONTROL_NAME.DP_START_BUSINESS_DATE,
      );
    const startBusinessReason =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CUSTOMER_ATTRIBUTE_INFO_ANDROID_CONTROL_NAME.DDL_BUSINESS_REASON,
      );
    const keyAccountGLNCode =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CUSTOMER_ATTRIBUTE_INFO_ANDROID_CONTROL_NAME.TXT_KEY_ACCOUNT_GLN_CODE,
      );
    const indirectCustomer =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CUSTOMER_ATTRIBUTE_INFO_ANDROID_CONTROL_NAME.CB_INDIRECT_CUSTOMER,
      );
    const wholeSalerCustomerNumber =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CUSTOMER_ATTRIBUTE_INFO_ANDROID_CONTROL_NAME.TXT_WHOLE_SALER_CUSTOMER_NO,
      );
    const distributer =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CUSTOMER_ATTRIBUTE_INFO_ANDROID_CONTROL_NAME.DDL_DISTRIBUTOR,
      );
    const firstName =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CUSTOMER_ATTRIBUTE_INFO_ANDROID_CONTROL_NAME.TXT_FIRST_NAME,
      );
    const lastName =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_CUSTOMER_ATTRIBUTE_INFO_ANDROID_CONTROL_NAME.TXT_LAST_NAME,
      );
    const name = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_CUSTOMER_ATTRIBUTE_INFO_ANDROID_CONTROL_NAME.DDL_NAME,
    );

    return {
      abcClassification,
      priority,
      scooping,
      startBusinessDate,
      startBusinessReason,
      keyAccountGLNCode,
      indirectCustomer,
      wholeSalerCustomerNumber,
      distributer,
      firstName,
      lastName,
      name,
    };
  }
}
export default new PLCustomerInfoController();
