import ApiUtil from 'src/services/ApiUtil';
import {AuthorizationsService} from 'src/services/AuthorizationsService';
import {CustomerHierarchiesShipToService} from 'src/services/CustomerHierarchiesShipToService';
import {CustomersRouteCustomerAssignmentService} from 'src/services/CustomersRouteCustomerAssignmentService';
import {CustomersService} from 'src/services/CustomersService';
import {DiscoveryConditionAgreementsService} from 'src/services/DiscoveryConditionAgreementsService';
import {DiscoveryContactsService} from 'src/services/DiscoveryContactsService';
import {DiscoveryControlsService} from 'src/services/DiscoveryControlsService';
import {DiscoveryCustomerAttributesService} from 'src/services/DiscoveryCustomerAttributesService';
import {DiscoveryFinancialDataService} from 'src/services/DiscoveryFinancialDataService';
import {DiscoveryListValuesService} from 'src/services/DiscoveryListValuesService';
import {DiscoveryPreviousOwnerTradeAssetsService} from 'src/services/DiscoveryPreviousOwnerTradeAssetsService';
import {DiscoveryRcaService} from 'src/services/DiscoveryRcaService';
import {DiscoverySepaService} from 'src/services/DiscoverySepaService';
import {DiscoveryService} from 'src/services/DiscoveryService';
import {EmployeesService} from 'src/services/EmployeesService';
import {ProspectsService} from 'src/services/ProspectsService';
import {SalesAreaService} from 'src/services/SalesAreaService';
import {SalesRepresentativesService} from 'src/services/SalesRepresentativesService';
import {TerritoriesSalesRepresentativesService} from 'src/services/TerritoriesSalesRepresentativesService';
import {TradeAssetsCustomersService} from 'src/services/TradeAssetsCustomersService';
import {getUUID} from 'src/utils/CommonUtil';
import {PROSPECT_STATUS_TITLE} from 'src/utils/Constant';
import {CREATE_PROSPECT_CONTROL_NAME} from 'src/utils/ControlName';
import {PROSPECTS_TYPE} from 'src/utils/DbConst';

class ProspectsController {
  private discoveryService: DiscoveryService;
  private employeesService: EmployeesService;
  private salesAreaService: SalesAreaService;
  private discoveryListValuesService: DiscoveryListValuesService;
  private customersService: CustomersService;
  private customerHierarchiesShipToService: CustomerHierarchiesShipToService;
  private salesRepresentativesService: SalesRepresentativesService;
  private authorizationsService: AuthorizationsService;
  private discoverySepaService: DiscoverySepaService;
  private discoveryConditionAgreementsService: DiscoveryConditionAgreementsService;
  private prospectsService: ProspectsService;
  private customersRouteCustomerAssignmentService: CustomersRouteCustomerAssignmentService;
  private tradeAssetsCustomersService: TradeAssetsCustomersService;
  private territoriesSalesRepresentativesService: TerritoriesSalesRepresentativesService;
  private discoveryPreviousOwnerTradeAssetsService: DiscoveryPreviousOwnerTradeAssetsService;
  private discoveryFinancialDataService: DiscoveryFinancialDataService;
  private discoveryCustomerAttributesService: DiscoveryCustomerAttributesService;
  private discoveryContactsService: DiscoveryContactsService;
  private discoveryRcaService: DiscoveryRcaService;
  private discoveryControlsService: DiscoveryControlsService;

  constructor() {
    this.discoveryService = new DiscoveryService();
    this.employeesService = new EmployeesService();
    this.salesAreaService = new SalesAreaService();
    this.discoveryListValuesService = new DiscoveryListValuesService();
    this.customersService = new CustomersService();
    this.customerHierarchiesShipToService =
      new CustomerHierarchiesShipToService();
    this.salesRepresentativesService = new SalesRepresentativesService();
    this.authorizationsService = new AuthorizationsService();
    this.discoverySepaService = new DiscoverySepaService();
    this.discoveryConditionAgreementsService =
      new DiscoveryConditionAgreementsService();
    this.prospectsService = new ProspectsService();
    this.customersRouteCustomerAssignmentService =
      new CustomersRouteCustomerAssignmentService();
    this.tradeAssetsCustomersService = new TradeAssetsCustomersService();
    this.territoriesSalesRepresentativesService =
      new TerritoriesSalesRepresentativesService();
    this.discoveryPreviousOwnerTradeAssetsService =
      new DiscoveryPreviousOwnerTradeAssetsService();
    this.discoveryFinancialDataService = new DiscoveryFinancialDataService();
    this.discoveryCustomerAttributesService =
      new DiscoveryCustomerAttributesService();
    this.discoveryContactsService = new DiscoveryContactsService();
    this.discoveryRcaService = new DiscoveryRcaService();
    this.discoveryControlsService = new DiscoveryControlsService();
  }

