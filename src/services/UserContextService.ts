import {store} from 'src/store';
import {
  updateUserContext,
  updateLocale,
  updateFlightModeState,
  updateIsDeviceOnlineState,
} from 'src/reducers/UserContextSlice';
import {EmployeesService} from './EmployeesService';
import {SalesRepresentativesService} from './SalesRepresentativesService';
import * as RNLocalize from 'react-native-localize';
import {TerritoriesSalesRepresentativesService} from './TerritoriesSalesRepresentativesService';
import {TerritoriesHierarchyService} from './TerritoriesHierarchyService';

export class UserContextService {
  private employeesApiService: EmployeesService;
  private salesRepApiService: SalesRepresentativesService;
  private employeeTerritoryApiService: TerritoriesSalesRepresentativesService;
  private territoriesHierarchyService: TerritoriesHierarchyService;

  constructor() {
    this.employeesApiService = new EmployeesService();
    this.salesRepApiService = new SalesRepresentativesService();
    this.employeeTerritoryApiService =
      new TerritoriesSalesRepresentativesService();
    this.territoriesHierarchyService = new TerritoriesHierarchyService();
  }

  /**
   * Fetch LoggedIn User -> Employee Obj, SalesRep Obj, Delegated Employee Obj, Employee Territory Obj
   * and store in Global Store to access the obj across all the screen
   */
  async updateUserContext() {
    let employeeObj = await this.employeesApiService.findLoggedInEmployeeInfo();
    let salesRepObj = [];
    let delegatedEmpObj = [];
    let employeeTerritoryObj = [];
    let allTerritroyOfConnectedUserObj = [];
    let delegatedEmployeeIdTerritoryObj = [];
    let employeeDelegatedTerritoryStr = '';

    if (employeeObj.length > 0) {
      const employeeNumber = employeeObj[0].employeeNumber;
      salesRepObj = await this.salesRepApiService.findLoggedInSalesRepInfo(
        employeeNumber,
      );

      delegatedEmpObj =
        await this.employeesApiService.findLoggedInDelegatedEmployeeInfo(
          employeeNumber,
        );

      // call employee territory function

      employeeTerritoryObj =
        await this.employeeTerritoryApiService.findLoggedInEmployeeTerritoryInfo(
          employeeNumber,
        );

      /**
       * find all the territories of the connected user
       * Suppose connected user is sales manager they can see
       * all the customers under the hierarchy
       */

      if (employeeTerritoryObj.length > 0) {
        const idTerritory = employeeTerritoryObj[0].idTerritory;
        allTerritroyOfConnectedUserObj =
          await this.territoriesHierarchyService.getConnectedUserAllTerritories(
            idTerritory,
          );
        if (allTerritroyOfConnectedUserObj) {
          const idList = [
            ...employeeTerritoryObj,
            ...allTerritroyOfConnectedUserObj,
          ].map(item => `"${item.idTerritory}"`);
          employeeDelegatedTerritoryStr = idList.join(', ');
        } else {
          const idList = [...employeeTerritoryObj].map(
            item => `"${item.idTerritory}"`,
          );
          employeeDelegatedTerritoryStr = idList.join(', ');
        }
      }

      // call employee territory function
      // delegatedEmployeeIdTerritoryObj =
      //   await this.employeeTerritoryApiService.findLoggedInEmployeeTerritoryInfo(
      //     employeeNumber,
      //   );

      delegatedEmployeeIdTerritoryObj =
        await this.salesRepApiService.getDelegatedUserIdTerritory(
          employeeNumber,
        );
      if (delegatedEmployeeIdTerritoryObj.length > 0) {
        const idList = [...delegatedEmployeeIdTerritoryObj].map(
          item => `"${item.idTerritory}"`,
        );
        const delegatedTerritoryStr = idList.join(', ');
        employeeDelegatedTerritoryStr =
          employeeDelegatedTerritoryStr + ', ' + delegatedTerritoryStr;
      }
    }

    console.log('the employeeObj', employeeObj);
    console.log('the salesRepObj', salesRepObj);
    console.log('the delegatedEmpObj', delegatedEmpObj);
    console.log('the employeeTerritoryObj', employeeTerritoryObj);
    console.log(
      'the delegatedEmployeeTerritoryObj',
      delegatedEmployeeIdTerritoryObj,
    );
    console.log(
      'the employeeDelegatedTerritoryStr',
      employeeDelegatedTerritoryStr,
    );

    // update values to redux store
    store.dispatch(
      updateUserContext({
        employee: employeeObj.length != 0 ? employeeObj : [],
        salesRep: salesRepObj.length != 0 ? salesRepObj : [],
        delegatedEmployee: delegatedEmpObj.length != 0 ? delegatedEmpObj : [],
        employeeTerritory:
          employeeTerritoryObj.length != 0 ? employeeTerritoryObj : [],
        delegatedEmployeeIdTerritory:
          delegatedEmployeeIdTerritoryObj.length != 0
            ? delegatedEmployeeIdTerritoryObj
            : [],
        employeeDelegatedTerritoryStr: employeeDelegatedTerritoryStr,
      }),
    );
  }

  /**
   * Update User Locale
   */
  async updateLocaleIntoReduxStore() {
    const locales = RNLocalize.getLocales();
    const timeZone = RNLocalize.getTimeZone();
    const currency = RNLocalize.getCurrencies();
    let locale = 'en';
    if (locales && locales.length > 0) {
      locale = locales[0].languageCode;
    }

    // update values to redux store
    store.dispatch(
      updateLocale({
        locale: locale,
        timeZone: timeZone,
        currency: currency[0] ? currency[0] : 'EUR',
      }),
    );
  }

  /**
   * Update User Locale
   */
  async updateFlightModeIntoReduxStore() {
    const isFlightModeEnabled =
      store.getState().userContext.isFlightModeEnabled;

    // update values to redux store
    store.dispatch(
      updateFlightModeState({
        isFlightModeEnabled: !isFlightModeEnabled,
      }),
    );
  }

  /**
   * Update User Locale
   */
  updateDeviceOnlineStateIntoReduxStore(isConnected: boolean) {
    // update values to redux store
    store.dispatch(
      updateIsDeviceOnlineState({
        isDeviceOnline: isConnected,
      }),
    );
  }
}

export default new UserContextService();
