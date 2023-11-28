import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import CustomersIndustryCodes from 'src/storage/OfflineDBStorage/WmDB/models/CustomersIndustryCodes';
import {CustomersIndustryCodesRepo} from 'src/repo/CustomersIndustryCodesRepo';

export class CustomersIndustryCodesService extends BaseApiService<
  CustomersIndustryCodes,
  CustomersIndustryCodesRepo
> {
  private readonly CustomersIndustryCodesRepository: CustomersIndustryCodesRepo =
    new CustomersIndustryCodesRepo();

  getRepo(): CustomersIndustryCodesRepo {
    return this.CustomersIndustryCodesRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.CUSTOMERS_INDUSTRY_CODES;
  }

  async getOutletClassification(value: string) {
    return await this.getRepo().getOutletClassification(value);
  }

  async getCustomerIndustryCodeChannelDescription() {
    return await this.getRepo().getCustomerIndustryCodeChannelDescription();
  }
}
