import BaseRepo from './BaseRepo';
import Tasks from 'src/storage/OfflineDBStorage/WmDB/models/Tasks';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import {getISOTodaysEndDate, getISOTodaysStartDate} from 'src/utils/CommonUtil';
import {TASK_CATEGORY, TASK_STATUS, TASK_TYPE} from 'src/utils/DbConst';

const ENTITY = OFFLINE_STORAGE.MODEL.TASKS;

export class TasksRepo extends BaseRepo<Tasks> {
  /**
   * Function returns Open Task of the customers for whom visit is planned today
   * @returns
   */
  async getValidOpenTasks() {
    const tasksCollection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const delegatedEmployeeInfo = await this.getLoggedInDelegatedEmployeeInfo();
    const delegatedEmployeeNo =
      delegatedEmployeeInfo.length > 0
        ? delegatedEmployeeInfo[0].employeeNumber
        : employeeNo;
    let results = await tasksCollection
      .query(
        Q.unsafeSqlQuery(
          'select distinct tasks.id_task as task_count from calls ' +
            'inner join customer_hierarchies_ship_to ' +
            'on calls.customer_ship_to = customer_hierarchies_ship_to.customer_ship_to ' +
            'and calls.sales_organization = customer_hierarchies_ship_to.sales_organization ' +
            'and calls.distribution_channel = customer_hierarchies_ship_to.distribution_channel ' +
            'inner join task_customer_hierarchy ' +
            'on (customer_hierarchies_ship_to.customer_hier_l1 = task_customer_hierarchy.customer_hierarchy_node ' +
            'or customer_hierarchies_ship_to.customer_hier_l2 = task_customer_hierarchy.customer_hierarchy_node ' +
            'or customer_hierarchies_ship_to.customer_hier_l3 = task_customer_hierarchy.customer_hierarchy_node ' +
            'or customer_hierarchies_ship_to.customer_hier_l4 = task_customer_hierarchy.customer_hierarchy_node ' +
            'or customer_hierarchies_ship_to.customer_hier_l5 = task_customer_hierarchy.customer_hierarchy_node ' +
            'or customer_hierarchies_ship_to.customer_hier_l6 = task_customer_hierarchy.customer_hierarchy_node ' +
            'or customer_hierarchies_ship_to.customer_ship_to = task_customer_hierarchy.customer_hierarchy_node) ' +
            'and task_customer_hierarchy.sales_organization = customer_hierarchies_ship_to.sales_organization ' +
            'inner join tasks on tasks.id_task = task_customer_hierarchy.id_task ' +
            'left join task_employees on tasks.id_task = task_employees.id_task ' +
            'left join task_sales_teams on tasks.id_task = task_sales_teams.id_task ' +
            'left join task_execution on tasks.id_task = task_execution.id_task ' +
            'and task_execution.customer_ship_to = customer_hierarchies_ship_to.customer_ship_to ' +
            'and task_execution.sales_organization = customer_hierarchies_ship_to.sales_organization ' +
            'and task_execution.distribution_channel = customer_hierarchies_ship_to.distribution_channel ' +
            'where tasks.category = "0" and tasks.status = "1" ' +
            "and strftime('%Y%m%d', 'now') BETWEEN strftime('%Y%m%d', valid_from_datetime) AND strftime('%Y%m%d', valid_to_datetime) " +
            'and ( 1 = case when tasks.type = "0" and task_execution.id_task_execution is not null ' +
            `then 0 else 1 end ) and ( task_employees.employee_number = '${employeeNo}' ` +
            'or task_sales_teams.id_sales_team = "1") and call_category= "2" and deleted <> "1" ' +
            'and calls.customer_ship_to <> "0000000000" ' +
            `and calls.employee_number in ('${employeeNo}', '${delegatedEmployeeNo}') ` +
            "and strftime('%Y%m%d', call_from_datetime) = strftime('%Y%m%d', 'now') " +
            "and call_status in ('0', '1','8') ",
        ),
      )
      .unsafeFetchRaw();

    return results.length;
  }

