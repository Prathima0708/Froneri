import ApiUtil from 'src/services/ApiUtil';
import LanguagesService from 'src/services/LanguagesService';
import {END_POINTS} from 'src/utils/ApiEndpoints';
import {getOnlyDate} from 'src/utils/CommonUtil';
import {CustomerContactsService} from 'src/services/CustomerContactsService';

class CLContactHistoryController {
  private customerContactsService: CustomerContactsService;

  constructor() {
    this.customerContactsService = new CustomerContactsService();
  }
  async getContactHistoryData(
    pageNumber: number,
    pageSize: number,
    onlyOrders: boolean = false,
    onlyVisits: boolean = false,
  ) {
    const employeeInfo =
      await this.customerContactsService.getLoggedInEmployeeInfo();
    const customerInfo = await this.customerContactsService.getCLCustomerInfo();
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';
    const salesOrganization = customerInfo?.salesOrganization
      ? customerInfo?.salesOrganization
      : '';
    const distributionChannel = customerInfo?.distributionChannel
      ? customerInfo?.distributionChannel
      : '';

    const languagesData = await LanguagesService.getLanguagesData();
    const languageIndex = languagesData.find(
      (languageData: any) => languageData.language === employeeInfo[0].language,
    )?.indexLanguage;

    const PARAMETERS = `?pageNumber=${pageNumber}&pageSize=${pageSize}&customerNumber=${customerShipTo}&salesOrganization=${salesOrganization}&distributionChannel=${distributionChannel}&connecteduserLanguageIndex=${languageIndex}&onlyOrders=${onlyOrders}&onlyVisits=${onlyVisits}`;

    // For TESTING
    // const PARAMETERS = `?pageNumber=${pageNumber}&pageSize=${pageSize}&customerNumber=0020304231&salesOrganization=${salesOrganization}&distributionChannel=${distributionChannel}&connecteduserLanguageIndex=${languageIndex}&onlyOrders=${onlyOrders}&onlyVisits=${onlyVisits}`;
    const BASE_API_URL = await this.customerContactsService.getDefaultApiUrl();
    const URL = BASE_API_URL + END_POINTS.CONTACT_HISTORY + PARAMETERS;

    console.log('contact history URL :>> ', URL);

    let response = await ApiUtil.callGetApi(URL);
    let contactHistoryData = [];

    console.log('contact history response :>> ', response);

    if (response?.data && response?.data.length > 0) {
      contactHistoryData = response.data.map((data: any) => {
        return {
          ...data,
          date: data?.callDay ? getOnlyDate(data?.callDay) : '',
          time: data?.callTime ? data?.callTime : '',
          employeeNumber:
            data?.employee && data.employee.split('-')
              ? data.employee.split('-')[0].trim()
              : '',
          employeeName:
            data?.employee && data.employee.split('-')
              ? data.employee.split('-')[1].trim()
              : '',
          deliveryDate: data?.deliveryDate
            ? getOnlyDate(data.deliveryDate)
            : '',
        };
      });
    }

    response.data = contactHistoryData;

    return response;
  }
}
export default new CLContactHistoryController();
