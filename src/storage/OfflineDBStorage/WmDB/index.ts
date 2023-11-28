import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {mySchema} from './WmDbSchema';

// DB Models
import Calendars from './models/Calendars';
import CallCenters from './models/CallCenters';
import CallPlaces from './models/CallPlaces';
import ClaimsConfigurations from './models/ClaimsConfigurations';
import Classifications from './models/Classifications';
import ContractType from './models/ContractType';
import CreditOrderReasons from './models/CreditOrderReasons';
import CustomerBusinessReasons from './models/CustomerBusinessReasons';
import CustomerChannels from './models/CustomerChannels';
import CustomerPreferenceReasons from './models/CustomerPreferenceReasons';
import CustomersAbcClassifications from './models/CustomersAbcClassifications';
import CustomersPaymentMethods from './models/CustomersPaymentMethods';
import CustomersPaymentTerms from './models/CustomersPaymentTerms';
import DeliveryOvercostReasons from './models/DeliveryOvercostReasons';
import Distributors from './models/Distributors';
import EmployeeFunctions from './models/EmployeeFunctions';
import EmployeesObjectives from './models/EmployeesObjectives';
import FreeItemReasons from './models/FreeItemReasons';
import HolidayCalendarsHolidays from './models/HolidayCalendarsHolidays';
import ItemProposals from './models/ItemProposals';
import Languages from './models/Languages';
import LayoutColorsFonts from './models/LayoutColorsFonts';
import MaterialHierarchy from './models/MaterialHierarchy';
import NoOrderReasons from './models/NoOrderReasons';
import OrderChangeReasonCodes from './models/OrderChangeReasonCodes';
import OrderTemplate from './models/OrderTemplate';
import OrderTypes from './models/OrderTypes';
import ParametersValues from './models/ParametersValues';
import PersonTitles from './models/PersonTitles';
import Piloting from './models/Piloting';
import PlantZipCodeMapping from './models/PlantZipCodeMapping';
import Questions from './models/Questions';
import RegionalDistributionCenters from './models/RegionalDistributionCenters';
import ReturnOrderReasons from './models/ReturnOrderReasons';
import SalesArea from './models/SalesArea';
import SalesTeams from './models/SalesTeams';
import ServiceRequestTypes from './models/ServiceRequestTypes';
import SyncComponents from './models/SyncComponents';
import SyncFields from './models/SyncFields';
import SyncTables from './models/SyncTables';
import Tasks from './models/Tasks';
import Territories from './models/Territories';
import Texts from './models/Texts';
import TextsReports from './models/TextsReports';
import TradeAssetNetContribution from './models/TradeAssetNetContribution';
import TradeAssetRejectionReasons from './models/TradeAssetRejectionReasons';
import TspRoutes from './models/TspRoutes';
import TurnoverGroups from './models/TurnoverGroups';
import UnitConversions from './models/UnitConversions';
import UnitsOfMeasures from './models/UnitsOfMeasures';
import CustomersIndustryCodes from './models/CustomersIndustryCodes';
import Employees from './models/Employees';
import LayoutGroups from './models/LayoutGroups';
import QuestionAnswers from './models/QuestionAnswers';
import RdcTspHolidayCalendar from './models/RdcTspHolidayCalendar';
import TaskEmployeeObjectives from './models/TaskEmployeeObjectives';
import TaskOrderTemplate from './models/TaskOrderTemplate';
import TaskQuestions from './models/TaskQuestions';
import TaskSalesTeams from './models/TaskSalesTeams';
import TerritoriesHierarchy from './models/TerritoriesHierarchy';
import TextsOrders from './models/TextsOrders';
import TradeAssetsContractTemplates from './models/TradeAssetsContractTemplates';
import TransShipmentPoints from './models/TransShipmentPoints';
import TurnoverGroupsMaterialHierarchies from './models/TurnoverGroupsMaterialHierarchies';
import Authorizations from './models/Authorizations';
import Customers from './models/Customers';
import CustomersSalesOffices from './models/CustomersSalesOffices';
import Events from './models/Events';
import ItemProposalsMaterials from './models/ItemProposalsMaterials';
import LayoutGroupsMaterialHierarchies from './models/LayoutGroupsMaterialHierarchies';
import LayoutGroupsMaterials from './models/LayoutGroupsMaterials';
import Layouts from './models/Layouts';
import LeaderMaterials from './models/LeaderMaterials';
import MaterialsNotAvailable from './models/MaterialsNotAvailable';
import MaterialsSalesUnits from './models/MaterialsSalesUnits';
import MaterialsUnitOfMeasures from './models/MaterialsUnitOfMeasures';
import OrderTemplateMaterials from './models/OrderTemplateMaterials';
import PostalCodeTransShipmentPoints from './models/PostalCodeTransShipmentPoints';
import SalesRepDelegation from './models/SalesRepDelegation';
import SalesRepresentatives from './models/SalesRepresentatives';
import SpecialRoutes from './models/SpecialRoutes';
import StorageLocations from './models/StorageLocations';
import SubstitutionMaterials from './models/SubstitutionMaterials';
import SyncStoredProcedures from './models/SyncStoredProcedures';
import TaskEmployees from './models/TaskEmployees';
import TradeAssetsAccessories from './models/TradeAssetsAccessories';
import TradeAssetsMinimumTurnover from './models/TradeAssetsMinimumTurnover';
import DiscoveryControls from './models/DiscoveryControls';
import DiscoveryListValues from './models/DiscoveryListValues';
import Activities from './models/Activities';
import Calls from './models/Calls';
import CatrinAlternativeRoutes from './models/CatrinAlternativeRoutes';
import CustomerContacts from './models/CustomerContacts';
import CustomerHierarchiesShipTo from './models/CustomerHierarchiesShipTo';
import CustomerShipToOrderTemplate from './models/CustomerShipToOrderTemplate';
import CustomerVacations from './models/CustomerVacations';
import CustomersAdditionalInformation from './models/CustomersAdditionalInformation';
import CustomersAdditionalInformationClient from './models/CustomersAdditionalInformationClient';
import CustomersBanksInformation from './models/CustomersBanksInformation';
import CustomersBillTo from './models/CustomersBillTo';
import CustomersDifferentDeliveryAddress from './models/CustomersDifferentDeliveryAddress';
import CustomersFinancialInformation from './models/CustomersFinancialInformation';
import CustomersMaterialsPreference from './models/CustomersMaterialsPreference';
import CustomersPayer from './models/CustomersPayer';
import CustomersRouteCustomerAssignment from './models/CustomersRouteCustomerAssignment';
import CustomersShipToItemProposals from './models/CustomersShipToItemProposals';
import CustomersSoldTo from './models/CustomersSoldTo';
import CustomersSynchro from './models/CustomersSynchro';
import CustomersTurnoverInformation from './models/CustomersTurnoverInformation';
import DeliveriesAggregatedLeaderMaterials from './models/DeliveriesAggregatedLeaderMaterials';
import DeliveriesAggregatedShipToMaterials from './models/DeliveriesAggregatedShipToMaterials';
import DeliveriesDetailedLast10 from './models/DeliveriesDetailedLast10';
import DeliveriesLast10 from './models/DeliveriesLast10';
import FreeGoodsHeader from './models/FreeGoodsHeader';
import InternalMessages from './models/InternalMessages';
import LayoutGroupsSequences from './models/LayoutGroupsSequences';
import Orders from './models/Orders';
import OrdersAggregated from './models/OrdersAggregated';
import Promotions from './models/Promotions';
import SalesDealsCustomerShipToAggregated from './models/SalesDealsCustomerShipToAggregated';
import SalesOfficeTradeAssetPlants from './models/SalesOfficeTradeAssetPlants';
import ServiceRequestsCustomers from './models/ServiceRequestsCustomers';
import StocksAtpFinishedProducts from './models/StocksAtpFinishedProducts';
import TerritoriesCustomers from './models/TerritoriesCustomers';
import TerritoriesSalesRepresentatives from './models/TerritoriesSalesRepresentatives';
import TradeAssetAccessoriesCustomers from './models/TradeAssetAccessoriesCustomers';
import TradeAssetsCustomers from './models/TradeAssetsCustomers';
import TurnoverAggregated from './models/TurnoverAggregated';
import TurnoverAggregatedCustomersMaterials from './models/TurnoverAggregatedCustomersMaterials';
import TurnoverAggregatedMonth from './models/TurnoverAggregatedMonth';
import CallContacts from './models/CallContacts';
import CustomerShipToCouponCodes from './models/CustomerShipToCouponCodes';
import CustomersClaimsWorkflowClaimsData from './models/CustomersClaimsWorkflowClaimsData';
import CustomersClaimsWorkflowHeader from './models/CustomersClaimsWorkflowHeader';
import CustomersClaimsWorkflowSettlementData from './models/CustomersClaimsWorkflowSettlementData';
import CustomersMaterials from './models/CustomersMaterials';
import CustomersPromotionDetails from './models/CustomersPromotionDetails';
import CustomersShipToPromotions from './models/CustomersShipToPromotions';
import OosOrderedMaterials from './models/OosOrderedMaterials';
import OrderLines from './models/OrderLines';
import OrderLinesFreeGoods from './models/OrderLinesFreeGoods';
import PromotionsMaterials from './models/PromotionsMaterials';
import ServiceRequestsCustomersJournal from './models/ServiceRequestsCustomersJournal';
import TaskExecution from './models/TaskExecution';
import Prospects from './models/Prospects';
import DiscoveryCustomerAttributes from './models/DiscoveryCustomerAttributes';
import DiscoveryContacts from './models/DiscoveryContacts';
import DiscoveryRca from './models/DiscoveryRca';
import DiscoveryFinancialData from './models/DiscoveryFinancialData';
import DiscoveryTradeAssets from './models/DiscoveryTradeAssets';
import DiscoveryNewTradeAssetsWished from './models/DiscoveryNewTradeAssetsWished';
import DiscoveryPreviousOwnerTradeAssets from './models/DiscoveryPreviousOwnerTradeAssets';
import DiscoveryTradeAssetsChargeOff from './models/DiscoveryTradeAssetsChargeOff';
import DiscoveryConditionAgreements from './models/DiscoveryConditionAgreements';
import DiscoverySepa from './models/DiscoverySepa';
import DiscoveryAgreementRequests from './models/DiscoveryAgreementRequests';
import SeasonstartOrderDetails from './models/SeasonstartOrderDetails';
import CustomersCreditOrdersAmount from './models/CustomersCreditOrdersAmount';
import OrderLinesPromotion from './models/OrderLinesPromotion';
import TaskExecutionAnswers from './models/TaskExecutionAnswers';
import Discovery from './models/Discovery';
import Materials from './models/Materials';
import OrderTemplateSalesTeam from './models/OrderTemplateSalesTeam';
import ProspectVisitNotes from './models/ProspectVisitNotes';
import TradeAssetPickupOrderReasons from './models/TradeAssetPickupOrderReasons';
import RebateTrackerRebateFinancialConditions from './models/RebateTrackerRebateFinancialConditions';
import PricingProcedure from './models/PricingProcedure';
import TempHierarchy from './models/TempHierarchy';
import TaskCustomerHierarchy from './models/TaskCustomerHierarchy';
import TempIce from './models/TempIcets';
//

