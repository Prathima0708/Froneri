import {images} from 'src/assets/Images';
import {PROSPECTS_TYPE} from './DbConst';
import {pageNamePLTAChargeOff, pageNamePLTARequest} from 'src/routes/Routes';

export const CRCA_HOURS_DROPDOWN = [
  {
    label: 'All',
    value: '1',
  },
  {
    label: 'Opening Hrs',
    value: '2',
  },
  {
    label: 'Visiting Hrs',
    value: '3',
  },
];

export const VISIT_CALENDAR_DROPDOWN = [
  {
    label: 'label.visits.day',
    value: 'day',
    image: images.DayIcon,
  },
  {
    label: 'label.visits.work_week',
    value: 'workWeek',
    image: images.WorkWeekIcon,
  },
  {
    label: 'label.visits.week',
    value: 'week',
    image: images.WeekIcon,
  },
];

export const PROSPECTS_DROPDOWN = [
  {
    label: 'All Prospects',
    value: PROSPECTS_TYPE.ALL,
  },
  {
    label: 'Initial',
    value: PROSPECTS_TYPE.INITIAL,
  },
  {
    label: 'Partial',
    value: PROSPECTS_TYPE.PARTIAL,
  },
  {
    label: 'Data Completed',
    value: PROSPECTS_TYPE.COMPLETED,
  },
  {
    label: 'Rework',
    value: PROSPECTS_TYPE.REWORK,
  },
  {
    label: 'New Customer Request',
    value: PROSPECTS_TYPE.NEW_CUSTOMER_REQUESTED,
  },
  {
    label: 'Back Office Validation',
    value: PROSPECTS_TYPE.BACK_OFFICE_VALIDATION,
  },
  {
    label: 'Not Interested ',
    value: PROSPECTS_TYPE.NOT_INTERESTED,
  },
];

export const PRIORITY_DROPDOWN = [
  {
    label: 'Low',
    value: '1',
  },
  {
    label: 'Medium',
    value: '2',
  },
  {
    label: 'High',
    value: '3',
  },
];

export const NOTES_DROPDOWN = [
  {
    label: 'All Notes',
    value: '1',
  },
  {
    label: 'Telesales',
    value: '2',
  },
  {
    label: 'Field Sales',
    value: '3',
  },
];

export const CONTACT_HISTORY_DROPDOWN_VALUES = {
  ALL_CONTACTS: '1',
  ORDERS: '2',
  VISITS: '3',
};

export const CONTACT_HISTORY_DROPDOWN = [
  {
    label: 'All Contacts',
    value: CONTACT_HISTORY_DROPDOWN_VALUES.ALL_CONTACTS,
  },
  {
    label: 'Orders',
    value: CONTACT_HISTORY_DROPDOWN_VALUES.ORDERS,
  },
  {
    label: 'Visits',
    value: CONTACT_HISTORY_DROPDOWN_VALUES.VISITS,
  },
];

export const TA_ORDERS_DROPDOWN = [
  {
    label: 'TA Install Orders',
    value: '1',
  },
  {
    label: 'TA Pickup Orders',
    value: '2',
  },
  {
    label: 'TA Replace Orders',
    value: '3',
  },
];

export const DELIVERY_NOTE_TYPE_DROPDOWN = [
  {
    label: 'Item 1',
    value: '1',
  },
  {
    label: 'Item 2',
    value: '2',
  },
  {
    label: 'Item 3',
    value: '3',
  },
  {
    label: 'Item 4',
    value: '1',
  },
  {
    label: 'Item 5',
    value: '2',
  },
  {
    label: 'Item 6',
    value: '3',
  },
];

export const MATERIAL_NUMBER_DROPDOWN = [
  {
    label: 'Item 1',
    value: '1',
  },
  {
    label: 'Item 2',
    value: '2',
  },
  {
    label: 'Item 3',
    value: '3',
  },
];

export const RCA_HOURS_DROPDOWN = [
  {
    label: '06:00',
    value: '1',
  },
  {
    label: '06:30',
    value: '2',
  },
  {
    label: '07:00',
    value: '3',
  },
  {
    label: '07:30',
    value: '4',
  },
  {
    label: '08:00',
    value: '5',
  },
  {
    label: '08:30',
    value: '6',
  },
  {
    label: '09:00',
    value: '7',
  },
  {
    label: '09:30',
    value: '8',
  },
  {
    label: '10:00',
    value: '9',
  },
  {
    label: '10:30',
    value: '10',
  },
  {
    label: '11:00',
    value: '11',
  },
  {
    label: '11:30',
    value: '12',
  },
  {
    label: '12:00',
    value: '13',
  },
  {
    label: '12:30',
    value: '14',
  },
  {
    label: '13:00',
    value: '15',
  },
  {
    label: '13:30',
    value: '16',
  },
  {
    label: '14:00',
    value: '17',
  },
  {
    label: '14:30',
    value: '18',
  },
  {
    label: '15:00',
    value: '19',
  },
  {
    label: '15:30',
    value: '20',
  },
  {
    label: '16:00',
    value: '21',
  },
  {
    label: '16:30',
    value: '22',
  },
  {
    label: '17:00',
    value: '23',
  },
  {
    label: '17:30',
    value: '24',
  },
  {
    label: '18:00',
    value: '25',
  },
  {
    label: '18:30',
    value: '26',
  },
  {
    label: '19:00',
    value: '27',
  },
  {
    label: '19:30',
    value: '28',
  },
  {
    label: '20:00',
    value: '29',
  },
];

