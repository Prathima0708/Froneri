import {DiscoveryControlsService} from 'src/services/DiscoveryControlsService';
import {DiscoveryFinancialDataService} from 'src/services/DiscoveryFinancialDataService';
import {CustomersPaymentTermsService} from 'src/services/CustomersPaymentTermsService';
import {DiscoveryListValuesService} from 'src/services/DiscoveryListValuesService';
import {CustomersPaymentMethodsService} from 'src/services/CustomersPaymentMethodsService';

import {
  PLP_FINANCIAL_INFO_ANDROID_CONTROL_NAME,
  PLP_FINANCIAL_INFO_CONTROL_NAME,
} from 'src/utils/ControlName';
import {DiscoveryService} from 'src/services/DiscoveryService';

class PLFinancialInfoController {
  private discoveryFinancialDataService: DiscoveryFinancialDataService;
  private discoveryListValuesService: DiscoveryListValuesService;
  private discoveryControlsService: DiscoveryControlsService;
  private customersPaymentTermsService: CustomersPaymentTermsService;
  private customersPaymentMethodsService: CustomersPaymentMethodsService;
  private discoveryService: DiscoveryService;

  constructor() {
    this.discoveryFinancialDataService = new DiscoveryFinancialDataService();
    this.discoveryListValuesService = new DiscoveryListValuesService();
    this.discoveryControlsService = new DiscoveryControlsService();
    this.customersPaymentTermsService = new CustomersPaymentTermsService();
    this.customersPaymentMethodsService = new CustomersPaymentMethodsService();
    this.discoveryService = new DiscoveryService();
  }

  async getProspectOrCustomerFinancialInfo() {
    const prospectData = await this.discoveryService.getPLProspectInfo();
    let financialInformation = [];

    if (
      prospectData?.statusType &&
      prospectData?.statusType.toLowerCase() === 'c'
    ) {
      financialInformation =
        await this.discoveryService.getCustomerFinancialInfo();
    } else {
      financialInformation =
        await this.discoveryFinancialDataService.getProspectFinancialInfo();
    }

    return financialInformation;
  }

  async getDeliveryAndInvoicing() {
    const controlName = PLP_FINANCIAL_INFO_CONTROL_NAME.DDL_Delivery_Note_Type;
    const deliveryAndInvoicingData =
      await this.discoveryListValuesService.getDropdownListValues(controlName);

    return deliveryAndInvoicingData;
  }

  async getInvoiceRhythm() {
    const controlName = PLP_FINANCIAL_INFO_CONTROL_NAME.DDL_INVOICE_RHYTHM;
    const invoiceRhythmData =
      await this.discoveryListValuesService.getDropdownListValues(controlName);

    return invoiceRhythmData;
  }

  async getRekap() {
    const controlName = PLP_FINANCIAL_INFO_CONTROL_NAME.DDL_REKAP;
    const rekapData =
      await this.discoveryListValuesService.getDropdownListValues(controlName);

    return rekapData;
  }

  async getPdfInvoicing() {
    const controlName = PLP_FINANCIAL_INFO_CONTROL_NAME.DDL_PDF_INVOICING;
    const pdfInvoicingData =
      await this.discoveryListValuesService.getDropdownListValues(controlName);

    return pdfInvoicingData;
  }

  async insertOrUpdateFinancialInfo(financialData: any) {
    const isFinancialInfoInsertedOrUpdated =
      await this.discoveryFinancialDataService.insertOrUpdateFinancialInfo(
        financialData,
      );

    return isFinancialInfoInsertedOrUpdated;
  }

  async getFinancialInfoCustomerPaymentTermDescription() {
    const paymentTermDescriptionInfo =
      await this.customersPaymentTermsService.getFinancialInfoCustomerPaymentTermDescription();

    return paymentTermDescriptionInfo;
  }

  async getCustomerPaymentMethodsDescription() {
    const paymentMethodsDescriptionInfo =
      await this.customersPaymentMethodsService.getCustomerPaymentMethodsDescription();

    return paymentMethodsDescriptionInfo;
  }

  async getMandatoryFieldsConfig() {
    const taxPayerAccNumber =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_FINANCIAL_INFO_ANDROID_CONTROL_NAME.TXT_TAX_PAYER_ACCOUNT_NO,
      );
    const salesTaxIdNumber =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_FINANCIAL_INFO_ANDROID_CONTROL_NAME.TXT_SALES_TAX_ID_NO,
      );
    const taMinimumTurnoverExplained =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_FINANCIAL_INFO_ANDROID_CONTROL_NAME.CB_TA_MINIMUM_TUROVER,
      );
    const expectedTurnOverOne =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_FINANCIAL_INFO_ANDROID_CONTROL_NAME.TXT_EXPECTED_TURNOVER1,
      );
    const expectedTurnOverTwo =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_FINANCIAL_INFO_ANDROID_CONTROL_NAME.TXT_EXPECTED_TURNOVER2,
      );
    const expectedTurnOverThree =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_FINANCIAL_INFO_ANDROID_CONTROL_NAME.TXT_EXPECTED_TURNOVER3,
      );
    const deliveryNoteType =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_FINANCIAL_INFO_ANDROID_CONTROL_NAME.DDL_DELIVERY_NOTE_TYPE,
      );
    const invoiceRhythm =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_FINANCIAL_INFO_ANDROID_CONTROL_NAME.DDL_INVOICE_RHYTHM,
      );
    const rekap = await this.discoveryControlsService.getControlMandatoryValue(
      PLP_FINANCIAL_INFO_ANDROID_CONTROL_NAME.DDL_REKAP,
    );
    const pdfInvoicing =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_FINANCIAL_INFO_ANDROID_CONTROL_NAME.DDL_PDF_INVOICING,
      );
    const emailPdfInvoicing =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_FINANCIAL_INFO_ANDROID_CONTROL_NAME.TXT_EMAIL_PDF_INVOICING,
      );
    const paymentTerms =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_FINANCIAL_INFO_ANDROID_CONTROL_NAME.DDL_PAYMENT_TERMS,
      );
    const paymentMethods =
      await this.discoveryControlsService.getControlMandatoryValue(
        PLP_FINANCIAL_INFO_ANDROID_CONTROL_NAME.DDL_PAYMENT_METHODS,
      );

    return {
      taxPayerAccNumber,
      salesTaxIdNumber,
      taMinimumTurnoverExplained,
      expectedTurnOverOne,
      expectedTurnOverTwo,
      expectedTurnOverThree,
      deliveryNoteType,
      invoiceRhythm,
      rekap,
      pdfInvoicing,
      emailPdfInvoicing,
      paymentTerms,
      paymentMethods,
    };
  }
}
export default new PLFinancialInfoController();
