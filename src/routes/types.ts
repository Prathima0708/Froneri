export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};
export type DrawerTabProps = {
  Home: undefined;
  Visits: undefined;
  ServiceWorkflow: undefined;
  Tasks: undefined;
  Customers: undefined;
  Prospects: undefined;
  Delegation: undefined;
  Products: undefined;
  SalesMaterials: undefined;
  Help: undefined;
};
export type PrivateStackParamList = {
  HomeStack: {
    name?: keyof DrawerTabProps;
    key?: string | undefined;
    params?: undefined;
  };
  Visits: undefined;
  Sync: undefined;
  ServiceWorkflow: undefined;
  Tasks: undefined;
  Customers: undefined;
  AllTasks: undefined;
  Prospects: undefined;
  PLFinancialInfo: undefined;
  PLCustomerAttibutes: undefined;
  PLOverview: undefined;
  PLBasicInfo: undefined;
  PLContacts: undefined;
  PLRCA: undefined;
  PLTradeAssets: undefined;
  PLConditionAgreements: undefined;
  ProductDestroyedByTAClaims: undefined;
  PLSEPA: undefined;
  PLNotes: undefined;
  Delegation: undefined;
  Products: undefined;
  SalesMaterials: undefined;
  Help: undefined;
  CustomerSearch: undefined;
  CLOverview: undefined;
  CLBasicInfo: undefined;
  CLVisitInfo: undefined;
  CLContacts: undefined;
  CLTasks: undefined;
  CLServiceWorkflow: undefined;
  CLTurnover: undefined;
  CLOrderHistory: undefined;
  CLTradeAsset: undefined;
  CLSalesMaterials: undefined;
  CLContactHistory: undefined;
  CLConditions: undefined;
  CLVacation: undefined;
  CLProductStatistics: undefined;
  CLMaterialHierarchy: undefined;
  PLCreateEditCA: undefined;
};

export type PublicStackParamList = {
  PrivacyPolicy: undefined;
  TermsAndConditions: undefined;
};
