import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class DiscoveryFinancialData extends Model {
  static table = 'discovery_financial_data';

  @field('discovery_id') discoveryId!: string;
  @field('tax_payer_account_number') taxPayerAccountNumber!: string;
  @field('sales_tax_identification_number')
  salesTaxIdentificationNumber!: string;
  @field('expected_turnover_1') expectedTurnover1!: number;
  @field('expected_turnover_2') expectedTurnover2!: number;
  @field('expected_turnover_3') expectedTurnover3!: number;
  @field('expected_turnover_4') expectedTurnover4!: number;
  @field('delivery_note_type') deliveryNoteType!: string;
  @field('ta_minimum_turnover_explained') taMinimumTurnoverExplained!: string;
  @field('total_potential') totalPotential!: number;
  @field('invoice_rhythm') invoiceRhythm!: string;
  @field('rekap') rekap!: string;
  @field('ytd_turnover_1') ytdTurnover1!: number;
  @field('ytd_turnover_2') ytdTurnover2!: number;
  @field('ytd_date') ytdDate!: string;
  @field('pdf_invoicing') pdfInvoicing!: string;
  @field('email_for_pdf_invoicing') emailForPdfInvoicing!: string;
  @field('payment_terms') paymentTerms!: string;
  @field('payment_method') paymentMethod!: string;
  @field('update_employee_number') updateEmployeeNumber!: string;
  @field('update_datetime') updateDatetime!: string;
  @field('sent_datetime') sentDatetime!: string;
  @field('data_origin') dataOrigin!: string;
  @field('last_sync_on') lastSyncOn!: number;
}

export default DiscoveryFinancialData;
