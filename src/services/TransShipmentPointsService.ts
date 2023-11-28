import BaseApiService from './BaseApiService';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import TransShipmentPoints from 'src/storage/OfflineDBStorage/WmDB/models/TransShipmentPoints';
import {TransShipmentPointsRepo} from 'src/repo/TransShipmentPointsRepo';

export class TransShipmentPointsService extends BaseApiService<
  TransShipmentPoints,
  TransShipmentPointsRepo
> {
  private readonly transShipmentPointsRepo: TransShipmentPointsRepo =
    new TransShipmentPointsRepo();

  getRepo(): TransShipmentPointsRepo {
    return this.transShipmentPointsRepo;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.TSP_ROUTES;
  }

  async getTSPLevelCutOffTime(deliveryPlantNo: string) {
    return await this.getRepo().getTSPLevelCutOffTime(deliveryPlantNo);
  }

  async getPlantDescriptionOfCustomer(pickingPlantNumber: string) {
    return await this.getRepo().getPlantDescriptionOfCustomer(
      pickingPlantNumber,
    );
  }
}
