import BaseApiService from './BaseApiService';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import OrdersAggregated from 'src/storage/OfflineDBStorage/WmDB/models/OrdersAggregated';
import {OrdersAggregatedRepo} from 'src/repo/OrdersAggregatedRepo';
import {END_POINTS} from 'src/utils/ApiEndpoints';
import ApiUtil from './ApiUtil';

export class OrdersAggregatedService extends BaseApiService<
  OrdersAggregated,
  OrdersAggregatedRepo
> {
  private readonly ordersAggregatedRepo: OrdersAggregatedRepo =
    new OrdersAggregatedRepo();

  getRepo(): OrdersAggregatedRepo {
    return this.ordersAggregatedRepo;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.ORDERS_AGGREGATED;
  }

  async getTurnoverSummary() {
    return await this.getRepo().getTurnoverSummary();
  }

  async getTurnoverSummaryOnline() {
    const customerInfo: any = await this.getRepo().getCLCustomerInfo();
    const customerShipTo = customerInfo.customerShipTo
      ? customerInfo.customerShipTo
      : '';

    const PARAMETERS = `?customerNumber=${customerShipTo}`;
    // const PARAMETERS = `?customerNumber=0020304216`;
    const BASE_API_URL = await this.getDefaultApiUrl();

    const URL = BASE_API_URL + END_POINTS.AGGREGATE + PARAMETERS;

    const response = await ApiUtil.callGetApi(URL);

    console.log('Turnover summary URL :>> ', URL);

    return response;
  }
}