  /**
   * Function returns Number of Tasks executed by connected user today
   * @returns
   */
  async getCompletedTasks() {
    const tasksCollection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const salesRepInfo = await this.getLoggedInSalesRepInfo();
    const salesRepEmpNo =
      salesRepInfo.length > 0 ? salesRepInfo[0].employeeNumber : '';

    let results = await tasksCollection
      .query(
        Q.unsafeSqlQuery(
          'select task_execution.id_task_execution from tasks ' +
            'inner join task_execution on tasks.id_task = task_execution.id_task ' +
            'left join task_employees on tasks.id_task = task_employees.id_task ' +
            'left join task_sales_teams on tasks.id_task = task_sales_teams.id_task ' +
            'left join employees on task_execution.executed_employee_number = employees.employee_number ' +
            'left join task_employee_objectives on tasks.id_task = task_employee_objectives.id_task ' +
            'where tasks.category = "0" and tasks.status = "1" and ' +
            'strftime("%Y%m%d", "now") between strftime("%Y%m%d", valid_from_datetime) and strftime("%Y%m%d", valid_to_datetime) ' +
            'and (task_employees.employee_number = ? or task_sales_teams.id_sales_team = ?) ' +
            'and task_execution.status <> "1" ' +
            'and strftime("%Y%m%d", executed_datetime) = strftime("%Y%m%d", "now")',
          [employeeNo, salesRepEmpNo],
        ),
      )
      .unsafeFetchRaw();

    return results.length;
  }

  /**
   * Function returns Number of Tasks assigned to selected customer + tasks assigned to selected employee
   * @returns
   */
  async getTasksListing(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    const tasksCollection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const idSalesTeam =
      employeeInfo.length > 0 ? employeeInfo[0].idSalesTeam : '';
    const taskType = TASK_TYPE.TASKS_TYPE_STANDARD;
    const taskCategoryQuestionnaire = TASK_CATEGORY.TASK_CATEGORY_QUESTIONNAIRE;
    const taskStatusPublished = TASK_STATUS.TASK_STATUS_PUBLISHED;
    let results = await tasksCollection
      .query(
        Q.unsafeSqlQuery(
          'select count(distinct tasks.id_task) as openTaskCount from tasks ' +
            'left join task_employees on tasks.id_task = task_employees.id_task ' +
            'left join task_sales_teams on tasks.id_task = task_sales_teams.id_task ' +
            'left join task_customer_hierarchy on tasks.id_task = task_customer_hierarchy.id_task ' +
            'left join customer_hierarchies_ship_to on (customer_hierarchies_ship_to.customer_hier_l1 = task_customer_hierarchy.customer_hierarchy_node ' +
            'or customer_hierarchies_ship_to.customer_hier_l2 = task_customer_hierarchy.customer_hierarchy_node ' +
            'or customer_hierarchies_ship_to.customer_hier_l3 = task_customer_hierarchy.customer_hierarchy_node ' +
            'or customer_hierarchies_ship_to.customer_hier_l4 = task_customer_hierarchy.customer_hierarchy_node ' +
            'or customer_hierarchies_ship_to.customer_hier_l5 = task_customer_hierarchy.customer_hierarchy_node ' +
            'or customer_hierarchies_ship_to.customer_hier_l6 = task_customer_hierarchy.customer_hierarchy_node ' +
            'or customer_hierarchies_ship_to.customer_ship_to = task_customer_hierarchy.customer_hierarchy_node) ' +
            'and task_customer_hierarchy.sales_organization = customer_hierarchies_ship_to.sales_organization ' +
            'left join task_execution on tasks.id_task = task_execution.id_task ' +
            `and task_execution.customer_ship_to = '${customerShipTo}' ` +
            `and task_execution.sales_organization = '${salesOrganization}' ` +
            `and task_execution.distribution_channel = '${distributionChannel}' ` +
            'left join task_employee_objectives on tasks.id_task = task_employee_objectives.id_task ' +
            `where tasks.category = '${taskCategoryQuestionnaire}' ` +
            `and tasks.status = '${taskStatusPublished}' ` +
            "and strftime('%Y%m%d', 'now') BETWEEN strftime('%Y%m%d', valid_from_datetime) AND strftime('%Y%m%d', valid_to_datetime) " +
            `and (1 = case when tasks.type = '${taskType}' and task_execution.id_task_execution is not null ` +
            `then 0 else 1 end ) and ( ( customer_hierarchies_ship_to.customer_ship_to = '${customerShipTo}' ` +
            `and customer_hierarchies_ship_to.sales_organization = '${salesOrganization}' ` +
            `and customer_hierarchies_ship_to.distribution_channel = '${distributionChannel}' ` +
            `and ( task_employees.employee_number = '${employeeNo}' ` +
            `or task_sales_teams.id_sales_team = '${idSalesTeam}' ) or ` +
            `(( task_employees.employee_number = '${employeeNo}' or task_sales_teams.id_sales_team = '${idSalesTeam}' ) ` +
            'and customer_hierarchies_ship_to.customer_ship_to is null)) and ' +
            "strftime('%Y%m%d', tasks.creation_datetime) <> strftime('%Y%m%d', 'now')) ",
        ),
      )
      .unsafeFetchRaw();
      
    if (results.length > 0) {
      return results[0].openTaskCount;
    }
    return 0;
  }
}
