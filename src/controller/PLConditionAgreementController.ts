import {DiscoveryAgreementRequestsService} from 'src/services/DiscoveryAgreementRequestsService';
import {ContractTypeService} from 'src/services/ContractTypeService';
import {DiscoveryConditionAgreementsService} from 'src/services/DiscoveryConditionAgreementsService';
import {DiscoveryFinancialDataService} from 'src/services/DiscoveryFinancialDataService';
import {DiscoveryService} from 'src/services/DiscoveryService';
import {ProspectsService} from 'src/services/ProspectsService';
import {REQUESTED_AGREEMENT_TYPE} from 'src/utils/DbConst';
import {CustomersPayerService} from 'src/services/CustomersPayerService';
import {DiscoveryListValuesService} from 'src/services/DiscoveryListValuesService';

class PLConditionAgreementController {
  private discoveryConditionAgreementsService: DiscoveryConditionAgreementsService;
  private prospectsService: ProspectsService;
  private discoveryFinancialDataService: DiscoveryFinancialDataService;
  private discoveryService: DiscoveryService;
  private discoveryAgreementRequestsService: DiscoveryAgreementRequestsService;
  private contractTypeService: ContractTypeService;
  private customersPayerService: CustomersPayerService;
  private discoveryListValuesService: DiscoveryListValuesService;

  constructor() {
    this.discoveryConditionAgreementsService =
      new DiscoveryConditionAgreementsService();
    this.prospectsService = new ProspectsService();
    this.discoveryFinancialDataService = new DiscoveryFinancialDataService();
    this.discoveryService = new DiscoveryService();
    this.discoveryAgreementRequestsService =
      new DiscoveryAgreementRequestsService();
    this.contractTypeService = new ContractTypeService();
    this.customersPayerService = new CustomersPayerService();
    this.discoveryListValuesService = new DiscoveryListValuesService();
  }

  async getConditionalAgreement(
    isFilterApplied: boolean,
    idContractType: number,
  ) {
    const conditionalAgreementInfo =
      await this.discoveryConditionAgreementsService.getConditionalAgreement(
        isFilterApplied,
        idContractType,
      );

    return conditionalAgreementInfo;
  }

  async insertOrUpdateConditionalAgreement(
    conditionAgreementNumber: string,
    conditionalAgreementDataData: any,
  ) {
    let isCustomerAttributeInfoInsertedOrUpdated =
      await this.discoveryConditionAgreementsService.insertOrUpdateConditionalAgreement(
        conditionalAgreementDataData,
        conditionAgreementNumber,
      );
    return isCustomerAttributeInfoInsertedOrUpdated;
  }

  // get country code for fetching the dropdown
  async getCountryCodeDropdown() {
    const prospectInfo: any = await this.prospectsService.getPLProspectInfo();
    const statusType = prospectInfo?.statusType ? prospectInfo?.statusType : '';
    if (statusType.toLowerCase() === 'p') {
      const prospectCountryCode =
        await this.prospectsService.getProspectCountryCode();

      if (prospectCountryCode.length > 0) {
        const countryCode =
          await this.discoveryListValuesService.getCountryCode(
            prospectCountryCode[0].country,
          );

        return countryCode[0].item_value;
      } else {
        return '';
      }
    } else {
      const customerCountryCode =
        await this.prospectsService.getCustomerCountryCode();
      if (customerCountryCode.length > 0) {
        console.log('customerCountryCode', customerCountryCode);
        const countryCode = customerCountryCode[0].salesOrganization.slice(
          0,
          2,
        );
        return countryCode;
      } else {
        return '';
      }
    }
  }

  async getCADropdownValues() {
    const countryCode = await this.getCountryCodeDropdown();
    let dropdownValue = [];
    if (countryCode !== '') {
      dropdownValue =
        await this.discoveryConditionAgreementsService.getCADropdownValues(
          countryCode,
        );
    }

    return dropdownValue;
  }

  async getConditionAgreementDetails() {
    const prospectInfo: any = await this.prospectsService.getPLProspectInfo();
    const statusType = prospectInfo?.statusType ? prospectInfo?.statusType : '';
    if (statusType.toLowerCase() === 'p') {
      const conditionAgreement =
        await this.discoveryConditionAgreementsService.getConditionAgreementForProspect();
      return conditionAgreement;
    } else {
      const conditionAgreement =
        await this.discoveryConditionAgreementsService.getConditionAgreementForCustomer();
      return conditionAgreement;
    }
  }

  async deleteConditionAgreement(conditionAgreementNumber: string) {
    return await this.discoveryConditionAgreementsService.deleteConditionAgreement(
      conditionAgreementNumber,
    );
  }

  async finalizeConditionAgreementCreateRequest(fieldData: any) {
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
      REQUESTED_AGREEMENT_TYPE.CONDITIONS,
      fieldData,
      financialData,
    );
  }

  async getConditionAgreementPreview() {
    const prospectInfo: any = await this.prospectsService.getPLProspectInfo();
    const statusType = prospectInfo?.statusType ? prospectInfo?.statusType : '';
    if (statusType.toLowerCase() === 'p') {
      // get expected turnover 1, 2, 3 using below function
      const financialData =
        await this.discoveryFinancialDataService.getProspectFinancialInfo();
      return financialData;
    } else {
      const financialData =
        await this.discoveryService.getCustomerFinancialInfo();
      return financialData;
    }
  }

  async getHtmlTemplate(contractId: any) {
    return await this.contractTypeService.getHtmlTemplate(contractId);
  }

  async getConditionAgreementHtmlTemplate() {
    return await this.discoveryConditionAgreementsService.getConditionAgreementHtmlTemplate();
  }

  async getCustomerPayersDetails() {
    return await this.customersPayerService.getCustomerPayersDetails();
  }

  async getConditionDataOfProspect(agreementNumber: string) {
    return await this.discoveryConditionAgreementsService.getConditionDataOfProspect(
      agreementNumber,
    );
  }

  async getTermsAndConditionsTemplateName(idContractType: string) {
    return await this.contractTypeService.getCATermsAndConditionsTemplateName(
      idContractType,
    );
  }
}
export default new PLConditionAgreementController();
