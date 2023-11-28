import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import Calls from 'src/storage/OfflineDBStorage/WmDB/models/Calls';
import {CallsRepo} from 'src/repo/CallsRepo';
import ApiUtil from './ApiUtil';
import {END_POINTS} from 'src/utils/ApiEndpoints';
import LanguagesService from './LanguagesService';

export class CallsService extends BaseApiService<Calls, CallsRepo> {
  private readonly callsRepository: CallsRepo = new CallsRepo();

  getRepo(): CallsRepo {
    return this.callsRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CALLS;
  }

  async getMissedVisitAgenda(start: number, limit: number) {
    return await this.getRepo().getMissedVisitAgenda(start, limit);
  }

  async getOpenVisits() {
    return await this.getRepo().getOpenVisits();
  }

  async getCustomersToVisitToday() {
    return await this.getRepo().getCustomersToVisitToday();
  }

  async getDelegatedCustomersVisit() {
    return await this.getRepo().getDelegatedCustomersVisit();
  }

  async getDelegatedProspectsVisit() {
    return await this.getRepo().getDelegatedProspectsVisit();
  }

  async getProspectsToVisitToday() {
    return await this.getRepo().getProspectsToVisitToday();
  }

  async getVisitAgenda(startDate: string, endDate: string) {
    return await this.getRepo().getVisitAgenda(startDate, endDate);
  }

  async updateStartVisit(idCall: string) {
    return await this.getRepo().updateStartVisit(idCall);
  }

  async updateDeleteVisit(idCall: string) {
    return await this.getRepo().updateDeleteVisit(idCall);
  }

  async updateEditVisit(obj: string) {
    return await this.getRepo().updateEditVisit(obj);
  }

  async createNewVisit(allVisits: any) {
    console.log('allVisits :>> ', allVisits);
    const database = OFFLINE_STORAGE.getDB();

    await database.write(async () => {
      const preparedVisits = await Promise.all(
        allVisits.map(async (visit: any) =>
          this.getRepo().createNewVisit(
            visit.customerInfo,
            visit.callFromDateTime,
            visit.callToDateTime,
            visit.preferedCallTime,
          ),
        ),
      );

      await database.batch(preparedVisits);
    });
  }

  async getUpcomingVisits(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
    idCall?: string,
  ) {
    return await this.getRepo().getUpcomingVisits(
      customerShipTo,
      salesOrganization,
      distributionChannel,
      idCall,
    );
  }

  async getUpcomingVisitOnline(customerShipTo: string) {
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const languagesData = await LanguagesService.getLanguagesData();
    const languageIndex = languagesData.find(
      (languageData: any) => languageData.language === employeeInfo[0].language,
    )?.indexLanguage;

    const PARAMETERS = `?customerNumber=${customerShipTo}&connectedUserLanguageIndex=${languageIndex}`;
    // const PARAMETERS = `?customerNumber=0020348494&connectedUserLanguageIndex=2`;
    const BASE_API_URL = await this.getDefaultApiUrl();
    const URL = BASE_API_URL + END_POINTS.UPCOMING_VISITS + PARAMETERS;

    console.log('Upcoming visit URL :>> ', URL);

    const response = await ApiUtil.callGetApi(URL);

    return response;
  }

  async pauseVisit(callPlaceNumber: string, idCall: string) {
    return await this.getRepo().pauseVisit(callPlaceNumber, idCall);
  }

  async resumeVisit(idCall: string) {
    return await this.getRepo().updateResumeVisit(idCall);
  }

  async getOrderLinkWithFinishVisit(idCall: string) {
    return await this.getRepo().getOrderLinkWithFinishVisit(idCall);
  }

  async finishVisit(idCall: string) {
    return await this.getRepo().finishVisit(idCall);
  }

  async getNextTenFutureVisits() {
    return await this.getRepo().getNextTenFutureVisits();
  }

