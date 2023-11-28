import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {ProspectsRepo} from 'src/repo/ProspectsRepo';
import Prospects from 'src/storage/OfflineDBStorage/WmDB/models/Prospects';

export class ProspectsService extends BaseApiService<Prospects, ProspectsRepo> {
  private readonly prospectsRepository: ProspectsRepo = new ProspectsRepo();

  getRepo(): ProspectsRepo {
    return this.prospectsRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.PROSPECTS;
  }

  async deleteProspect(discoveryId: string) {
    return await this.getRepo().deleteProspect(discoveryId);
  }

  async updateProspectData(discoveryId: string, prospectData: any) {
    return await this.getRepo().updateProspectData(discoveryId, prospectData);
  }

  async saveProspectData(
    discoveryId: string,
    prospectData: any,
    prospectIdTerritory: any,
    previousCustomerBasicInfoData: any,
  ) {
    return await this.getRepo().saveProspectData(
      discoveryId,
      prospectData,
      prospectIdTerritory,
      previousCustomerBasicInfoData,
    );
  }

  async getProspectInfo() {
    return await this.getRepo().getProspectInfo();
  }

  async storeCustomerDataInProspects(
    discoveryId: string,
    salesOrganization: string,
    distributionChannel: string,
    industryCode: string,
  ) {
    return await this.getRepo().storeCustomerDataInProspects(
      discoveryId,
      salesOrganization,
      distributionChannel,
      industryCode,
    );
  }

  async getPLPProspectShipToData() {
    return await this.getRepo().getPLPProspectShipToData();
  }

  async updatePLPProspectShipToData(data: any) {
    return await this.getRepo().updatePLPProspectShipToData(data);
  }

  async getPLPSepAgreementNotAvailableInfo() {
    return await this.getRepo().getPLPSepAgreementNotAvailableInfo();
  }

  async getPLPSepaProspectsAgreementAvailableInfo() {
    return await this.getRepo().getPLPSepaProspectsAgreementAvailableInfo();
  }

  async getPreviousCustomerDetails() {
    return await this.getRepo().getPreviousCustomerDetails();
  }

  async updateReactivateField() {
    return await this.getRepo().updateReactivateField();
  }

  async getTaRequestProspectAgreementPreview() {
    return await this.getRepo().getTaRequestProspectAgreementPreview();
  }

  async getProspectCountryCode() {
    return await this.getRepo().getProspectCountryCode();
  }

  async getCustomerCountryCode() {
    return await this.getRepo().getCustomerCountryCode();
  }

  async fetchLanguageAndCountryCodeOfProspect(discoveryId: string) {
    return await this.getRepo().fetchLanguageAndCountryCodeOfProspect(
      discoveryId,
    );
  }
}
