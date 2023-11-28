import BaseApiService from './BaseApiService';
import Employees from 'src/storage/OfflineDBStorage/WmDB/models/Employees';
import {EmployeesRepo} from 'src/repo/EmployeesRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';

export class EmployeesService extends BaseApiService<Employees, EmployeesRepo> {
  private readonly employeesRepository: EmployeesRepo = new EmployeesRepo();

  getRepo(): EmployeesRepo {
    return this.employeesRepository;
  }

  getCollectionName(): string {
    return OFFLINE_STORAGE.MODEL.ACTIVITIES;
  }

  async findLoggedInEmployeeInfo() {
    let loggedInUserMailId = await this.getUserInfo();
    return await this.getRepo().findLoggedInEmployeeInfo(
      loggedInUserMailId.emailId,
    );
  }

  async findLoggedInDelegatedEmployeeInfo(employeeNumber: string) {
    return await this.getRepo().findLoggedInDelegatedEmployeeInfo(
      employeeNumber,
    );
  }

  async getEmployeeInfoBasedOnEmployeeId(employeeNo: string) {
    return await this.getRepo().getEmployeeInfoBasedOnEmployeeId(employeeNo);
  }

  async findAndUpdateUserData(userInfo: any) {
    return await this.getRepo().findAndUpdateUserData(userInfo);
  }

  async getCreatedByAndUpdatedByEmployees(searchText?: string) {
    return await this.getRepo().getCreatedByAndUpdatedByEmployees(searchText);
  }

  async getEmployeesList(searchText?: string) {
    return await this.getRepo().getEmployeesList(searchText);
  }

  async getResponsiblePersonAndCreatorList(searchText: string = '') {
    return await this.getRepo().getResponsiblePersonAndCreatorList(searchText);
  }

  async create(entity: any): Promise<Employees> {
    // Implement Business logic
    // await this.validateEntity(entity);

    return await this.save(entity);
  }

  async updateEntity(entity: object): Promise<Employees> {
    // Implement Business logic
    await this.validateEntity(entity);
    return await this.update(entity);
  }

  async fetchAll(start: number, limit: number): Promise<Employees> {
    // Pass Query
    return await this.findAll([], start, limit);
  }

  async findByIdFromDB(id: string): Promise<Employees> {
    return await this.findById(id);
  }

  async dropTable(): Promise<void> {
    return await this.drop();
  }

  async deleteById(id: string) {
    return await this.delete(id);
  }
}

export default new EmployeesService();
