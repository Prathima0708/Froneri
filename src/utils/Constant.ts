export const PRIMARY = 'primary';

export const INPUT_STYLE_TYPE = {
  PRIMARY: 'PRIMARY',
  SECONDARY: 'SECONDARY',
  TERTIARY: 'TERTIARY',
};

export const DATE_PICKER_STYLE_TYPE = {
  PRIMARY: 'PRIMARY',
  SECONDARY: 'SECONDARY',
};

export const DROP_DOWN_STYLE_TYPE = {
  PRIMARY: 'PRIMARY',
  SECONDARY: 'SECONDARY',
};

export const CHECKBOX_STYLE_TYPE = {
  PRIMARY: 'PRIMARY',
  SECONDARY: 'SECONDARY',
};

export const BUTTON_STYLE_TYPE = {
  PRIMARY: 'PRIMARY',
  SECONDARY: 'SECONDARY',
};
export const LANGUAGES = {
  ENGLISH: 'en',
  FRENCH: 'fr',
  ITALIAN: 'it',
  HEBREW: 'he',
};
export const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
};
export const DRAWER_LABELS = {
  HOME: 'label.general.home',
  VISITS: 'label.general.visits',
  SERVICE_WORKFLOW: 'label.general.service_workflow',
  TASKS: 'label.general.tasks',
  CUSTOMERS: 'label.general.customers',
  PROSPECTS: 'label.general.prospects',
  DELEGATION: 'label.general.delegation',
  PRODUCTS: 'label.general.products',
  SALES_MATERIALS: 'label.general.sales_materials',
  HELP: 'label.general.help',
};

export const VISIT_TYPES = {
  PLANNED: '0',
  ADHOC: '1',
  PHONE: '2',
};

export const VISIT_STATUS = {
  OPEN: 'label.general.open',
  PAUSED: 'label.general.paused',
  COMPLETED: 'label.general.completed',
  MISSED: 'label.general.missed',
};

export const DELIVERY_MISTAKES_CLAIM = {
  PRODUCT_DETAILS: 'Product Details',
  CLAIMS_SETTLEMENTS: 'Claims Settlements',
};

export const CUSTOMER_TYPES = {
  ALL: 'label.general.all',
  CUSTOMERS: 'label.general.customers',
  PROSPECT: 'label.general.prospects',
  DIRECT: 'label.customersearch.direct_customers',
  INDIRECT: 'label.customersearch.indirect_customers',
};

export const SERVICE_WORKFLOW = {
  TODO: 'To Do',
  OPEN: 'Open',
  INPROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};