  async getProspects(
    start: number,
    limit: number,
    prospectMode: string,
    filterObj?: {
      showCustomers?: boolean;
      searchText?: string;
      name?: string;
      address?: string;
      postalCode?: string;
      city?: string;
      prospectNumber?: string;
      externalProspectNumber?: string;
      outlet?: any;
      priority?: string;
      createdFrom?: string;
      createdTill?: string;
      createdBy?: any;
      updatedBy?: any;
    },
  ) {
    const prospectsData = await this.discoveryService.getProspects(
      start,
      limit,
      prospectMode,
      filterObj,
    );

    if (prospectsData.results.length > 0) {
      if (prospectMode === PROSPECTS_TYPE.PARTIAL) {
        prospectsData.results = prospectsData.results.map((prospect: any) => ({
          ...prospect,
          newCustomerRequestStatus: PROSPECT_STATUS_TITLE.PARTIAL,
        }));
      }

      if (filterObj?.showCustomers) {
        prospectsData.results = prospectsData.results.map((prospect: any) => ({
          ...prospect,
          newCustomerRequestStatus: 'Customer',
        }));
      }
    }

    return prospectsData;
  }

  async getCreatedByAndUpdatedByEmployees(searchText: string = '') {
    const employeesData =
      await this.employeesService.getCreatedByAndUpdatedByEmployees(searchText);

    return employeesData;
  }

  // Function to pre populate the prospect data in edit mode
  async getProspectById(discoveryId: string) {
    const prospectData = await this.discoveryService.getProspectById(
      discoveryId,
    );

    return prospectData;
  }

  async deletePreviousOwnerTradeAsset(discoveryId: string) {
    const prospectData =
      await this.discoveryPreviousOwnerTradeAssetsService.deletePreviousOwnerTradeAsset(
        discoveryId,
      );

    return prospectData;
  }

  async getSalesArea() {
    const salesAreaDropdownData = await this.salesAreaService.getSalesArea();

    return salesAreaDropdownData;
  }

  async getCountries() {
    const countriesDropdownData =
      await this.discoveryListValuesService.getCountries();

    return countriesDropdownData;
  }

  async getCustomerHierarchies(
    salesOrganization: string,
    distributionChannel: string,
    searchText?: string,
  ) {
    const customerHierarchiesDropdownData =
      await this.customerHierarchiesShipToService.getCustomerHierarchies(
        salesOrganization,
        distributionChannel,
        searchText,
      );

    return customerHierarchiesDropdownData;
  }

  async getFSRData(searchText?: string) {
    const FSRDropdownData = await this.employeesService.getEmployeesList(
      searchText,
    );

    return FSRDropdownData;
  }

  async getExistingCustomerData(
    prevCustomerShipTo: string,
    salesOrganization?: string,
    distributionChannel?: string,
  ) {
    const customerData = await this.customersService.getExistingCustomerData(
      prevCustomerShipTo,
      salesOrganization,
      distributionChannel,
    );

    return customerData;
  }

  async getExistingCustomerDataOnline(
    prevCustomerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    const customerData =
      await this.customersService.getExistingCustomerDataOnline(
        prevCustomerShipTo,
        salesOrganization,
        distributionChannel,
      );

    return customerData;
  }

  async getPreviousCustomerEmployeeNumber(
    prevCustomerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    const prevCustomerEmployeeNumberData =
      await this.salesRepresentativesService.getPreviousCustomerEmployeeNumber(
        prevCustomerShipTo,
        salesOrganization,
        distributionChannel,
      );

    return prevCustomerEmployeeNumberData;
  }

  async getDeleteAccess() {
    let isAccess = false;

    const deleteAccessData = await this.authorizationsService.getDeleteAccess();

    if (deleteAccessData.length > 0) {
      const deleteAccess = deleteAccessData[0].typeAccess;
      if (deleteAccess === '2') {
        isAccess = true;
      } else {
        isAccess = false;
      }
    }

    return isAccess;
  }

