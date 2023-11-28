import BaseApiService from './BaseApiService';

import {OFFLINE_STORAGE} from 'src/storage/Storage';
import EmployeesObjectives from 'src/storage/OfflineDBStorage/WmDB/models/EmployeesObjectives';
import {EmployeesObjectivesRepo} from 'src/repo/EmployeesObjectivesRepo';

export class EmployeesObjectivesService extends BaseApiService<
  EmployeesObjectives,
  EmployeesObjectivesRepo
> {
  private readonly employeesObjectivesRepository: EmployeesObjectivesRepo =
    new EmployeesObjectivesRepo();

  getRepo(): EmployeesObjectivesRepo {
    return this.employeesObjectivesRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.EMPLOYEES_OBJECTIVES;
  }

  async getEmployeesObjectives() {
    return await this.getRepo().getEmployeesObjectives();
  }

  async getEmployeeObjective(idEmployeeObjective: string) {
    return await this.getRepo().getEmployeeObjective(idEmployeeObjective);
  }

  async getStandardDuration(statusType: string) {
    return await this.getRepo().getStandardDuration(statusType);
  }
}
