import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import Tasks from 'src/storage/OfflineDBStorage/WmDB/models/Tasks';
import {TasksRepo} from 'src/repo/TasksRepo';
import {END_POINTS} from 'src/utils/ApiEndpoints';
import ApiUtil from './ApiUtil';

export class TasksService extends BaseApiService<Tasks, TasksRepo> {
  private readonly tasksRepository: TasksRepo = new TasksRepo();

  getRepo(): TasksRepo {
    return this.tasksRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.TASKS;
  }

  async getValidOpenTasks() {
    return await this.getRepo().getValidOpenTasks();
  }

  async getCompletedTasks() {
    return await this.getRepo().getCompletedTasks();
  }

  async getTasksListing(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    return await this.getRepo().getTasksListing(
      customerShipTo,
      salesOrganization,
      distributionChannel,
    );
  }

  async getTasksListingOnline(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const idSalesTeam =
      employeeInfo.length > 0 ? employeeInfo[0].idSalesTeam : '';

    const PARAMETERS = `?customerNumber=${customerShipTo}&salesOrganization=${salesOrganization}&distributionChannel=${distributionChannel}&connectedUserNumber=${employeeNo}&idSalesTeam=${idSalesTeam}`;
    // const PARAMETERS = `?customerNumber=0020391839&salesOrganization=DE09&distributionChannel=02&connectedUserNumber=0000000051&idSalesTeam=1`;
    const BASE_API_URL = await this.getDefaultApiUrl();
    const URL = BASE_API_URL + END_POINTS.TASKS_COUNT + PARAMETERS;

    const response = await ApiUtil.callGetApi(URL);

    return response.openTaskCount;
  }
}