  async deleteProspect(discoveryId: string) {
    // ** Checking sepa agreement
    const sepaAgreementData =
      await this.discoverySepaService.checkSepaAgreement(discoveryId);

    console.log('sepaAgreementData :>> ', sepaAgreementData);

    if (sepaAgreementData.length > 0) {
      return {
        isDeleted: false,
        message: 'msg.createprospect.sepa_signed',
      };
    }

    // ** Checking condition agreement
    const conditionAgreementData =
      await this.discoveryConditionAgreementsService.checkConditionAgreement(
        discoveryId,
      );

    console.log('conditionAgreementData :>> ', conditionAgreementData);

    if (conditionAgreementData.length > 0) {
      return {
        isDeleted: false,
        message: 'msg.createprospect.condition_agreed',
      };
    }

    // ** Checking customer request status
    const customerRequestStatusData =
      await this.discoveryService.checkCustomerRequestStatus(discoveryId);

    console.log('customerRequestStatusData :>> ', customerRequestStatusData);

    if (customerRequestStatusData.length > 0) {
      return {
        isDeleted: false,
        message: 'msg.createprospect.bo_validation',
      };
    }

    // ** Checking rework status
    const reworkStatusData = await this.discoveryService.checkReworkStatus(
      discoveryId,
    );

    console.log('reworkStatusData :>> ', reworkStatusData);

    if (reworkStatusData.length > 0) {
      return {
        isDeleted: false,
        message: 'msg.createprospect.prospect_rework',
      };
    }

    // ** Checking new customer creation request status
    const newCustomerCreationRequestStatusData =
      await this.discoveryService.checkNewCustomerCreationRequestStatus(
        discoveryId,
      );

    console.log(
      'newCustomerCreationRequestStatusData :>> ',
      newCustomerCreationRequestStatusData,
    );

    if (newCustomerCreationRequestStatusData.length > 0) {
      return {
        isDeleted: false,
        message: 'msg.createprospect.customer_creation_requested',
      };
    }

    // ** Checking completed status
    const completedStatusData =
      await this.discoveryService.checkCompletedStatus(discoveryId);

    console.log('completedStatusData :>> ', completedStatusData);

    if (completedStatusData.length > 0) {
      return {
        isDeleted: false,
        message: 'msg.createprospect.customer_creation_requested',
      };
    }

    // ** Deleting prospect
    const isProspectDeleted = await this.prospectsService.deleteProspect(
      discoveryId,
    );

    console.log('isProspectDeleted :>> ', isProspectDeleted);

    if (!isProspectDeleted) {
      return {
        isDeleted: false,
        message: 'msg.createprospect.something_went_wrong',
      };
    }

    return {
      isDeleted: true,
      message: 'msg.createprospect.prospect_deleted',
    };
  }

  async updateNotInterested(discoveryId: string, isInterested: boolean) {
    const isInterestUpdated = await this.discoveryService.updateNotInterested(
      discoveryId,
      isInterested,
    );

    return isInterestUpdated;
  }

  async getBasicAndContactDetails(
    prevCustomerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    const basicAndContactDetails =
      await this.customersService.getBasicAndContactDetails(
        prevCustomerShipTo,
        salesOrganization,
        distributionChannel,
      );

    return basicAndContactDetails;
  }

  async getCallsAndDeliveriesInformation(prevCustomerShipTo: string) {
    const callsAndDeliveriesInformation =
      await this.customersRouteCustomerAssignmentService.getCallsAndDeliveriesInformation(
        prevCustomerShipTo,
      );

    return callsAndDeliveriesInformation;
  }

  async getAlternativeDeliveryInformation(prevCustomerShipTo: string) {
    const alternativeAndDeliveryInformation =
      await this.customersRouteCustomerAssignmentService.getAlternativeDeliveryInformation(
        prevCustomerShipTo,
      );

    return alternativeAndDeliveryInformation;
  }

  async getPreviousCustomerTradeAssets(
    prevCustomerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    const previousCustomerTradeAssetsDetails =
      await this.tradeAssetsCustomersService.getTradeAssets(
        prevCustomerShipTo,
        salesOrganization,
        distributionChannel,
      );

    return previousCustomerTradeAssetsDetails;
  }

  async getTerritoryInformation(employeeNumber: string) {
    const territoryInformation =
      await this.territoriesSalesRepresentativesService.findLoggedInEmployeeTerritoryInfo(
        employeeNumber,
      );

    return territoryInformation;
  }

  async getCanvasserInformation(employeeNumber: string) {
    const canvasserInformation =
      await this.salesRepresentativesService.getCanvasser(employeeNumber);

    return canvasserInformation;
  }

