import BaseApiService from './BaseApiService';
import Activities from 'src/storage/OfflineDBStorage/WmDB/models/Activities';
import {ActivitiesRepo} from 'src/repo/ActivitiesRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';

export class ActivitiesService extends BaseApiService<
  Activities,
  ActivitiesRepo
> {
  private readonly activitiesRepository: ActivitiesRepo = new ActivitiesRepo();

  getRepo(): ActivitiesRepo {
    return this.activitiesRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.ACTIVITIES;
  }

  async create(entity: any): Promise<Activities> {
    // Implement Business logic
    // await this.validateEntity(entity);

    return await this.save(entity);
  }

  async updateEntity(entity: object): Promise<Activities> {
    // Implement Business logic
    await this.validateEntity(entity);
    return await this.update(entity);
  }

  async fetchAll(start: number, limit: number): Promise<Activities> {
    // Pass Query
    return await this.findAll([], start, limit);
  }

  async findByIdFromDB(id: string): Promise<Activities> {
    return await this.findById(id);
  }

  async dropTable(): Promise<void> {
    return await this.drop();
  }

  async deleteById(id: string) {
    return await this.delete(id);
  }

  async insertTaRequestCustomerJournal(
    tradeAssetId: string,
    customerNumber: string,
  ) {
    return await this.getRepo().insertTaRequestCustomerJournal(
      tradeAssetId,
      customerNumber,
    );
  }

  async insertOrUpdateServiceWorkflowActivities(serviceWorkflowData: any) {
    return await this.getRepo().insertOrUpdateServiceWorkflowActivities(
      serviceWorkflowData,
    );
  }
}