  async getNextTenFutureVisitsOnline() {
    const customerInfo: any = await this.getRepo().getCLCustomerInfo();
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';
    const salesOrganization = customerInfo.salesOrganization
      ? customerInfo.salesOrganization
      : '';
    const distributionChannel = customerInfo.distributionChannel
      ? customerInfo.distributionChannel
      : '';
    const PARAMETERS = `?customerNumber=${customerShipTo}&salesOrganization=${salesOrganization}&distributionChannel=${distributionChannel}`;
    // const PARAMETERS = `?customerNumber=0020309061&salesOrganization=DE09&distributionChannel=02`
    const BASE_API_URL = await this.getDefaultApiUrl();

    const URL = BASE_API_URL + END_POINTS.FUTURE_VISITS + PARAMETERS;

    const response = await ApiUtil.callGetApi(URL);

    return response;
  }

  async getLatestTwoVisitNotes() {
    return await this.getRepo().getLatestTwoVisitNotes();
  }

  async getLatestTwoVisitNotesOnline() {
    const customerInfo: any = await this.getCLCustomerInfo();
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';
    const salesOrganization = customerInfo.salesOrganization
      ? customerInfo.salesOrganization
      : '';
    const distributionChannel = customerInfo.distributionChannel
      ? customerInfo.distributionChannel
      : '';
    const PARAMETERS = `?customerNumber=${customerShipTo}&salesOrganization=${salesOrganization}&distributionChannel=${distributionChannel}`;
    const BASE_API_URL = await this.getDefaultApiUrl();
    const URL = BASE_API_URL + END_POINTS.LAST_VISITS + PARAMETERS;

    const response = await ApiUtil.callGetApi(URL);

    return response;
  }

  async getLastVisitInfo(idCall: string) {
    return await this.getRepo().getLastVisitInfo(idCall);
  }

  async getVisitFromIdCall(idCall: string, isProspect: boolean) {
    return await this.getRepo().getVisitFromIdCall(idCall, isProspect);
  }

  async getLastVisitInfoOnline(idCall: string) {
    const customerInfo: any = await this.getRepo().getCLCustomerInfo();
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const languagesData = await LanguagesService.getLanguagesData();
    const languageIndex = languagesData.find(
      (languageData: any) => languageData.language === employeeInfo[0].language,
    )?.indexLanguage;
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';
    const salesOrganization = customerInfo.salesOrganization
      ? customerInfo.salesOrganization
      : '';
    const distributionChannel = customerInfo.distributionChannel
      ? customerInfo.distributionChannel
      : '';

    const PARAMETERS = `?customerNumber=${customerShipTo}&salesOrganization=${salesOrganization}&distributionChannel=${distributionChannel}&connectedUserLanguageIndex=${languageIndex}&idCall=${idCall}`;
    // const PARAMETERS = `customerNumber=0020305475&salesOrganization=DE09&distributionChannel=02&connectedUserLanguageIndex=1&idCall=06D7BA0A814F41E58BC02D1BFF72047D`;
    const BASE_API_URL = await this.getDefaultApiUrl();
    const URL = BASE_API_URL + END_POINTS.HISTORICAL_VISITS + PARAMETERS;
    console.log('Histroical URL API CALLEd', URL);
    const response = await ApiUtil.callGetApi(URL);

    return response;
  }

  async getUpcomingVisitForProspect() {
    return await this.getRepo().getUpcomingVisitForProspect();
  }

  async create(entity: any): Promise<Calls> {
    // Implement Business logic
    // await this.validateEntity(entity);

    return await this.save(entity);
  }

  async updateEntity(entity: object): Promise<Calls> {
    // Implement Business logic
    await this.validateEntity(entity);
    return await this.update(entity);
  }

  async fetchAll(start: number, limit: number): Promise<Calls> {
    // Pass Query
    return await this.findAll([], start, limit);
  }

  async findByIdFromDB(id: string): Promise<Calls> {
    return await this.findById(id);
  }

  async dropTable(): Promise<void> {
    return await this.drop();
  }

  async deleteById(id: string) {
    return await this.delete(id);
  }
}
