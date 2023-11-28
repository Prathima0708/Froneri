import BaseApiService from './BaseApiService';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import Customers from 'src/storage/OfflineDBStorage/WmDB/models/Customers';
import {CustomersRepo} from 'src/repo/CustomersRepo';
import ApiUtil from './ApiUtil';
import {CUSTOMER_TYPES} from 'src/utils/Constant';
import {formatDate, getDecodedData} from 'src/utils/CommonUtil';
import LanguagesService from './LanguagesService';
import {END_POINTS} from 'src/utils/ApiEndpoints';

export class CustomersService extends BaseApiService<Customers, CustomersRepo> {
  private readonly customersRepository: CustomersRepo = new CustomersRepo();

  getRepo(): CustomersRepo {
    return this.customersRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CUSTOMERS;
  }

  async getCustomerInfo(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    const customers = await this.getRepo().getCustomerInfo(
      // '0020483733', // customerShipTo for checking the value of vatRegistrationNumber
      customerShipTo,
      salesOrganization,
      distributionChannel,
    );

    const decodedCustomers = customers.map((customer: any) => ({
      ...customer,
      vatRegistrationNumber:
        customer.vatRegistrationNumber.length > 0
          ? getDecodedData(customer.vatRegistrationNumber)
          : '',
    }));

    return decodedCustomers;
  }

  async searchCustomers(
    isAllRegion: boolean,
    start: number,
    limit: number,
    customerType: string,
    filterObj: any,
  ) {
    if (isAllRegion) {
      return await this.searchOnlineCustomers(
        start,
        limit,
        customerType,
        filterObj,
      );
    } else {
      return await this.searchOfflineCustomers(
        start,
        limit,
        customerType,
        filterObj,
      );
    }
  }

  async searchOfflineCustomers(
    start: number,
    limit: number,
    customerType: string,
    filterObj: any,
  ) {
    let customers = await this.getRepo().searchOfflineCustomers(
      start,
      limit,
      customerType,
      filterObj,
    );

    customers.results = customers.results.map((customer: any) => {
      const camelCaseResult = {
        endCustomerBusinessDatetime: customer.endCustomerBusinessDatetime,
        remote: customer.remote,
        customerShipTo: customer.customer_ship_to,
        employeeNo: customer.employeeNo,
        name1: customer.name1,
        name2: customer.name2,
        name3: customer.name3,
        postalCode: customer.postal_code,
        city: customer.city,
        address1: customer.address1,
        amountTradeAssets: customer.Amount_Trade_Assets,
        abcClassification: customer.abc_classification,
        distributor: customer.Distributor,
        lastVisitDatetime: customer.last_visit_datetime,
        color: customer.Color,
        statusType: customer.status_type,
        discoveryId: customer.Discovery_ID,
        idTerritory: customer.ID_Territory,
        newCustomerRequestStatus: customer.New_Customer_Request_Status,
        salesResponsible: customer.Sales_Responsible,
        salesRepresentative: customer.salesRepresentative,
        salesManager: customer.Sales_Manager,
        createdBy: customer.Created_By,
        street3: customer.street3,
        customerGroup15: customer.customer_group_15,
        totalLastYear: customer.Total_Last_Year,
        totalYTDCurrentYear: customer.Total_YTD_Current_Year,
        totalYTDLastYear: customer.Total_YTD_Last_Year,
        totalDifference: customer.Total_Difference,
        iceTotalLastYear: customer.ICE_Total_Last_Year,
        iceYTDCurrentYear: customer.Total_YTD_Current_Year,
        iceYTDLastYear: customer.ICE_YTD_Last_Year,
        iceDifference: customer.ICE_Difference,
        frozenBakeryTotalLastYear: customer.Frozen_Bakery_Total_Last_Year,
        frozenBakeryYTDCurrentYear: customer.Frozen_Bakery_YTD_Current_Year,
        frozenBakeryYTDLastYear: customer.Frozen_Bakery_YTD_Last_Year,
        frozenBakeryDifference: customer.Frozen_Bakery_Difference,
        frozenFoodTotalLastYear: customer.Frozen_Food_Total_Last_Year,
        frozenFoodYTDCurrentYear: customer.Frozen_Food_YTD_Current_Year,
        frozenFoodYTDLastYear: customer.Frozen_Food_YTD_Last_Year,
        frozenFoodDifference: customer.Frozen_Food_Difference,
        visitThreshold: customer.Visit_Threshold,
        delegated: customer.delegated,
        salesOrganization: customer.sales_organization,
        distributionChannel: customer.distribution_channel,
        sel: customer.Sel,
        industryCode: customer.Industry_Code,
      };
      return camelCaseResult;
    });

    return customers;
  }

