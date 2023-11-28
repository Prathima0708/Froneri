import {Q} from '@nozbe/watermelondb';
import BaseRepo from './BaseRepo';
import QuestionAnswers from 'src/storage/OfflineDBStorage/WmDB/models/QuestionAnswers';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {
  QUESTION_TYPES,
  TASK_CATEGORY,
  TASK_EXECUTION,
  TASK_TYPE,
} from 'src/utils/DbConst';

const ENTITY = OFFLINE_STORAGE.MODEL.QUESTION_ANSWERS;

export class QuestionAnswersRepo extends BaseRepo<QuestionAnswers> {
  /**
   * Function returns count of brochure files which are uploaded
   * @returns
   */
  async getSalesMaterialBrochureCount() {
    const collection = this.getCollection(ENTITY);
    const questionTypeSalesInfo =
      QUESTION_TYPES.QUESTION_TYPE_SALES_INFORMATION;
    const taskExecutionStatusCompleted =
      TASK_EXECUTION.TASK_EXECUTION_STATUS_COMPLETED;

    const tasksTypeRecurrent = TASK_TYPE.TASKS_TYPE_RECURRENT;
    const tasksCategorySalesInfo = TASK_CATEGORY.TASK_CATEGORY_SALESINFORMATION;

    let results = await collection
      .query(
        Q.unsafeSqlQuery(
          'select qa.answer_description_language_1 from question_answers qa ' +
            'inner join task_questions tq on qa.id_question = tq.id_question ' +
            'inner join questions q on tq.id_question = q.id_question ' +
            'inner join tasks t on tq.id_task = t.id_task ' +
            'left join task_execution te on t.id_task = te.id_task ' +
            'where strftime("%Y%m%d", "now") between strftime("%Y%m%d", t.valid_from_datetime) and strftime("%Y%m%d", t.valid_to_datetime) ' +
            'and ( q.question_type = ? and ' +
            '( te.status <> ? or te.status is null) ' +
            'or (te.status = ? and q.question_type = ? ' +
            'and t.type = ? ) ) ' +
            'or t.category = ?',
          [
            questionTypeSalesInfo,
            taskExecutionStatusCompleted,
            taskExecutionStatusCompleted,
            questionTypeSalesInfo,
            tasksTypeRecurrent,
            tasksCategorySalesInfo,
          ],
        ),
      )
      .unsafeFetchRaw();

    return results.length;
  }

  /**
   * Function returns count of all sales material files that are uploaded to central server
   * @returns
   */
  async getSalesMaterialFileCount(
    customerShipTo: string,
    salesOrganization: string,
    distributionChannel: string,
  ) {
    const collection = this.getCollection(ENTITY);
    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const idSalesTeam =
      employeeInfo.length > 0 ? employeeInfo[0].idSalesTeam : '';

    const QUERY =
      'select distinct qa.url_sales_material from question_answers qa ' +
      'inner join task_questions tq on qa.id_question = tq.id_question ' +
      'inner join questions q on tq.id_question = q.id_question ' +
      'inner join tasks t on tq.id_task = t.id_task ' +
      'left join task_execution te on t.id_task = te.id_task ' +
      'left join task_employees on t.id_task = task_employees.id_task ' +
      'left join task_sales_teams on t.id_task = task_sales_teams.id_task ' +
      'left join task_customer_hierarchy on t.id_task = task_customer_hierarchy.id_task ' +
      'left join customer_hierarchies_ship_to on (customer_hierarchies_ship_to.customer_hier_l1 = task_customer_hierarchy.customer_hierarchy_node ' +
      'or customer_hierarchies_ship_to.customer_hier_l2 = task_customer_hierarchy.customer_hierarchy_node ' +
      'or customer_hierarchies_ship_to.customer_hier_l3 = task_customer_hierarchy.customer_hierarchy_node ' +
      'or customer_hierarchies_ship_to.customer_hier_l4 = task_customer_hierarchy.customer_hierarchy_node ' +
      'or customer_hierarchies_ship_to.customer_hier_l5 = task_customer_hierarchy.customer_hierarchy_node ' +
      'or customer_hierarchies_ship_to.customer_hier_l6 = task_customer_hierarchy.customer_hierarchy_node ' +
      'or customer_hierarchies_ship_to.customer_ship_to = task_customer_hierarchy.customer_hierarchy_node) ' +
      'and task_customer_hierarchy.sales_organization = customer_hierarchies_ship_to.sales_organization ' +
      "where strftime('%Y%m%d', 'now') BETWEEN strftime('%Y%m%d', t.valid_from_datetime) AND strftime('%Y%m%d', t.valid_to_datetime) " +
      "and t.category = '1' and ( q.question_type = '10' and ( te.status <> '2' or te.status is null) " +
      "or ( te.status = '2' and q.question_type = '10' and t.type = '1' ) ) and (( " +
      `customer_hierarchies_ship_to.customer_ship_to = '${customerShipTo}' ` +
      `and customer_hierarchies_ship_to.sales_organization = '${salesOrganization}' ` +
      `and customer_hierarchies_ship_to.distribution_channel = '${distributionChannel}' ` +
      `and ( task_employees.employee_number = '${employeeNo}' ` +
      `or task_sales_teams.id_sales_team = '1')) or (( task_employees.employee_number = '${employeeNo}' ` +
      `or task_sales_teams.id_sales_team = '${idSalesTeam}' ` +
      ') and customer_hierarchies_ship_to.customer_ship_to is null))';

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();
    return results.length;
  }
}
