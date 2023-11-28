import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import DiscoveryFinancialData from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryFinancialData';
import {getISOCurrentDate} from 'src/utils/CommonUtil';

const ENTITY = OFFLINE_STORAGE.MODEL.DISCOVERY_FINANCIAL_DATA;

export class DiscoveryFinancialDataRepo extends BaseRepo<DiscoveryFinancialData> {
  /**
   * Create Prospect -> insert or update discovery financial data
   * @returns
   */
  async saveOrUpdateDiscoveryFinancialData(
    previousCustomerShipTo: string,
    discoveryId: string,
    turnoverAndPaymentData: any,
    previousCustomerBasicInfoData: any,
  ) {
    try {
      const collection = this.getCollection(ENTITY);

      const discoveryFinancialData = await collection
        .query(Q.where('discovery_id', discoveryId))
        .fetch();

      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
      const currentDate = getISOCurrentDate();

      const previousCustomerBasicInfo =
        previousCustomerBasicInfoData.length > 0
          ? previousCustomerBasicInfoData[0]
          : {};

      const iceCreamBulk = turnoverAndPaymentData.iceCreamBulk
        ? Number(turnoverAndPaymentData.iceCreamBulk)
        : 0;

      const iceCreamImpulse = turnoverAndPaymentData.iceCreamImpulse
        ? Number(turnoverAndPaymentData.iceCreamImpulse)
        : 0;

      const frozenFood = turnoverAndPaymentData.frozenFood
        ? Number(turnoverAndPaymentData.frozenFood)
        : 0;
      const total = turnoverAndPaymentData.total
        ? Number(turnoverAndPaymentData.total)
        : 0;
      const paymentTerms = previousCustomerBasicInfo?.paymentTerms
        ? previousCustomerBasicInfo.paymentTerms
        : '';
      const paymentMethod = previousCustomerBasicInfo?.paymentMethod
        ? previousCustomerBasicInfo?.paymentMethod
        : '';

      if (discoveryFinancialData.length > 0) {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await discoveryFinancialData[0].update((rec: any) => {
            rec.sentDatetime = null;
            rec.updateEmployeeNumber = employeeNo;
            rec.updateDatetime = currentDate;
            rec.expectedTurnover1 = iceCreamBulk;
            rec.expectedTurnover2 = iceCreamImpulse;
            rec.expectedTurnover3 = frozenFood;
            rec.totalPotential = total;

            if (previousCustomerShipTo !== '') {
              rec.paymentTerms = paymentTerms;
              rec.paymentMethod = paymentMethod;
            }
          });
        });
      } else {
        await OFFLINE_STORAGE.getDB().write(async () => {
          await collection.create((rec: any) => {
            rec.discoveryId = discoveryId;
            rec.sentDatetime = null;
            rec.updateEmployeeNumber = employeeNo;
            rec.updateDatetime = currentDate;
            rec.expectedTurnover1 = iceCreamBulk;
            rec.expectedTurnover2 = iceCreamImpulse;
            rec.expectedTurnover3 = frozenFood;
            rec.totalPotential = total;

            if (previousCustomerShipTo !== '') {
              rec.paymentTerms = paymentTerms;
              rec.paymentMethod = paymentMethod;
            }
          });
        });
      }

