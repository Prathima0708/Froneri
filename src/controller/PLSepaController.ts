import {CustomersService} from 'src/services/CustomersService';
import {DiscoveryAgreementRequestsService} from 'src/services/DiscoveryAgreementRequestsService';
import {DiscoveryControlsService} from 'src/services/DiscoveryControlsService';
import {DiscoveryFinancialDataService} from 'src/services/DiscoveryFinancialDataService';
import {DiscoverySepaService} from 'src/services/DiscoverySepaService';
import {DiscoveryService} from 'src/services/DiscoveryService';
import {ProspectsService} from 'src/services/ProspectsService';
import {PLP_SEPA_CONTROL_NAME} from 'src/utils/ControlName';
import {REQUESTED_AGREEMENT_TYPE} from 'src/utils/DbConst';

class PLSepaController {
  private prospectsService: ProspectsService;
  private discoverySepaService: DiscoverySepaService;
  private discoveryFinancialDataService: DiscoveryFinancialDataService;
  private discoveryService: DiscoveryService;
  private discoveryAgreementRequestsService: DiscoveryAgreementRequestsService;
  private customersService: CustomersService;
  private discoveryControlsService: DiscoveryControlsService;

  constructor() {
    this.prospectsService = new ProspectsService();
    this.discoverySepaService = new DiscoverySepaService();
    this.discoveryFinancialDataService = new DiscoveryFinancialDataService();
    this.discoveryService = new DiscoveryService();
    this.discoveryAgreementRequestsService =
      new DiscoveryAgreementRequestsService();
    this.customersService = new CustomersService();
    this.discoveryControlsService = new DiscoveryControlsService();
  }

  async isSepaAgreementExists() {
    return await this.discoverySepaService.isSepaAgreementExists();
  }

  async getPrepopulatedSepaInfo() {
    const prospectInfo: any = await this.prospectsService.getPLProspectInfo();
    const statusType = prospectInfo?.statusType ? prospectInfo?.statusType : '';
    if (statusType.toLowerCase() === 'p') {
      return await this.prospectsService.getPLPSepaProspectsAgreementAvailableInfo();
    } else {
      return await this.customersService.getPLPSepaCustomerAgreementAvailableInfo();
    }
  }

  async getPLPSepAgreementNotAvailableInfo() {
    const prospectInfo: any = await this.prospectsService.getPLProspectInfo();
    const statusType = prospectInfo?.statusType ? prospectInfo?.statusType : '';
    if (statusType.toLowerCase() === 'p') {
      return await this.prospectsService.getPLPSepAgreementNotAvailableInfo();
    } else {
      return await this.customersService.getPLPSepaCustomerAgreementNotAvailableInfo();
    }
  }
  // function saves or update the changes made in the sepa agreement
  async createOrUpdateProspectSepaInfo(prospectData: any) {
    return await this.discoverySepaService.createOrUpdateProspectSepaInfo(
      prospectData,
    );
  }

  async finalizeSepaAgreementCreateRequest(fieldData: any) {
    const prospectInfo: any = await this.prospectsService.getPLProspectInfo();
    const statusType = prospectInfo?.statusType ? prospectInfo?.statusType : '';
    let financialData = {};
    if (statusType.toLowerCase() === 'p') {
      // get expected turnover 1, 2, 3 using below function
      financialData =
        await this.discoveryFinancialDataService.getProspectFinancialInfo();
    } else {
      financialData = await this.discoveryService.getCustomerFinancialInfo();
    }
    return await this.discoveryAgreementRequestsService.createFinalizeAgreementRequest(
      REQUESTED_AGREEMENT_TYPE.SEPA,
      fieldData,
      financialData,
    );
  }

  async deleteSepaAgreement() {
    return await this.discoverySepaService.deleteSepaAgreement();
  }

  async updateSepaOverwriteInfo() {
    return await this.discoveryService.updateSepaOverwriteInfo();
  }

  async getMandatoryFieldsConfig() {
    const nameOfAccountHolder =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_SEPA_CONTROL_NAME.TXT_NAME_OF_ACCOUNT_HOLDER,
      );
    const ibanNumber =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_SEPA_CONTROL_NAME.TXT_SEPA_IBAN_NO,
      );
    const customerSignature =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_SEPA_CONTROL_NAME.SIGN_CUSTOMER_SIGNATURE,
      );
    return {
      nameOfAccountHolder,
      ibanNumber,
      customerSignature,
    };
  }
}
export default new PLSepaController();