  async searchOnlineCustomers(
    start: number,
    limit: number,
    customerType: string,
    filterObj: any,
  ) {
    try {
      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const languagesData = await LanguagesService.getLanguagesData();
      const languageIndex = languagesData.find(
        (languageData: any) =>
          languageData.language === employeeInfo[0].language,
      )?.indexLanguage;

      console.log('languageIndex :>> ', languageIndex);
      console.log('online start:>> ', start);
      console.log('customerType :>> ', customerType);
      console.log('filterObj in customer search service:>> ', filterObj);

      let customerTypeValue;

      if (customerType === CUSTOMER_TYPES.ALL) {
        customerTypeValue = '1';
      } else if (customerType === CUSTOMER_TYPES.CUSTOMERS) {
        customerTypeValue = '2';
      } else if (customerType === CUSTOMER_TYPES.PROSPECT) {
        customerTypeValue = '3';
      } else if (customerType === CUSTOMER_TYPES.DIRECT) {
        customerTypeValue = '4';
      } else {
        customerTypeValue = '5';
      }

      const headers = {
        'Content-Type': 'application/json',
      };

      let CUSTOMER_SEARCH_URL = 'customers/search';

      CUSTOMER_SEARCH_URL += `?pageNumber=${start}&pageSize=${limit}`;
      CUSTOMER_SEARCH_URL += `&customerType=${customerTypeValue}`;
      //activeCustomersOnly - 1 -> only active customers,
      //0 -> active +inactive customers
      CUSTOMER_SEARCH_URL += `&activeCustomersOnly=${
        filterObj.inActiveCustomerOnly ? '0' : '1'
      }`;
      CUSTOMER_SEARCH_URL += `&userLanguageIndex=${languageIndex}`;

      if (filterObj.multiSearchText.trim().length > 0) {
        CUSTOMER_SEARCH_URL += `&multipleSeacrhText=${filterObj.multiSearchText}`;
      }

      if (filterObj.name.trim().length > 0) {
        CUSTOMER_SEARCH_URL += `&name=${filterObj.name}`;
      }

      if (filterObj.address.trim().length > 0) {
        CUSTOMER_SEARCH_URL += `&address=${filterObj.address}`;
      }

      if (filterObj.postalCode.trim().length > 0) {
        CUSTOMER_SEARCH_URL += `&postalcode=${filterObj.postalCode}`;
      }

      if (filterObj.city.trim().length > 0) {
        CUSTOMER_SEARCH_URL += `&city=${filterObj.city}`;
      }

      if (filterObj.outlet.length > 0) {
        CUSTOMER_SEARCH_URL += `&outlet=${filterObj.outlet[0].idCustomerChannel}`;
      }

      // Required comma separated vaues
      if (filterObj.abcClassification.length > 0) {
        const abcClassifications = filterObj.abcClassification.map(
          (abcClassification: any) => abcClassification.abcClassification,
        );
        CUSTOMER_SEARCH_URL += `&abcClassification=${abcClassifications.join()}`;
      }

      if (filterObj.productGroup.length > 0) {
        CUSTOMER_SEARCH_URL += `&productGroup=${filterObj.productGroup[0].idTurnoverGroup}`;
      }

      // Required comma separated vaues
      if (filterObj.distributor.length > 0) {
        const distributorsId = filterObj.distributor.map(
          (distributorItem: any) => distributorItem.idDistributors,
        );
        CUSTOMER_SEARCH_URL += `&distributor=${distributorsId.join()}`;
      }

      if (filterObj.customerHierarchy.length > 0) {
        CUSTOMER_SEARCH_URL += `&customerHierarchy=${filterObj.customerHierarchy[0].customerHierL6}`;
      }

      if (filterObj.productMaterial.trim().length > 0) {
        CUSTOMER_SEARCH_URL += `&products=${filterObj.productMaterial}`;
      }

      if (filterObj.priority.length > 0) {
        CUSTOMER_SEARCH_URL += `&priority=${filterObj.priority[0].value}`;
      }

      if (filterObj.visitedFrom.length > 0) {
        const formattedVisitedFrom = formatDate(
          new Date(filterObj.visitedFrom),
        ).replace('-', '');
        CUSTOMER_SEARCH_URL += `&visitFrom=${formattedVisitedFrom}`;
      }

      if (filterObj.visitedTo.length > 0) {
        const formattedVisitedTo = formatDate(
          new Date(filterObj.visitedTo),
        ).replace('-', '');
        CUSTOMER_SEARCH_URL += `&visitTo=${formattedVisitedTo}`;
      }

      CUSTOMER_SEARCH_URL += `&scooping=${filterObj.scooping ? 1 : 0}`;
      CUSTOMER_SEARCH_URL += `&noLastVisit=${
        filterObj.isNoLastVisitDate ? 1 : 0
      }`;

      const BASE_API_URL = await this.getDefaultApiUrl();
      console.log('api url :>> ', BASE_API_URL + CUSTOMER_SEARCH_URL);

      const response = await ApiUtil.callGetApi(
        BASE_API_URL + CUSTOMER_SEARCH_URL,
        headers,
      );

      // console.log('API response :>> ', response);

      if (response?.response?.status || response?.request?.status === 0) {
        return {
          totalCount: 0,
          results: [],
        };
      }

      return {
        totalCount: response.total,
        results: response.data,
      };
    } catch (error) {
      console.log(
        '🚀 ~ file: CustomersService.ts:65 ~ CustomersService ~ error:',
        error,
      );
      return {
        totalCount: 0,
        results: [],
      };
    }
  }