let database: any = '';

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  dbName: 'WatermelonDemo',
  schema: mySchema,
});

export const MODEL = {
  CALENDARS: 'calendars',
  CALL_CENTERS: 'call_centers',
  CALL_PLACES: 'call_places',
  CLAIMS_CONFIGURATIONS: 'claims_configurations',
  CLASSIFICATIONS: 'classifications',
  CONTRACT_TYPE: 'contract_type',
  CREDIT_ORDER_REASONS: 'credit_order_reasons',
  CUSTOMER_BUSINESS_REASONS: 'customer_business_reasons',
  CUSTOMER_CHANNELS: 'customer_channels',
  CUSTOMER_PREFERENCE_REASONS: 'customer_preference_reasons',
  CUSTOMERS_ABC_CLASSIFICATIONS: 'customers_abc_classifications',
  CUSTOMERS_PAYMENT_METHODS: 'customers_payment_methods',
  CUSTOMERS_PAYMENT_TERMS: 'customers_payment_terms',
  DELIVERY_OVERCOST_REASONS: 'delivery_overcost_reasons',
  DISTRIBUTORS: 'distributors',
  EMPLOYEE_FUNCTIONS: 'employee_functions',
  EMPLOYEES_OBJECTIVES: 'employees_objectives',
  FREE_ITEM_REASONS: 'free_item_reasons',
  HOLIDAY_CALENDARS_HOLIDAYS: 'holiday_calendars_holidays',
  ITEM_PROPOSALS: 'item_proposals',
  LANGUAGES: 'languages',
  LAYOUT_COLORS_FONTS: 'layout_colors_fonts',
  MATERIAL_HIERARCHY: 'material_hierarchy',
  NO_ORDER_REASONS: 'no_order_reasons',
  ORDER_CHANGE_REASON_CODES: 'order_change_reason_codes',
  ORDER_TEMPLATE: 'order_template',
  ORDER_TYPES: 'order_types',
  PARAMETERS_VALUES: 'parameters_values',
  PERSON_TITLES: 'person_titles',
  PILOTING: 'piloting',
  PLANT_ZIP_CODE_MAPPING: 'plant_zip_code_mapping',
  QUESTIONS: 'questions',
  REGIONAL_DISTRIBUTION_CENTERS: 'regional_distribution_centers',
  RETURN_ORDER_REASONS: 'return_order_reasons',
  SALES_AREA: 'sales_area',
  SALES_TEAMS: 'sales_teams',
  SERVICE_REQUEST_TYPES: 'service_request_types',
  SYNC_COMPONENTS: 'sync_components',
  SYNC_FIELDS: 'sync_fields',
  SYNC_TABLES: 'sync_tables',
  TASKS: 'tasks',
  TERRITORIES: 'territories',
  TEXTS: 'texts',
  TEXTS_REPORTS: 'texts_reports',
  TRADE_ASSET_NET_CONTRIBUTION: 'trade_asset_net_contribution',
  TRADE_ASSET_REJECTION_REASONS: 'trade_asset_rejection_reasons',
  TSP_ROUTES: 'tsp_routes',
  TURNOVER_GROUPS: 'turnover_groups',
  UNIT_CONVERSIONS: 'unit_conversions',
  UNITS_OF_MEASURES: 'units_of_measures',
  CUSTOMERS_INDUSTRY_CODES: 'customers_industry_codes',
  EMPLOYEES: 'employees',
  LAYOUT_GROUPS: 'layout_groups',
  QUESTION_ANSWERS: 'question_answers',
  RDC_TSP_HOLIDAY_CALENDAR: 'rdc_tsp_holiday_calendar',
  TASK_EMPLOYEE_OBJECTIVES: 'task_employee_objectives',
  TASK_ORDER_TEMPLATE: 'task_order_template',
  TASK_QUESTIONS: 'task_questions',
  TASK_SALES_TEAMS: 'task_sales_teams',
  TERRITORIES_HIERARCHY: 'territories_hierarchy',
  TEXTS_ORDERS: 'texts_orders',
  TRADE_ASSETS_CONTRACT_TEMPLATES: 'trade_assets_contract_templates',
  TRANS_SHIPMENT_POINTS: 'trans_shipment_points',
  TURNOVER_GROUPS_MATERIAL_HIERARCHIES: 'turnover_groups_material_hierarchies',
  AUTHORIZATIONS: 'authorizations',
  CUSTOMERS: 'customers',
  CUSTOMERS_SALES_OFFICES: 'customers_sales_offices',
  EVENTS: 'events',
  ITEM_PROPOSALS_MATERIALS: 'item_proposals_materials',
  LAYOUT_GROUPS_MATERIAL_HIERARCHIES: 'layout_groups_material_hierarchies',
  LAYOUT_GROUPS_MATERIALS: 'layout_groups_materials',
  LAYOUTS: 'layouts',
  LEADER_MATERIALS: 'leader_materials',
  MATERIALS_NOT_AVAILABLE: 'materials_not_available',
  MATERIALS_SALES_UNITS: 'materials_sales_units',
  MATERIALS_UNIT_OF_MEASURES: 'materials_unit_of_measures',
  ORDER_TEMPLATE_MATERIALS: 'order_template_materials',
  POSTAL_CODE_TRANS_SHIPMENT_POINTS: 'postal_code_trans_shipment_points',
  SALES_REP_DELEGATION: 'sales_rep_delegation',
  SALES_REPRESENTATIVES: 'sales_representatives',
  SPECIAL_ROUTES: 'special_routes',
  STORAGE_LOCATIONS: 'storage_locations',
  SUBSTITUTION_MATERIALS: 'substitution_materials',
  SYNC_STORED_PROCEDURES: 'sync_stored_procedures',
  TASK_EMPLOYEES: 'task_employees',
  TRADE_ASSETS_ACCESSORIES: 'trade_assets_accessories',
  TRADE_ASSETS_MINIMUM_TURNOVER: 'trade_assets_minimum_turnover',
  DISCOVERY_CONTROLS: 'discovery_controls',
  DISCOVERY_LIST_VALUES: 'discovery_list_values',
  ACTIVITIES: 'activities',
  CALLS: 'calls',
  CATRIN_ALTERNATIVE_ROUTES: 'catrin_alternative_routes',
  CUSTOMER_CONTACTS: 'customer_contacts',
  CUSTOMER_HIERARCHIES_SHIP_TO: 'customer_hierarchies_ship_to',
  CUSTOMER_SHIP_TO_ORDER_TEMPLATE: 'customer_ship_to_order_template',
  CUSTOMER_VACATIONS: 'customer_vacations',
  CUSTOMERS_ADDITIONAL_INFORMATION: 'customers_additional_information',
  CUSTOMERS_ADDITIONAL_INFORMATION_CLIENT:
    'customers_additional_information_client',
  CUSTOMERS_BANKS_INFORMATION: 'customers_banks_information',
  CUSTOMERS_BILL_TO: 'customers_bill_to',
  CUSTOMERS_DIFFERENT_DELIVERY_ADDRESS: 'customers_different_delivery_address',
  CUSTOMERS_FINANCIAL_INFORMATION: 'customers_financial_information',
  CUSTOMERS_MATERIALS_PREFERENCE: 'customers_materials_preference',
  CUSTOMERS_PAYER: 'customers_payer',
  CUSTOMERS_ROUTE_CUSTOMER_ASSIGNMENT: 'customers_route_customer_assignment',
  CUSTOMERS_SHIP_TO_ITEM_PROPOSALS: 'customers_ship_to_item_proposals',
  CUSTOMERS_SOLD_TO: 'customers_sold_to',
  CUSTOMERS_SYNCHRO: 'customers_synchro',
  CUSTOMERS_TURNOVER_INFORMATION: 'customers_turnover_information',
  DELIVERIES_AGGREGATED_LEADER_MATERIALS:
    'deliveries_aggregated_leader_materials',
  DELIVERIES_AGGREGATED_SHIP_TO_MATERIALS:
    'deliveries_aggregated_ship_to_materials',
  DELIVERIES_DETAILED_LAST_10: 'deliveries_detailed_last_10',
  DELIVERIES_LAST_10: 'deliveries_last_10',
  FREE_GOODS_HEADER: 'free_goods_header',
  INTERNAL_MESSAGES: 'internal_messages',
  LAYOUT_GROUPS_SEQUENCES: 'layout_groups_sequences',
  ORDERS: 'orders',
  ORDERS_AGGREGATED: 'orders_aggregated',
  PROMOTIONS: 'promotions',
  SALES_DEALS_CUSTOMER_SHIP_TO_AGGREGATED:
    'sales_deals_customer_ship_to_aggregated',
  SALES_OFFICE_TRADE_ASSET_PLANTS: 'sales_office_trade_asset_plants',
  SERVICE_REQUESTS_CUSTOMERS: 'service_requests_customers',
  STOCKS_ATP_FINISHED_PRODUCTS: 'stocks_atp_finished_products',
  TERRITORIES_CUSTOMERS: 'territories_customers',
  TERRITORIES_SALES_REPRESENTATIVES: 'territories_sales_representatives',
  TRADE_ASSET_ACCESSORIES_CUSTOMERS: 'trade_asset_accessories_customers',
  TRADE_ASSETS_CUSTOMERS: 'trade_assets_customers',
  TURNOVER_AGGREGATED: 'turnover_aggregated',
  TURNOVER_AGGREGATED_CUSTOMERS_MATERIALS:
    'turnover_aggregated_customers_materials',
  TURNOVER_AGGREGATED_MONTH: 'turnover_aggregated_month',
  CALL_CONTACTS: 'call_contacts',
  CUSTOMER_SHIP_TO_COUPON_CODES: 'customer_ship_to_coupon_codes',
  CUSTOMERS_CLAIMS_WORKFLOW_CLAIMS_DATA:
    'customers_claims_workflow_claims_data',
  CUSTOMERS_CLAIMS_WORKFLOW_HEADER: 'customers_claims_workflow_header',
  CUSTOMERS_CLAIMS_WORKFLOW_SETTLEMENT_DATA:
    'customers_claims_workflow_settlement_data',
  CUSTOMERS_MATERIALS: 'customers_materials',
  CUSTOMERS_PROMOTION_DETAILS: 'customers_promotion_details',
  CUSTOMERS_SHIP_TO_PROMOTIONS: 'customers_ship_to_promotions',
  OOS_ORDERED_MATERIALS: 'oos_ordered_materials',
  ORDER_LINES: 'order_lines',
  ORDER_LINES_FREE_GOODS: 'order_lines_free_goods',
  PROMOTIONS_MATERIALS: 'promotions_materials',
  SERVICE_REQUESTS_CUSTOMERS_JOURNAL: 'service_requests_customers_journal',
  TASK_EXECUTION: 'task_execution',
  PROSPECTS: 'prospects',
  DISCOVERY_CUSTOMER_ATTRIBUTES: 'discovery_customer_attributes',
  DISCOVERY_CONTACTS: 'discovery_contacts',
  DISCOVERY_RCA: 'discovery_rca',
  DISCOVERY_FINANCIAL_DATA: 'discovery_financial_data',
  DISCOVERY_TRADE_ASSETS: 'discovery_trade_assets',
  DISCOVERY_NEW_TRADE_ASSETS_WISHED: 'discovery_new_trade_assets_wished',
  DISCOVERY_PREVIOUS_OWNER_TRADE_ASSETS:
    'discovery_previous_owner_trade_assets',
  DISCOVERY_TRADE_ASSETS_CHARGE_OFF: 'discovery_trade_assets_charge_off',
  DISCOVERY_CONDITION_AGREEMENTS: 'discovery_condition_agreements',
  DISCOVERY_SEPA: 'discovery_sepa',
  DISCOVERY_AGREEMENT_REQUESTS: 'discovery_agreement_requests',
  SEASONSTART_ORDER_DETAILS: 'seasonstart_order_details',
  CUSTOMERS_CREDIT_ORDERS_AMOUNT: 'customers_credit_orders_amount',
  ORDER_LINES_PROMOTION: 'order_lines_promotion',
  TASK_EXECUTION_ANSWERS: 'task_execution_answers',
  DISCOVERY: 'discovery',
  MATERIALS: 'materials',
  ORDER_TEMPLATE_SALES_TEAM: 'order_template_sales_team',
  PROSPECT_VISIT_NOTES: 'prospect_visit_notes',
  TRADE_ASSET_PICKUP_ORDER_REASONS: 'trade_asset_pickup_order_reasons',
  REBATETRACKER_REBATE_FINANCIAL_CONDITIONS:
    'rebatetracker_rebate_financial_conditions',
  PRICING_PROCEDURE: 'pricing_procedure',
  TEMP_HIERARCHY: 'temp_hierarchy',
  TASK_CUSTOMER_HIERARCHY: 'task_customer_hierarchy',
  TEMP_ICE: 'temp_ice',
};