  async getCanvasserSalesRep() {
    const canvasserInformation =
      await this.salesRepresentativesService.getCanvasserSalesRep();

    return canvasserInformation;
  }

  async updateProspect(
    discoveryId: string,
    prospectData: any,
    territoryInformationData: any,
    basicAndContactDetailsData: any,
    previousCustomerTAData: any,
    callsAndDeliveriesInformationData: any,
    alternativeAndDeliveryInformationData: any,
    previousCustomerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    const isDiscoveryUpdated =
      await this.discoveryService.updateProspectModification(discoveryId);

    if (!isDiscoveryUpdated) {
      return false;
    }

    const updateProspectData = {
      ...prospectData,
      idTerritory:
        territoryInformationData.length > 0
          ? territoryInformationData[0].idTerritory
          : '',
      previousCustomerShipTo,
      salesOrganization,
      distributionChannel,
    };

    const isProspectUpdated = await this.prospectsService.updateProspectData(
      discoveryId,
      updateProspectData,
    );

    console.log('isProspectUpdated :>> ', isProspectUpdated);

    if (!isProspectUpdated) {
      return false;
    }

    const isBasicAndContactDetailsUpdated =
      await this.discoveryFinancialDataService.saveOrUpdateDiscoveryFinancialData(
        previousCustomerShipTo,
        discoveryId,
        prospectData,
        basicAndContactDetailsData,
      );

    console.log(
      'isBasicAndContactDetailsUpdated :>> ',
      isBasicAndContactDetailsUpdated,
    );

    if (!isBasicAndContactDetailsUpdated) {
      return false;
    }

    if (previousCustomerTAData.length > 0) {
      const isPreviousOwnerTradeAssetDeleted =
        await this.deletePreviousOwnerTradeAsset(discoveryId);

      if (!isPreviousOwnerTradeAssetDeleted) {
        return false;
      }

      const isPreviousOwnerTradeAssetAdded =
        await this.discoveryPreviousOwnerTradeAssetsService.insertPreviousOwnerTradeAsset(
          previousCustomerShipTo,
          discoveryId,
          previousCustomerTAData,
        );

      if (!isPreviousOwnerTradeAssetAdded) {
        return false;
      }
    }

    if (previousCustomerShipTo !== '') {
      const isDiscoveryCustomerAttributesCreated =
        await this.discoveryContactsService.saveCreateProspectDiscoveryContactsInfo(
          discoveryId,
          basicAndContactDetailsData,
        );

      if (!isDiscoveryCustomerAttributesCreated) {
        return false;
      }

      const isDiscoveryRcaCreated =
        await this.discoveryRcaService.saveCreateProspectDiscoveryRcaInfo(
          discoveryId,
          callsAndDeliveriesInformationData,
          alternativeAndDeliveryInformationData,
        );

      if (!isDiscoveryRcaCreated) {
        return false;
      }
    }

    return true;
  }

  async createProspect(
    prospectData: any,
    territoryInformationData: any,
    basicAndContactDetailsData: any,
    previousCustomerTAData: any,
    canvasserInformationData: any,
    callsAndDeliveriesInformationData: any,
    alternativeAndDeliveryInformationData: any,
    previousCustomerShipTo: any,
  ) {
    const discoveryId = getUUID();
    console.log('discoveryId :>> ', discoveryId);

    const isDiscoveryCreated =
      await this.discoveryService.insertProspectDiscoveryData(
        discoveryId,
        prospectData,
      );

    if (!isDiscoveryCreated) {
      return false;
    }

    const isProspectCreated = await this.prospectsService.saveProspectData(
      discoveryId,
      prospectData,
      territoryInformationData,
      basicAndContactDetailsData,
    );

    if (!isProspectCreated) {
      return false;
    }

    const isDiscoveryCustomerAttributesCreated =
      await this.discoveryCustomerAttributesService.saveCreateProspectDiscoveryCustomerAttributeInfo(
        previousCustomerShipTo,
        discoveryId,
        canvasserInformationData,
        basicAndContactDetailsData,
      );

    if (!isDiscoveryCustomerAttributesCreated) {
      return false;
    }

    const isDiscoveryFinancialDataCreated =
      await this.discoveryFinancialDataService.saveOrUpdateDiscoveryFinancialData(
        previousCustomerShipTo,
        discoveryId,
        prospectData,
        basicAndContactDetailsData,
      );

    if (!isDiscoveryFinancialDataCreated) {
      return false;
    }

    if (previousCustomerShipTo !== '') {
      const isDiscoveryCustomerAttributesCreated =
        await this.discoveryContactsService.saveCreateProspectDiscoveryContactsInfo(
          discoveryId,
          basicAndContactDetailsData,
        );

      if (!isDiscoveryCustomerAttributesCreated) {
        return false;
      }

      const isDiscoveryRcaCreated =
        await this.discoveryRcaService.saveCreateProspectDiscoveryRcaInfo(
          discoveryId,
          callsAndDeliveriesInformationData,
          alternativeAndDeliveryInformationData,
        );

      if (!isDiscoveryRcaCreated) {
        return false;
      }

      if (previousCustomerTAData.length > 0) {
        const isPreviousOwnerTradeAssetAdded =
          await this.discoveryPreviousOwnerTradeAssetsService.insertPreviousOwnerTradeAsset(
            previousCustomerShipTo,
            discoveryId,
            previousCustomerTAData,
          );

        if (!isPreviousOwnerTradeAssetAdded) {
          return false;
        }
      }
    }

    return true;
  }