  async getCustomerWholeSaleInfo() {
    return await this.getRepo().getCustomerWholeSaleInfo();
  }

  async getExistingCustomerData(
    prevCustomerShipTo: string,
    salesOrganization?: string,
    distributionChannel?: string,
  ) {
    return await this.getRepo().getExistingCustomerData(
      prevCustomerShipTo,
      salesOrganization,
      distributionChannel,
    );
  }

  /***
   * Function returns existing customer data from host
   *
   */
  async getExistingCustomerDataOnline(
    prevCustomerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const languagesData = await LanguagesService.getLanguagesData();

    const languageIndex = languagesData.find(
      (languageData: any) => languageData.language === employeeInfo[0].language,
    )?.indexLanguage;

    const BASE_API_URL = await this.getDefaultApiUrl();

    const PARAMETERS = `?customerNumber=${prevCustomerShipTo}&salesOrganization=${salesOrganization}&distributionChannel=${distributionChannel}&connectedUserLanguageIndex=${languageIndex}`;

    const URL = BASE_API_URL + END_POINTS.CUSTOMERS_CRM_DATA + PARAMETERS;
    console.log('CRM Data URL', URL);

    const response = await ApiUtil.callGetApi(URL);

    return response;
  }

  async getBasicAndContactDetails(
    prevCustomerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    return await this.getRepo().getBasicAndContactDetails(
      prevCustomerShipTo,
      salesOrganization,
      distributionChannel,
    );
  }

  async getCustomerInfoFromRedux() {
    return await this.getRepo().getCLCustomerInfo();
  }

  async getCustomerDetailsExpectedTurnoverAndEmployeeDetails() {
    return await this.getRepo().getCustomerDetailsExpectedTurnoverAndEmployeeDetails();
  }

  async getPLPCustomerShipToData() {
    return await this.getRepo().getPLPCustomerShipToData();
  }

  async getPLPCustomerAttibuteInfoData() {
    return await this.getRepo().getPLPCustomerAttibuteInfoData();
  }

  async getPLPSepaCustomerAgreementAvailableInfo() {
    return await this.getRepo().getPLPSepaCustomerAgreementAvailableInfo();
  }

  async getPLPSepaCustomerAgreementNotAvailableInfo() {
    return await this.getRepo().getPLPSepaCustomerAgreementNotAvailableInfo();
  }

  async getCustomerTerritoryInfo() {
    return await this.getRepo().getCustomerTerritoryInfo();
  }

  async getTradeAssetChargeOffData(agreementNumber: string) {
    return await this.getRepo().getTradeAssetChargeOffData(agreementNumber);
  }

  async getTaRequestCustomerPreviewData() {
    return await this.getRepo().getTaRequestCustomerPreviewData();
  }

  async checkIsRemoteCustomer(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    return await this.getRepo().checkIsRemoteCustomer(
      customerShipTo,
      salesOrganization,
      distributionChannel,
    );
  }

  async fetchCustomerInfo(customerShipTo: string) {
    return await this.getRepo().fetchCustomerInfo(customerShipTo);
  }

  async fetchCustomerDetail(
    customerShipTo: string,
    salesOrganisation: string,
    distributionChannel: string,
  ) {
    return await this.getRepo().fetchCustomerDetail(
      customerShipTo,
      salesOrganisation,
      distributionChannel,
    );
  }

  async fetchLanguageAndCountryCodeOfCustomer(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    return await this.getRepo().fetchLanguageAndCountryCodeOfCustomer(
      customerShipTo,
      salesOrganization,
      distributionChannel,
    );
  }
}