export const WEEKS_DROPDOWN = [
  {
    label: 'Monday',
    value: '1',
  },
  {
    label: 'Tuesday',
    value: '2',
  },
  {
    label: 'Wednesday',
    value: '3',
  },
  {
    label: 'Thursday',
    value: '4',
  },
  {
    label: 'Friday',
    value: '5',
  },
  {
    label: 'Saturday',
    value: '6',
  },
  {
    label: 'Sunday',
    value: '7',
  },
];

export const SEPA_AGREEMENT_TYPE_DROPDOWN = [
  {
    label: 'Create Agreement',
    value: 'SEPA',
  },
  {
    label: 'Create Agreement',
    value: 'Bank Details',
  },
];

export const VISIT_HOURS_DROPDOWN = [
  {
    label: '08:00',
    value: '1',
  },
  {
    label: '08:30',
    value: '2',
  },
  {
    label: '09:00',
    value: '3',
  },
  {
    label: '09:30',
    value: '4',
  },
  {
    label: '10:00',
    value: '5',
  },
  {
    label: '10:30',
    value: '6',
  },
  {
    label: '11:00',
    value: '7',
  },
  {
    label: '11:30',
    value: '8',
  },
  {
    label: '12:00',
    value: '9',
  },
  {
    label: '12:30',
    value: '10',
  },
  {
    label: '13:00',
    value: '11',
  },
  {
    label: '13:30',
    value: '12',
  },
  {
    label: '14:00',
    value: '13',
  },
  {
    label: '14:30',
    value: '14',
  },
  {
    label: '15:00',
    value: '15',
  },
  {
    label: '15:30',
    value: '16',
  },
  {
    label: '16:00',
    value: '17',
  },
  {
    label: '16:30',
    value: '18',
  },
  {
    label: '17:00',
    value: '19',
  },
  {
    label: '17:30',
    value: '20',
  },
  {
    label: '18:00',
    value: '21',
  },
  {
    label: '18:30',
    value: '22',
  },
  {
    label: '19:00',
    value: '23',
  },
  {
    label: '19:30',
    value: '24',
  },
  {
    label: '20:00',
    value: '25',
  },
];

export const CALL_AND_DELIVERY_WEEK_DROPDOWN = [
  {
    label: '1',
    value: '1',
  },
  {
    label: '2',
    value: '2',
  },
  {
    label: '3',
    value: '3',
  },
  {
    label: '4',
    value: '4',
  },
];

export const TRADE_ASSETS_TYPE_DROPDOWN = [
  {
    label: 'Create TA',
    value: 'TA Request',
    screen: pageNamePLTARequest,
  },
  {
    label: 'Create TA',
    value: 'TA Charge - Off',
    screen: pageNamePLTAChargeOff,
  },
];

export const SERVICE_WORKFLOW_STATUS_DROPDOWN = [
  {
    label: 'Open',
    value: '1',
  },
  {
    label: 'In-Progress',
    value: '2',
  },
  {
    label: 'Completed',
    value: '3',
  },
];
export const YES_NO_STATUS_DROPDOWN = [
  {
    label: 'YES',
    value: 'Yes',
  },
  {
    label: 'NO',
    value: 'No',
  },
];
export const SETTLEMENT_TYPE_DROPDOWN = [
  {
    type: 'No Settlement',
    value: '0',
  },
  {
    type: 'Settlement is legitimate',
    value: '1',
  },
  {
    type: 'Settlement is gesture of goodwill',
    value: '2',
  },
];

export const DEFECT_STATUS_DROPDOWN = [
  {
    label: 'Defect has been asserted',
    value: '1',
  },
  {
    label: 'Defect has not been asserted',
    value: '2',
  },
  {
    label:
      'Defect has not been asserted, but replacement as a gesture of goodwill',
    value: '3',
  },
];
export const SETTLEMENT_DONE_BY_DROPDOWN = [
  {
    label: 'Free Goods',
    value: '1',
  },
  {
    label: 'Credit note',
    value: '2',
  },
];