export const TASKS = {
  ALL: 'All',
  OPEN: 'Open',
  INPROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

export const VISIT_CALENDAR_STATUS = {
  ALL: 'label.general.all',
  MINE: 'label.visits.mine',
  DELEGATED: 'label.visits.delegated',
};

export const DATETIME_PICKER_MODE = {
  DATE: 'date',
  TIME: 'time',
};

export const CUSTOMER_LANDING_SCREENS = {
  OVERVIEW: 'Overview',
  BASIC_INFO: 'Basic Info',
  VISIT_INFO: 'Visit Info',
  CONTACTS: 'Contacts',
  TASKS: 'Tasks',
  SERVICE_WORKFLOW: 'Service Workflow',
  TURNOVER: 'Turnover',
  ORDER_HISTORY: 'Order History',
  TRADE_ASSET: 'TA',
  SALES_MATERIALS: 'Sales Materials',
  CONTACT_HISTORY: 'Contact History',
  CONDITIONS: 'Conditions',
  VACATION: 'Vacation',
};

export const PARTNER_DETAILS_TYPES = {
  SHIP_TO: 'Ship To',
  BILL_TO: 'Bill To',
  SOLD_TO: 'Sold To',
  PAYER: 'Payer',
};

export const CLIENT_DETAILS_TYPES = {
  SHIP_TO: 'Ship To',
  BILL_TO: 'Bill To',
  ALTERNATE_DELIVERY_ADDRESS: 'Alternate Delivery Address',
};

export const PRODUCT_CLAIMS_TYPES = {
  PRODUCT_DETAILS: 'Product Details',
  CLAIMS_SETTLEMENTS: 'Claims Settlements',
};

export const TA_TAB_TYPES = {
  ALL: 'All',
  TA_REQUEST: 'TA Request',
  TA_CHARGE_OFF: 'TA Charge - Off',
};

export const CUSTOMER_DETAILS_TYPES = {
  GENERAL_INFORMATION: 'General Information',
  CUSTOMER_HIERARCHY: 'Customer Hierarchy',
  TERRITORY_INFORMATION: 'Territory Information',
};

export const TURNOVER_FUTURE_INFO_TYPES = {
  NEXT_VISITS: 'Next Visits',
  NEXT_DELIVERIES: 'Next Deliveries',
  VISIT_NOTES: 'Visit Notes',
};

export const NOTES = {
  TELE_SALES: '1',
  FIELD_SALES: '2',
};

export const VACATIONS_TYPES = {
  ALL_VACATIONS: 'All Vacations',
  PAST_VACATIONS: 'Past Vacations',
};

export const CONDITION_FILTERS = [
  {id: 1, title: 'Condition Contracts'},
  {id: 2, title: 'Financial Contracts'},
  {id: 3, title: 'Sales Deals Conditions'},
];

export const TURNOVER_TYPES = [
  {id: 1, title: 'Turnover Details'},
  {id: 2, title: 'Monthly Turnover'},
  {id: 3, title: 'Last 10 deliveries'},
];

export const TURNOVER_RADIO_BUTTON_TYPES = [
  {
    label: 'Total',
    value: '0',
  },
  {
    label: 'Direct',
    value: '1',
  },
  {
    label: 'Indirect',
    value: '2',
  },
];

export const TRADE_ASSETS_BUTTON_TYPES = [
  {
    label: 'Yes',
    value: '0',
  },
  {
    label: 'No',
    value: '1',
  },
];

export const MONTHLY_TURNOVER_DISPLAY_TYPES = [
  {
    label: 'Turnover',
    value: 'turnoverData',
  },
  {
    label: 'Volume',
    value: 'volumeData',
  },
];

export const MONTHLY_TURNOVER_TYPES = [
  {id: 1, title: 'IC Implus'},
  {id: 2, title: 'IC Multipa'},
  {id: 3, title: 'IC Bulk Movenpic'},
  {id: 4, title: 'IC Dessert'},
  {id: 5, title: 'Cumulative'},
];

export const TURNOVER_GROUP_TYPES = {
  TOTAL: 'Total_Turnover',
  DIRECT: 'Direct_Turnover',
  INDIRECT: 'Indirect_Turnover',
};

export const MONTH_DATA = [
  {id: 1, title: 'Jan'},
  {id: 2, title: 'Feb'},
  {id: 3, title: 'Mar'},
  {id: 4, title: 'Apr'},
  {id: 5, title: 'May'},
  {id: 6, title: 'Jun'},
  {id: 7, title: 'Jul'},
  {id: 8, title: 'Aug'},
  {id: 9, title: 'Sep'},
  {id: 10, title: 'Oct'},
  {id: 11, title: 'Nov'},
  {id: 12, title: 'Dec'},
];

export const PROSPECT_STATUS_TITLE = {
  INITIAL: 'Initial',
  PARTIAL: 'Partial',
  COMPLETED: 'Completed',
  REWORK: 'Rework',
  NEW_CUSTOMER_REQUESTED: 'New Cust. Req.',
  BACK_OFFICE_VALIDATION: 'B.O. Validation',
  NOT_INTERESTED: 'Not Interested',
  CUSTOMER: 'Customer',
};

export const PROSPECT_STATUS = [
  {
    title: PROSPECT_STATUS_TITLE.INITIAL,
    bgColor: 'bg-light-lightGrey',
    borderColor: 'border-light-grey5',
    textColor: 'text-light-textBlack',
  },
  {
    title: PROSPECT_STATUS_TITLE.PARTIAL,
    bgColor: 'bg-light-lightGrey',
    borderColor: 'border-light-grey5',
    textColor: 'text-light-textBlack',
  },
  {
    title: PROSPECT_STATUS_TITLE.COMPLETED,
    bgColor: 'bg-light-green100',
    borderColor: 'border-light-green300',
    textColor: 'text-light-green800',
  },
  {
    title: PROSPECT_STATUS_TITLE.REWORK,
    bgColor: 'bg-light-red100',
    borderColor: 'border-light-red300',
    textColor: 'text-light-red800',
  },
  {
    title: PROSPECT_STATUS_TITLE.NEW_CUSTOMER_REQUESTED,
    bgColor: 'bg-light-yellow100',
    borderColor: 'border-light-yellow300',
    textColor: 'text-light-orange3',
  },
  {
    title: PROSPECT_STATUS_TITLE.BACK_OFFICE_VALIDATION,
    bgColor: 'bg-light-lightGrey',
    borderColor: 'border-light-grey5',
    textColor: 'text-light-textBlack',
  },
  {
    title: PROSPECT_STATUS_TITLE.NOT_INTERESTED,
    bgColor: 'bg-light-lightGrey',
    borderColor: 'border-light-grey5',
    textColor: 'text-light-textBlack',
  },
  {
    title: PROSPECT_STATUS_TITLE.CUSTOMER,
    bgColor: 'bg-light-white',
    borderColor: 'border-light-grey5',
    textColor: 'text-light-textBlack',
  },
  {
    title: 'Data Completed',
    bgColor: 'bg-light-green100',
    borderColor: 'border-light-green300',
    textColor: 'text-light-green800',
  },
];

export const SW_STATUS = [
  {
    title: SERVICE_WORKFLOW.COMPLETED,
    bgColor: 'bg-light-green100',
    borderColor: 'border-light-green300',
    textColor: 'text-light-green800',
  },
  {
    title: SERVICE_WORKFLOW.INPROGRESS,
    bgColor: 'bg-light-yellow100',
    borderColor: 'border-light-yellow300',
    textColor: 'text-light-orange3',
  },
  {
    title: SERVICE_WORKFLOW.OPEN,
    bgColor: 'bg-light-lightGrey',
    borderColor: 'border-light-grey5',
    textColor: 'text-light-textBlack',
  },
];

export const PROSPECT_LANDING_SCREENS = {
  OVERVIEW: 'Overview',
  BASIC_INFO: 'Basic Info',
  CUSTOMER_ATTRIBUTE: 'Customer Attribute',
  CONTACTS: 'Contacts',
  RCA: 'RCA',
  FINANCIAL_INFO: 'Financial info',
  TRADE_ASSET: 'TA',
  CONDITION_AGGREMENTS: 'Condition Agreements',
  SEPA: 'SEPA',
  NOTES: 'Notes',
};

export const RCA_TYPES = [
  {id: 1, title: 'Opening | Visiting Hours'},
  {id: 2, title: 'Visit | Call | Delivery Plan'},
];
export const TA_CLAIMS_TYPES = [
  {id: 1, title: 'Product Details'},
  {id: 2, title: 'Claims Settlements'},
];

export const WEEKS = [
  {id: 1, name: 'Sunday', title: 'S'},
  {id: 2, name: 'Monday', title: 'M'},
  {id: 3, name: 'Tuesday', title: 'T'},
  {id: 4, name: 'Wednesday', title: 'W'},
  {id: 5, name: 'Thursday', title: 'T'},
  {id: 6, name: 'Friday', title: 'F'},
  {id: 7, name: 'Saturday', title: 'S'},
];

export const TOAST_TYPE = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
};

