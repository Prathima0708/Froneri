import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import Discovery from 'src/storage/OfflineDBStorage/WmDB/models/Discovery';
import {DiscoveryRepo} from 'src/repo/DiscoveryRepo';

export class DiscoveryService extends BaseApiService<Discovery, DiscoveryRepo> {
  private readonly discoveryRepository: DiscoveryRepo = new DiscoveryRepo();

  getRepo(): DiscoveryRepo {
    return this.discoveryRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.DISCOVERY;
  }

  async getActiveProspects() {
    return await this.getRepo().getActiveProspects();
  }

  async getProspectNewCustomerRequestVisit() {
    return await this.getRepo().getProspectNewCustomerRequestVisit();
  }

  async getProspects(
    start: number,
    limit: number,
    prospectMode: string,
    filterObj: any,
  ) {
    return await this.getRepo().getProspects(
      start,
      limit,
      prospectMode,
      filterObj,
    );
  }

  async getProspectById(discoveryId: string) {
    return await this.getRepo().getProspectById(discoveryId);
  }

  async checkCustomerRequestStatus(discoveryId: string) {
    return await this.getRepo().checkCustomerRequestStatus(discoveryId);
  }

  async checkReworkStatus(discoveryId: string) {
    return await this.getRepo().checkReworkStatus(discoveryId);
  }

  async checkNewCustomerCreationRequestStatus(discoveryId: string) {
    return await this.getRepo().checkNewCustomerCreationRequestStatus(
      discoveryId,
    );
  }

  async checkCompletedStatus(discoveryId: string) {
    return await this.getRepo().checkCompletedStatus(discoveryId);
  }

  async updateNotInterested(discoveryId: string, isInterested: boolean) {
    return await this.getRepo().updateNotInterested(discoveryId, isInterested);
  }

  async updateProspectModification(discoveryId: string) {
    return await this.getRepo().updateProspectModification(discoveryId);
  }

  async insertProspectDiscoveryData(discoveryId: string, prospectData: any) {
    return await this.getRepo().insertProspectDiscoveryData(
      discoveryId,
      prospectData,
    );
  }

  async getProspectDetailsExpectedTurnoverAndEmployeeDetails() {
    return await this.getRepo().getProspectDetailsExpectedTurnoverAndEmployeeDetails();
  }

  async storeCustomerDataInDiscovery(
    discoveryId: string,
    customerShipTo: string,
  ) {
    return await this.getRepo().storeCustomerDataInDiscovery(
      discoveryId,
      customerShipTo,
    );
  }

  async getSRNotes() {
    return await this.getRepo().getSRNotes();
  }

  async getPLPProspectBillToData() {
    return await this.getRepo().getPLPProspectBillToData();
  }

  async updateProspectBillToDiscoveryInfo(data: any) {
    return await this.getRepo().updateProspectBillToDiscoveryInfo(data);
  }

  async getPLPProspectDeliveryAddressData() {
    return await this.getRepo().getPLPProspectDeliveryAddressData();
  }

  async updateProspectDeliveryAddressInfo(data: any) {
    return await this.getRepo().updateProspectDeliveryAddressInfo(data);
  }

  async getCustomerFinancialInfo() {
    return await this.getRepo().getCustomerFinancialInfo();
  }

  async updateProspectDiscoveryInfo(data: any) {
    return await this.getRepo().updateProspectDiscoveryInfo(data);
  }
  async updateSRNotes(notes: string) {
    return await this.getRepo().updateSRNotes(notes);
  }
  async updateSepaOverwriteInfo() {
    return await this.getRepo().updateSepaOverwriteInfo();
  }

  async updateNewCustomerRequestStatus() {
    return await this.getRepo().updateNewCustomerRequestStatus();
  }

  async getTradeAssetWishPreviewData(agreementNumber: string) {
    return await this.getRepo().getTradeAssetWishPreviewData(agreementNumber);
  }

  async getTradeAssetTakeOverPreviewData(agreementNumber: string) {
    return await this.getRepo().getTradeAssetTakeOverPreviewData(
      agreementNumber,
    );
  }

  async checkIsRemoteProspect(customerShipTo: string) {
    return await this.getRepo().checkIsRemoteProspect(customerShipTo);
  }

  async checkIsProspectDataExist(discoveryId: string) {
    return await this.getRepo().checkIsProspectDataExist(discoveryId);
  }
}
