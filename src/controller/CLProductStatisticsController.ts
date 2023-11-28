import ApiUtil from 'src/services/ApiUtil';
import {TurnoverGroupsService} from 'src/services/TurnoverGroupsService';
import {END_POINTS} from 'src/utils/ApiEndpoints';
import {LangagesService} from 'src/services/LanguagesService';
import {
  formatDate,
  getLocaleCurrencyFormatter,
  getLocaleNumberFormatter,
} from 'src/utils/CommonUtil';

class CLProductStatisticsController {
  private turnoverGroupsService: TurnoverGroupsService;
  private languagesService: LangagesService;

  constructor() {
    this.turnoverGroupsService = new TurnoverGroupsService();
    this.languagesService = new LangagesService();
  }

  async getProductStatistics(
    pageNumber: number,
    pageSize: number,
    turnoverDateFrom: string | Date,
    turnoverDateTo: string | Date,
    materialNumber?: string,
    materialDescription?: string,
    materialHierarchyNode?: string,
  ) {
    const data = await this.getProductStatisticsOnline(
      pageNumber,
      pageSize,
      turnoverDateFrom,
      turnoverDateTo,
      materialNumber,
      materialDescription,
      materialHierarchyNode,
    );

    const results = data.data;
    const total = data.total;

    if (results.length === 0) {
      return {total: 0, data: []};
    }

    let finalResults: any = [];
    for (const result of results) {
      let obj = {
        ...result,
        formatterMaterialNumber: result.materialNumber
          ? result.materialNumber.replace(/^0+/, '')
          : '',
        formatterQuantity: result.quantity
          ? getLocaleNumberFormatter(result.quantity)
          : '0',
        formatterNetAmount: result.netAmount
          ? getLocaleNumberFormatter(result.netAmount, 2)
          : '',
        formatterUnitPrice: result.unitPrice
          ? getLocaleNumberFormatter(result.unitPrice, 2)
          : '',
      };
      finalResults.push(obj);
    }
    return {total, data: finalResults};
  }

  async getProductStatisticsOnline(
    pageNumber: number,
    pageSize: number,
    turnoverDateFrom: string | Date,
    turnoverDateTo: string | Date,
    materialNumber?: string,
    materialDescription?: string,
    materialHierarchyNode?: string | any,
  ) {
    const employeeInfo =
      await this.turnoverGroupsService.getLoggedInEmployeeInfo();
    const customerInfo = await this.turnoverGroupsService.getCLCustomerInfo();

    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';
    const salesOrganization = customerInfo?.salesOrganization
      ? customerInfo?.salesOrganization
      : '';
    const distributionChannel = customerInfo?.distributionChannel
      ? customerInfo?.distributionChannel
      : '';

    const languagesData = await this.languagesService.getLanguagesData();
    const languageIndex = languagesData.find(
      (languageData: any) => languageData.language === employeeInfo[0].language,
    )?.indexLanguage;

    console.log('Product statistics customerShipTo :>> ', customerShipTo);

    let PARAMETERS = `?pageNumber=${pageNumber}&pageSize=${pageSize}&customerNumber=${customerShipTo}&salesOrganization=${salesOrganization}&distributionChannel=${distributionChannel}&connectedUserLanguageIndex=${languageIndex}`;
    // let PARAMETERS = `?customerNumber=0020306350&salesOrganization=DE09&distributionChannel=02&turnoverDateFrom=2023-01-01&turnoverDateTo=2023-06-01&connectedUserLanguageIndex=1`;

    if (turnoverDateFrom != '' && turnoverDateTo != '') {
      const from = formatDate(turnoverDateFrom);
      const to = formatDate(turnoverDateTo);
      PARAMETERS += `&turnoverDateFrom=${from}&turnoverDateTo=${to}`;
    }
    if (materialNumber != '') {
      PARAMETERS += `&materialNumber=${materialNumber}`;
    }

    if (materialDescription != '') {
      PARAMETERS += `&materialDescription=${materialDescription}`;
    }

    if (materialHierarchyNode != '') {
      const materialNode = materialHierarchyNode.split(' ');
      let materialHierarchyNodes = '';
      if(materialNode.length > 0){
        materialHierarchyNodes = materialNode[0];
      }
      PARAMETERS += `&materialHierarchyNode=${materialHierarchyNodes}`;
    }

    const BASE_API_URL = await this.turnoverGroupsService.getDefaultApiUrl();
    console.log('PARAMETERS', PARAMETERS);
    const URL = BASE_API_URL + END_POINTS.PRODUCT_STATISTICS + PARAMETERS;

    const response = await ApiUtil.callGetApi(URL);

    console.log('Product statistics URL :>> ', URL);

    return response;
  }
}
export default new CLProductStatisticsController();