export const CONDITION_AGREEMENT_STATUS = [
  {
    title: 'Open',
    bgColor: 'bg-light-lightGrey',
    borderColor: 'border-light-grey5',
    textColor: 'text-light-textBlack',
  },
  {
    title: 'Finalized',
    bgColor: 'bg-light-green100',
    borderColor: 'border-light-green300',
    textColor: 'text-light-green800',
  },
];

export const SERVICE_WORKFLOW_STATUS = [
  {id: 1, dot: true, status: 'In Progress'},
  {id: 2, dot: false, status: 'Completed'},
  {id: 3, dot: false, status: 'Open'},
  {id: 4, dot: true, status: 'In Progress'},
  {id: 5, dot: false, status: 'In Progress'},
  {id: 6, dot: false, status: 'Open'},
  {id: 7, dot: false, status: 'Completed'},
  {id: 8, dot: false, status: 'In Progress'},
  {id: 9, dot: false, status: 'In Progress'},
];

export const IS_SWTRACR_GRID_BASIC_DATA = [
  {id: 1, title: 'Updated'},
  {id: 2, title: 'Assigned'},
  {id: 3, title: 'Created'},
];

export const DELEGATION = {
  ALL: 'All',
  VALID: 'Valid',
  INVALID: 'Invalid',
};