  async createOrUpdateProspect(
    isUpdate: boolean,
    previousCustomerShipTo: string,
    discoveryId: string,
    prospectData: any,
  ) {
    const [salesOrganization, distributionChannel] =
      prospectData.salesArea.split('-');

    let basicAndContactDetailsData = [];
    let callsAndDeliveriesInformationData = [];
    let alternativeAndDeliveryInformationData = [];
    let previousCustomerTAData = [];
    let customerDataFromHost: any = [];

    if (previousCustomerShipTo !== '') {
      const customerData = await this.getExistingCustomerData(
        previousCustomerShipTo,
        salesOrganization,
        distributionChannel,
      );

      if (customerData.length === 0) {
        const isOnline = await ApiUtil.getAppDeviceOnlineStatus();
        if (isOnline) {
          const customerDataOnline = await this.getExistingCustomerDataOnline(
            previousCustomerShipTo,
            salesOrganization,
            distributionChannel,
          );

          const prospectDetailsData = customerDataOnline
            ? customerDataOnline?.prospectDetailsData
            : null;

          if (!prospectDetailsData) {
            return {
              success: false,
              message: 'msg.createprospect.customer_not_present',
            };
          }

          customerDataFromHost = [customerDataOnline];
        } else {
          return {
            success: false,
            message: 'msg.createprospect.customer_not_present',
          };
        }
      }

      basicAndContactDetailsData = await this.getBasicAndContactDetails(
        previousCustomerShipTo,
        salesOrganization,
        distributionChannel,
      );

      callsAndDeliveriesInformationData =
        await this.getCallsAndDeliveriesInformation(previousCustomerShipTo);

      alternativeAndDeliveryInformationData =
        await this.getAlternativeDeliveryInformation(previousCustomerShipTo);

      previousCustomerTAData = await this.getPreviousCustomerTradeAssets(
        previousCustomerShipTo,
        salesOrganization,
        distributionChannel,
      );

      if (
        basicAndContactDetailsData.length === 0 &&
        callsAndDeliveriesInformationData.length === 0 &&
        alternativeAndDeliveryInformationData.length === 0 &&
        previousCustomerTAData.length === 0
      ) {
        if (customerDataFromHost.length > 0) {
          const customerDataObj = customerDataFromHost[0];

          basicAndContactDetailsData = [
            customerDataObj.basicAndContactDetailsData,
          ];

          if (customerDataObj?.rcaData && customerDataObj.rcaData.length > 0) {
            const filteredCallsAndDeliveriesInformationData =
              customerDataObj.rcaData.filter((rca: any) => rca.type === 'T');
            const filteredAlternativeDeliveryInformationData =
              customerDataObj.rcaData.filter((rca: any) => rca.type === 'R');

            callsAndDeliveriesInformationData =
              filteredCallsAndDeliveriesInformationData;
            alternativeAndDeliveryInformationData =
              filteredAlternativeDeliveryInformationData;
          } else {
            callsAndDeliveriesInformationData = [];
            alternativeAndDeliveryInformationData = [];
          }

          previousCustomerTAData = customerDataObj.crmTradeAssetsData;
        } else {
          return {
            success: false,
            message: 'msg.createprospect.customer_not_present',
          };
        }
      }

      console.log(
        'basicAndContactDetailsData :>> ',
        basicAndContactDetailsData,
      );
      console.log(
        'callsAndDeliveriesInformationData :>> ',
        callsAndDeliveriesInformationData,
      );
      console.log(
        'alternativeAndDeliveryInformationData :>> ',
        alternativeAndDeliveryInformationData,
      );
      console.log('previousCustomerTAData :>> ', previousCustomerTAData);
    }

    let territoryInformationData = [];
    if (prospectData.employeeName !== '') {
      territoryInformationData = await this.getTerritoryInformation(
        prospectData.employeeName,
      );
    } else {
      // pass connected user id territory, if employee is not selected
      territoryInformationData =
        await this.employeesService.getLoggedInEmployeeTerritoryInfo();
    }

    console.log('territoryInformationData :>> ', territoryInformationData);

    const canvasserInformationData = await this.getCanvasserInformation(
      prospectData.employeeName,
    );

    console.log('canvasserInformationData :>> ', canvasserInformationData);

    if (isUpdate) {
      return await this.updateProspect(
        discoveryId,
        prospectData,
        territoryInformationData,
        basicAndContactDetailsData,
        previousCustomerTAData,
        callsAndDeliveriesInformationData,
        alternativeAndDeliveryInformationData,
        previousCustomerShipTo,
        salesOrganization,
        distributionChannel,
      );
    } else {
      return await this.createProspect(
        {
          ...prospectData,
          previousCustomerShipTo,
          salesOrganization,
          distributionChannel,
        },
        territoryInformationData,
        basicAndContactDetailsData,
        previousCustomerTAData,
        canvasserInformationData,
        callsAndDeliveriesInformationData,
        alternativeAndDeliveryInformationData,
        previousCustomerShipTo,
      );
    }
  }
  async getMandatoryFieldsConfig() {
    const previousShipToNo =
      await this.discoveryControlsService.getControlMandatoryValue(
        CREATE_PROSPECT_CONTROL_NAME.TXT_PREVIOUS_CUSTOMER_SHIP_TO,
      );
    const name = await this.discoveryControlsService.getControlMandatoryValue(
      CREATE_PROSPECT_CONTROL_NAME.TXT_NAME,
    );
    const address =
      await this.discoveryControlsService.getControlMandatoryValue(
        CREATE_PROSPECT_CONTROL_NAME.TXT_ADDRESS,
      );
    const phoneNumber =
      await this.discoveryControlsService.getControlMandatoryValue(
        CREATE_PROSPECT_CONTROL_NAME.TXT_PHONENUMBER,
      );
    const streetNo =
      await this.discoveryControlsService.getControlMandatoryValue(
        CREATE_PROSPECT_CONTROL_NAME.TXT_STREET,
      );
    const zipCode =
      await this.discoveryControlsService.getControlMandatoryValue(
        CREATE_PROSPECT_CONTROL_NAME.TXT_ZIPCODE,
      );
    const city = await this.discoveryControlsService.getControlMandatoryValue(
      CREATE_PROSPECT_CONTROL_NAME.TXT_CITY,
    );
    const country =
      await this.discoveryControlsService.getControlMandatoryValue(
        CREATE_PROSPECT_CONTROL_NAME.DDL_COUNTRY,
      );
    const customerHierarchy =
      await this.discoveryControlsService.getControlMandatoryValue(
        CREATE_PROSPECT_CONTROL_NAME.DDL_CUSTOMER_HIERARCHY,
      );

    const outlet = await this.discoveryControlsService.getControlMandatoryValue(
      CREATE_PROSPECT_CONTROL_NAME.DDL_OUTLET,
    );

    const iceCreamBulk =
      await this.discoveryControlsService.getControlMandatoryValue(
        CREATE_PROSPECT_CONTROL_NAME.TXT_ICE_CREAM_BULK,
      );
    const iceCreamImpluse =
      await this.discoveryControlsService.getControlMandatoryValue(
        CREATE_PROSPECT_CONTROL_NAME.TXT_ICE_CREAM_IMPLUSE,
      );
    const FrozenFood =
      await this.discoveryControlsService.getControlMandatoryValue(
        CREATE_PROSPECT_CONTROL_NAME.TXT_FROZEN_FOOD,
      );

    return {
      previousShipToNo: previousShipToNo,
      name: name,
      address: address,
      phoneNumber: phoneNumber,
      streetNo: streetNo,
      zipCode: zipCode,
      city: city,
      country: country,
      customerHierarchy: customerHierarchy,
      outlet: outlet,
      iceCreamBulk: iceCreamBulk,
      iceCreamImpluse: iceCreamImpluse,
      frozenFood: FrozenFood,
    };
  }
}
export default new ProspectsController();