      return true;
    } catch (error) {
      console.log('saveOrUpdateDiscoveryFinancialData error :>> ', error);
      return false;
    }
  }

  /**
   * PLP - Financial info -> get prospect financial info
   * @returns
   */
  async getProspectFinancialInfo() {
    const collection = this.getCollection(ENTITY);

    const prospectData = await this.getPLProspectInfo();
    const discoveryId = prospectData?.discoveryId
      ? prospectData.discoveryId
      : '';

    let results = await collection
      .query(
        Q.unsafeSqlQuery(
          'select dfd.tax_payer_account_number as taxPayerAccountNumber, ' +
            'dfd.sales_tax_identification_number as salesTaxIdentificationNumber, ' +
            'dfd.payment_method as paymentMethod, dfd.payment_terms as paymentTerms, ' +
            "coalesce(dfd.delivery_note_type, '') as deliveryNoteType, " +
            'dfd.expected_turnover_1 as expectedTurnover1, dfd.expected_turnover_2 as expectedTurnover2, ' +
            'dfd.expected_turnover_3 as expectedTurnover3, dfd.total_potential as totalPotential, ' +
            'dfd.invoice_rhythm as invoiceRhythm, dfd.rekap, ' +
            "coalesce(dfd.ta_minimum_turnover_explained, '0') as taMinimumTurnoverExplained, " +
            'dfd.pdf_invoicing as pdfInvoicing, ' +
            'coalesce(dfd.email_for_pdf_invoicing, "") as emailForPdfInvoicing ' +
            'from discovery_financial_data dfd where dfd.discovery_id = ? ',
          [discoveryId],
        ),
      )
      .unsafeFetchRaw();
    return results;
  }

  async insertOrUpdateFinancialInfo(financialData: any) {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const financialDataObj = await collection
        .query(Q.where('discovery_id', discoveryId))
        .fetch();

      const taxPayerAccountNumber = financialData?.taxPayerAccNumber ?? '';
      const salesTaxIdNumber = financialData?.salesTaxIdNumber ?? '';
      const expectedTurnOverOne = financialData?.expectedTurnOverOne
        ? Number(financialData?.expectedTurnOverOne)
        : 0;
      const expectedTurnOverTwo = financialData?.expectedTurnOverTwo
        ? Number(financialData?.expectedTurnOverTwo)
        : 0;
      const expectedTurnOverThree = financialData?.expectedTurnOverThree
        ? Number(financialData?.expectedTurnOverThree)
        : 0;
      const totalPotentialTurnOver = financialData?.totalPotentialTurnOver
        ? Number(financialData?.totalPotentialTurnOver)
        : 0;
      const deliveryNoteType = financialData?.deliveryNoteType ?? '';
      const invoiceRhythm = financialData?.invoiceRhythm ?? '';
      const rekap = financialData?.rekap ?? '';
      const pdfInvoicing = financialData?.pdfInvoicing ?? '';
      const emailPdfInvoicing = financialData?.emailPdfInvoicing ?? '';
      const paymentTerms = financialData?.paymentTerms ?? '';
      const paymentMethods = financialData?.paymentMethods ?? '';
      const taMinimumTurnoverExplained =
        financialData?.taMinimumTurnoverExplained ? '1' : '0';

      if (financialDataObj.length > 0) {
        //update
        await OFFLINE_STORAGE.getDB().write(async () => {
          await financialDataObj[0].update((rec: any) => {
            rec.taxPayerAccountNumber = taxPayerAccountNumber;
            rec.salesTaxIdentificationNumber = salesTaxIdNumber;
            rec.paymentTerms = paymentTerms;
            rec.paymentMethod = paymentMethods;
            rec.deliveryNoteType = deliveryNoteType;
            rec.expectedTurnover1 = expectedTurnOverOne;
            rec.expectedTurnover2 = expectedTurnOverTwo;
            rec.expectedTurnover3 = expectedTurnOverThree;
            rec.totalPotential = totalPotentialTurnOver;
            rec.invoiceRhythm = invoiceRhythm;
            rec.rekap = rekap;
            rec.taMinimumTurnoverExplained = taMinimumTurnoverExplained;
            rec.pdfInvoicing = pdfInvoicing;
            rec.emailForPdfInvoicing = emailPdfInvoicing;
          });
        });
      } else {
        // inserting
        await OFFLINE_STORAGE.getDB().write(async () => {
          await collection.create((rec: any) => {
            rec.discoveryId = discoveryId;
            rec.taxPayerAccountNumber = taxPayerAccountNumber;
            rec.salesTaxIdentificationNumber = salesTaxIdNumber;
            rec.paymentTerms = paymentTerms;
            rec.paymentMethod = paymentMethods;
            rec.deliveryNoteType = deliveryNoteType;
            rec.expectedTurnover1 = expectedTurnOverOne;
            rec.expectedTurnover2 = expectedTurnOverTwo;
            rec.expectedTurnover3 = expectedTurnOverThree;
            rec.totalPotential = totalPotentialTurnOver;
            rec.invoiceRhythm = invoiceRhythm;
            rec.rekap = rekap;
            rec.taMinimumTurnoverExplained = taMinimumTurnoverExplained;
            rec.pdfInvoicing = pdfInvoicing;
            rec.emailForPdfInvoicing = emailPdfInvoicing;
          });
        });
      }
      return true;
    } catch (error) {
      console.log('insertOrUpdateFinancialInfo error :>> ', error);
      return false;
    }
  }
}
