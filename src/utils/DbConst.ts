import {Q} from '@nozbe/watermelondb';

// Conditions
export const Q_EQ = Q.eq;
export const Q_GT = Q.gt;
export const Q_GTE = Q.gte;
export const Q_LT = Q.lt;
export const Q_LTE = Q.lte;
export const Q_NOTEQ = Q.notEq;
export const Q_ONEOF = Q.oneOf;

//
export const VISITS_CALL_STATUS = {
  INITIAL: '0',
  OPEN: '1',
  ORDER: '2',
  NO_ORDER: '3',
  FINISHED: '4',
  CLOSED: '5',
  ONHOLD: '8',
};

export const PROSPECTS_TYPE = {
  INITIAL: '0',
  NEW_CUSTOMER_REQUESTED: '1', // Prospects which are requested for new customer
  NOT_INTERESTED: '4', // Not interested
  BACK_OFFICE_VALIDATION: '5', //Sent for Back office validation
  REWORK: '6', // Prospects rejected by back office
  COMPLETED: '2', // Prospects which are completed
  PARTIAL: '3', //Prospects which are partially completed
  ALL: '7',
  // PROSPECT_BECOME_CUSTOMER: '8', // Prospect become customer
};

export const TASK_TYPE = {
  TASKS_TYPE_STANDARD: '0',
  TASKS_TYPE_RECURRENT: '1',
};

export const TASK_CATEGORY = {
  TASK_CATEGORY_QUESTIONNAIRE: 0,
  TASK_CATEGORY_SALESINFORMATION: 1,
};
export const TASK_EXECUTION = {
  TASK_EXECUTION_STATUS_INITIAL: 0,
  TASK_EXECUTION_STATUS_INPROGRESS: 1,
  TASK_EXECUTION_STATUS_COMPLETED: 2,
};

export const QUESTION_TYPES = {
  QUESTION_TYPE_COMBO_BOX: '1',
  QUESTION_TYPE_CHECK_BOX: '2',
  QUESTION_TYPE_LOGICAL: '3',
  QUESTION_TYPE_NUMERIC: '4',
  QUESTION_TYPE_DATE: '5',
  QUESTION_TYPE_RADIO_BUTTON: '6',
  QUESTION_TYPE_TEXT: '7',
  QUESTION_TYPE_MULTIMEDIA: '8',
  QUESTION_TYPE_PRODUCT: '9',
  QUESTION_TYPE_SALES_INFORMATION: '10',
};

export const STATUS_TYPES = {
  CUSTOMER: 'C',
  PROSPECT: 'P',
  DELEGATED: '0',
};

export const CUSTOMER_GROUP_15_TYPES = {
  EMPTY: '',
  SY: 'SY',
  PY: 'PY',
};

export const CALL_TYPE = {
  INBOUND: 'I',
  OUTBOUND: 'O',
  EXTERNAL: 'E',
};

export const SERVICE_REQUEST = {
  SERVICE_REQUEST_ALL: '0',
  SERVICE_REQUEST_OPEN: '1',
  SERVICE_REQUEST_IN_PROGRESS: '2',
  SERVICE_REQUEST_COMPLETED: '3',
  SERVICE_REQUEST_OPEN_AND_IN_PROGRESS: '4',
};

export const TASK_STATUS = {
  TASK_STATUS_INITIAL: 0,
  TASK_STATUS_PUBLISHED: 1,
  TASK_STATUS_DELETED: 2,
};

export const TURNOVER_GROUPS = {
  ICE_CREAM: '1',
  FROZEN_FOOD: '2',
  FROZEN_BAKERY: '3',
  PASTA_AND_PIZZA: '4',
  CATS: '5',
  DOGS: '6',
  AGENT_SALES: '7',
};

export const CUSTOMER_TYPE = {
  CUSTOMER: '1',
  PROSPECT: '2',
  AUTRE: '3',
};

export const CALL_CATEGORY = {
  CALLS: '1',
  VISITS: '2',
};

export const PRICE_GROUP_TYPE = {
  PRICE_GROUP: 1,
  CUSTOMER_PRICE_GROUP: 2,
};

export const ALLOCATION_TYPE = {
  NON_ALLOCATED: '0',
  MANUAL_ALLOCATION: '1',
  TRANSIT_ALLOCATION: '2',
  AUTOMATIC_ALLOCATION: '3',
  INBOUND: '4',
  VISIT: '5',
};

export const REQUESTED_AGREEMENT_TYPE = {
  SEPA: '1',
  CONDITIONS: '2',
  LOAN_AGREEMENT: '3',
  CHARGE_OFF_AGREEMENT: '4',
};

export const YAMBS_WORKFLOW_STATUS_TYPE = {
  NOT_REQUESTED: '0',
  REQUESTED: '1',
  COMPLETED: '2',
  NOT_REQUIRED: '3',
};

export const ACTIVITY_TYPE = {
  EMAIL: 1,
  TRADE_ASSET_INSTALL_ORDER: 3,
  TRADE_ASSET_PICKUP_ORDER: 4,
  SERVICE_WORKFLOW_REQUEST: 5,
  RETURN_ORDER: 6,
  FOOD_ORDER_CREATE: 7,
  REQUEST_EXEMPTION: 8,
  POSM_INSTALL_ORDER: 9,
  POSM_PICKUP_ORDER: 10,
  FOOD_ORDER_CHANGE: 11,
  SAMPLE_TRADE_AND_CONSUMER: 12,
};

export const EMPLOYEE_CATEGORY = {
  OTHERS: '0',
  TELESALES: '1',
  FIELDSALES: '2',
};

export const SERVICE_REQUEST_JOURNAL_STATUS = {
  CREATION: '1',
  ASSIGNMENT: '2',
  UPDATE: '3',
  COMPLETION: '4',
  CLAIM_DATA_UPDATED: '5',
};

export const CLAIMS_MATERIAL_TYPES = {
  UNDELIVERED_PRODUCTS: '1',
  INSTEAD_DELIVERED_PRODUCTS: '2',
  TA_MATERIALS: '3',
  FREE_GOODS: '4',
  ICE_PRODUCTS: '5',
  BLOCKED_PRODUCTS: '6',
};