export const init = () => {
  database = new Database({
    adapter,
    modelClasses: [
      Calendars,
      CallCenters,
      CallPlaces,
      ClaimsConfigurations,
      Classifications,
      ContractType,
      CreditOrderReasons,
      CustomerBusinessReasons,
      CustomerChannels,
      CustomerPreferenceReasons,
      CustomersAbcClassifications,
      CustomersPaymentMethods,
      CustomersPaymentTerms,
      DeliveryOvercostReasons,
      Distributors,
      EmployeeFunctions,
      EmployeesObjectives,
      FreeItemReasons,
      HolidayCalendarsHolidays,
      ItemProposals,
      Languages,
      LayoutColorsFonts,
      MaterialHierarchy,
      NoOrderReasons,
      OrderChangeReasonCodes,
      OrderTemplate,
      OrderTypes,
      ParametersValues,
      PersonTitles,
      Piloting,
      PlantZipCodeMapping,
      Questions,
      RegionalDistributionCenters,
      ReturnOrderReasons,
      SalesArea,
      SalesTeams,
      ServiceRequestTypes,
      SyncComponents,
      SyncFields,
      SyncTables,
      Tasks,
      Territories,
      Texts,
      TextsReports,
      TradeAssetNetContribution,
      TradeAssetRejectionReasons,
      TspRoutes,
      TurnoverGroups,
      UnitConversions,
      UnitsOfMeasures,
      CustomersIndustryCodes,
      Employees,
      LayoutGroups,
      QuestionAnswers,
      RdcTspHolidayCalendar,
      TaskEmployeeObjectives,
      TaskOrderTemplate,
      TaskQuestions,
      TaskSalesTeams,
      TerritoriesHierarchy,
      TextsOrders,
      TradeAssetsContractTemplates,
      TransShipmentPoints,
      TurnoverGroupsMaterialHierarchies,
      Authorizations,
      Customers,
      CustomersSalesOffices,
      Events,
      ItemProposalsMaterials,
      LayoutGroupsMaterialHierarchies,
      LayoutGroupsMaterials,
      Layouts,
      LeaderMaterials,
      MaterialsNotAvailable,
      MaterialsSalesUnits,
      MaterialsUnitOfMeasures,
      OrderTemplateMaterials,
      PostalCodeTransShipmentPoints,
      SalesRepDelegation,
      SalesRepresentatives,
      SpecialRoutes,
      StorageLocations,
      SubstitutionMaterials,
      SyncStoredProcedures,
      TaskEmployees,
      TradeAssetsAccessories,
      TradeAssetsMinimumTurnover,
      DiscoveryControls,
      DiscoveryListValues,
      Activities,
      Calls,
      CatrinAlternativeRoutes,
      CustomerContacts,
      CustomerHierarchiesShipTo,
      CustomerShipToOrderTemplate,
      CustomerVacations,
      CustomersAdditionalInformation,
      CustomersAdditionalInformationClient,
      CustomersBanksInformation,
      CustomersBillTo,
      CustomersDifferentDeliveryAddress,
      CustomersFinancialInformation,
      CustomersMaterialsPreference,
      CustomersPayer,
      CustomersRouteCustomerAssignment,
      CustomersShipToItemProposals,
      CustomersSoldTo,
      CustomersSynchro,
      CustomersTurnoverInformation,
      DeliveriesAggregatedLeaderMaterials,
      DeliveriesAggregatedShipToMaterials,
      DeliveriesDetailedLast10,
      DeliveriesLast10,
      FreeGoodsHeader,
      InternalMessages,
      LayoutGroupsSequences,
      Orders,
      OrdersAggregated,
      Promotions,
      SalesDealsCustomerShipToAggregated,
      SalesOfficeTradeAssetPlants,
      ServiceRequestsCustomers,
      StocksAtpFinishedProducts,
      TerritoriesCustomers,
      TerritoriesSalesRepresentatives,
      TradeAssetAccessoriesCustomers,
      TradeAssetsCustomers,
      TurnoverAggregated,
      TurnoverAggregatedCustomersMaterials,
      TurnoverAggregatedMonth,
      CallContacts,
      CustomerShipToCouponCodes,
      CustomersClaimsWorkflowClaimsData,
      CustomersClaimsWorkflowHeader,
      CustomersClaimsWorkflowSettlementData,
      CustomersMaterials,
      CustomersPromotionDetails,
      CustomersShipToPromotions,
      OosOrderedMaterials,
      OrderLines,
      OrderLinesFreeGoods,
      PromotionsMaterials,
      ServiceRequestsCustomersJournal,
      TaskExecution,
      Prospects,
      DiscoveryCustomerAttributes,
      DiscoveryContacts,
      DiscoveryRca,
      DiscoveryFinancialData,
      DiscoveryTradeAssets,
      DiscoveryNewTradeAssetsWished,
      DiscoveryPreviousOwnerTradeAssets,
      DiscoveryTradeAssetsChargeOff,
      DiscoveryConditionAgreements,
      DiscoverySepa,
      DiscoveryAgreementRequests,
      SeasonstartOrderDetails,
      CustomersCreditOrdersAmount,
      OrderLinesPromotion,
      TaskExecutionAnswers,
      Discovery,
      Materials,
      OrderTemplateSalesTeam,
      ProspectVisitNotes,
      TradeAssetPickupOrderReasons,
      RebateTrackerRebateFinancialConditions,
      PricingProcedure,
      TempHierarchy,
      TaskCustomerHierarchy,
      TempIce,
    ],
    // actionsEnabled: true,
  });
  return database;
};

export const getDB = () => {
  if (database) {
    return database;
  } else {
    return init();
  }
};
