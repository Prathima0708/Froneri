import {TextsReportsService} from 'src/services/TextsReportsService';

class PLSepaPreviewController {
  private textsReportsService: TextsReportsService;

  constructor() {
    this.textsReportsService = new TextsReportsService();
  }

  async getPreviewScreensLabelFromTextsReport(isSepa: boolean) {
    const titleLabelName = isSepa
      ? 'LBL_SEPA_HEADER'
      : 'LBL_SEPA_BANK_DETAILS_HEADER';
    const bodyLabelName = isSepa
      ? 'LBL_SEPA_AGREEMENT_TEXT'
      : 'LBL_SEPA_BANK_DETAILS_BODY';
    let title = await this.textsReportsService.getTextsReportsValue(
      titleLabelName,
    );
    let body = await this.textsReportsService.getTextsReportsValue(
      bodyLabelName,
    );

    return {title, body};
  }
}
export default new PLSepaPreviewController();
