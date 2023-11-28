import React from 'react';

//auth
const Login = React.lazy(() => import('src/views/auth/Login'));
const SignUp = React.lazy(() => import('src/views/auth/SignUp'));
const ForgotPassword = React.lazy(
  () => import('src/views/auth/ForgotPassword'),
);

//public
const PrivacyPolicy = React.lazy(
  () => import('src/views/public/PrivacyPolicy'),
);
const TermsAndConditions = React.lazy(
  () => import('src/views/public/TermsAndConditions'),
);

//private
const Home = React.lazy(() => import('src/views/private/Home'));
const Sync = React.lazy(() => import('src/views/private/Sync'));
const Visits = React.lazy(() => import('src/views/private/Visits'));
const ServiceWorkflow = React.lazy(
  () => import('src/views/private/ServiceWorkflow/ServiceWorkflowGlobal'),
);
const ProductClaims = React.lazy(
  () => import('src/views/private/ServiceWorkflow/ProductClaims'),
);
const ProductDestroyedByTAClaims = React.lazy(
  () => import('src/views/private/ServiceWorkflow/ProductDestroyedByTAClaims'),
);
const DeliveryMistakesClaim = React.lazy(
  () => import('src/views/private/ServiceWorkflow/DeliveryMistakesClaim'),
);
const MaterialListing = React.lazy(
  () => import('src/views/private/ServiceWorkflow/MaterialListing'),
);
const TodaysTasks = React.lazy(
  () => import('src/views/private/Tasks/TodaysTask'),
);
const AllTasks = React.lazy(() => import('src/views/private/Tasks/AllTasks'));
const Customers = React.lazy(() => import('src/views/private/Customers'));
const Prospects = React.lazy(
  () => import('src/views/private/ProspectManagement/Prospects'),
);
const Delegation = React.lazy(() => import('src/views/private/Delegation'));
const Products = React.lazy(() => import('src/views/private/Products'));
const SalesMaterials = React.lazy(
  () => import('src/views/private/SalesMaterials'),
);
const Help = React.lazy(() => import('src/views/private/Help'));
const CustomerSearch = React.lazy(
  () => import('src/views/private/CustomerSearch'),
);
const CLBasicInfo = React.lazy(
  () => import('src/views/private/CustomerLanding/CLBasicInfo'),
);
const CLConditions = React.lazy(
  () => import('src/views/private/CustomerLanding/CLConditions'),
);
const CLContactHistory = React.lazy(
  () => import('src/views/private/CustomerLanding/CLContactHistory'),
);
const CLContacts = React.lazy(
  () => import('src/views/private/CustomerLanding/CLContacts'),
);
const CLOrderHistory = React.lazy(
  () => import('src/views/private/CustomerLanding/CLOrderHistory'),
);
const CLOverview = React.lazy(
  () => import('src/views/private/CustomerLanding/CLOverview'),
);
const CLSalesMaterials = React.lazy(
  () => import('src/views/private/CustomerLanding/CLSalesMaterials'),
);
const CLServiceWorkflow = React.lazy(
  () => import('src/views/private/CustomerLanding/CLServiceWorkflow'),
);
const CLTasks = React.lazy(
  () => import('src/views/private/CustomerLanding/CLTasks'),
);
const CLTradeAsset = React.lazy(
  () => import('src/views/private/CustomerLanding/CLTradeAsset'),
);
const CLTurnover = React.lazy(
  () => import('src/views/private/CustomerLanding/CLTurnover'),
);
const CLVacation = React.lazy(
  () => import('src/views/private/CustomerLanding/CLVacation'),
);
const CLVisitInfo = React.lazy(
  () => import('src/views/private/CustomerLanding/CLVisitInfo'),
);
const CLProductStatistics = React.lazy(
  () => import('src/views/private/CustomerLanding/CLProductStatistics'),
);
const CLMaterialHierarchy = React.lazy(
  () => import('src/views/private/CustomerLanding/CLMaterialHierarchy'),
);
const PLFinancialInfo = React.lazy(
  () => import('src/views/private/ProspectLanding/PLFinancialInfo'),
);
const PLCustomerAttibutes = React.lazy(
  () => import('src/views/private/ProspectLanding/PLCustomerAttibutes'),
);
const CreateProspect = React.lazy(
  () => import('src/views/private/ProspectManagement/CreateProspect'),
);
const PLOverview = React.lazy(
  () => import('src/views/private/ProspectLanding/PLOverview'),
);
const PLBasicInfo = React.lazy(
  () => import('src/views/private/ProspectLanding/PLBasicInfo'),
);
const SWBasicInfo = React.lazy(
  () => import('src/views/private/ServiceWorkflow/SWFBasicInfo/SWFBasicInfo'),
);
const PLContacts = React.lazy(
  () => import('src/views/private/ProspectLanding/PLContacts'),
);
const PLRCA = React.lazy(
  () => import('src/views/private/ProspectLanding/PLRCA'),
);
const PLTradeAssets = React.lazy(
  () => import('src/views/private/ProspectLanding/PLTradeAssets'),
);
const PLConditionAgreements = React.lazy(
  () => import('src/views/private/ProspectLanding/PLConditionAgreements'),
);
const PLSEPA = React.lazy(
  () => import('src/views/private/ProspectLanding/PLSEPA/PLSEPA'),
);
const PLNotes = React.lazy(
  () => import('src/views/private/ProspectLanding/PLNotes'),
);
const PLTAChargeOff = React.lazy(
  () =>
    import(
      'src/views/private/ProspectLanding/PLTradeAssets/PLTAChargeOff/PLTAChargeOff'
    ),
);
const PLTARequest = React.lazy(
  () =>
    import(
      'src/views/private/ProspectLanding/PLTradeAssets/PLTARequest/PLTARequest'
    ),
);
const TARequestAgreementPreview = React.lazy(
  () =>
    import(
      'src/views/private/ProspectLanding/PLTradeAssets/PLTAPreview/TARequestAgreementPreview'
    ),
);
const TAChargeOffAgreementPreview = React.lazy(
  () =>
    import(
      'src/views/private/ProspectLanding/PLTradeAssets/PLTAPreview/TAChargeOffAgreementPreview'
    ),
);
const PLCreateEditCA = React.lazy(
  () =>
    import(
      'src/views/private/ProspectLanding/PLConditionAgreements/PLCreateEditCA'
    ),
);
const PLSEPAPreview = React.lazy(
  () => import('src/views/private/ProspectLanding/PLSEPA/PLSEPAPreview'),
);

const PLCAPreview = React.lazy(
  () =>
    import(
      'src/views/private/ProspectLanding/PLConditionAgreements/PLCAPreview/PLCAPreview'
    ),
);

const Test = React.lazy(
  () => import('src/views/private/Test/Test'),
);

/**
 * NOTE: Page Names Should not have any SPACES, SPECIAL CHARS, ETC.
 */
// page names - auth
export const pageNameAuthStack = 'AuthStack';
export const pageNameLogin = 'Login';
export const pageNameSignUp = 'SignUp';
export const pageNameForgotPassword = 'ForgotPassword';

// page names - public
export const pageNamePublicStack = 'PublicStack';
export const pageNamePrivacyPolicy = 'PrivacyPolicy';
export const pageNameTermsAndConditions = 'TermsAndConditions';

// page names - private
export const pageNamePrivateStack = 'PrivateStack';
export const pageNameHomeStack = 'HomeStack';
export const pageNameSync = 'Sync';
export const pageNameHome = 'Home';
export const pageNameVisits = 'Visits';
// export const pageNameServiceWorkflow = 'ServiceWorkflowGlobal';
export const pageNameDeliveryMistakesClaim = ' DeliveryMistakesClaim';
export const pageNameMaterialListing = 'MaterialListing';
export const pageNameSWBasicInfo = 'SWBasicInfo';
export const pageNameServiceWorkflow = 'ServiceWorkflow';
export const pageNameProductClaims = 'ProductClaims';
export const pageNameProductDestroyedByTAClaims = 'ProductDestroyedByTAClaims';
export const pageNameTodaysTasks = 'TodaysTasks';
export const pageNameAllTasks = 'AllTasks';
export const pageNameCustomers = 'Customers';
export const pageNameProspects = 'Prospects';
export const pageNameCreateProspect = 'CreateProspect';
export const pageNameDelegation = 'Delegation';
export const pageNameProducts = 'Products';
export const pageNameSalesMaterials = 'SalesMaterials';
export const pageNameHelp = 'Help';
export const pageNameCustomerSearch = 'CustomerSearch';
export const pageNameCLOverview = 'CLOverview';
export const pageNameCLBasicInfo = 'CLBasicInfo';
export const pageNameCLVisitInfo = 'CLVisitInfo';
export const pageNameCLContacts = 'CLContacts';
export const pageNameCLTasks = 'CLTasks';
export const pageNameCLServiceWorkflow = 'CLServiceWorkflow';
export const pageNameCLTurnover = 'CLTurnover';
export const pageNameCLOrderHistory = 'CLOrderHistory';
export const pageNameCLTradeAsset = 'CLTradeAsset';
export const pageNameCLSalesMaterials = 'CLSalesMaterials';
export const pageNameCLContactHistory = 'CLContactHistory';
export const pageNameCLConditions = 'CLConditions';
export const pageNameCLVacation = 'CLVacation';
export const pageNameCLProductStatistics = 'CLProductStatistics';
export const pageNameCLMaterialHierarchy = 'CLMaterialHierarchy';
export const pageNamePLFinancialInfo = 'PLFinancialInfo';
export const pageNamePLCustomerAttibutes = 'PLCustomerAttibutes';
export const pageNamePLOverview = 'PLOverview';
export const pageNamePLBasicInfo = 'PLBasicInfo';
export const pageNamePLContacts = 'PLContacts';
export const pageNamePLRCA = 'PLRCA';
export const pageNamePLTradeAssets = 'PLTradeAssets';
export const pageNamePLConditionAgreements = 'PLConditionAgreements';
export const pageNamePLSEPA = 'PLSEPA';
export const pageNamePLNotes = 'PLNotes';
export const pageNamePLTAChargeOff = 'PLTAChargeOff';
export const pageNamePLTARequest = 'PLTARequest';
export const pageNamePLTARequestAgreementPreview = 'TARequestAgreementPreview';
export const pageNamePLTAChargeOffAgreementPreview =
  'TAChargeOffAgreementPreview';
export const pageNamePLCreateEditCA = 'PLCreateEditCA';
export const pageNamePLSEPAPreview = 'PLSEPAPreview';
export const pageNamePLCAPreview = 'PLCAPreview';

export const pageNameTest = 'Test';

// pages - auth
export const pageLogin = Login;
export const pageSignUp = SignUp;
export const pageForgotPassword = ForgotPassword;

// pages - public
export const pagePrivacyPolicy = PrivacyPolicy;
export const pageTermsAndConditions = TermsAndConditions;

// pages - private
export const pageHome = Home;
export const pageVisits = Visits;
export const pageSync = Sync;
export const pageServiceWorkflow = ServiceWorkflow;
export const pageProductClaims = ProductClaims;
export const pageProductDestroyedByTAClaims = ProductDestroyedByTAClaims;
export const pageDeliveryMistakesClaim = DeliveryMistakesClaim;
export const pageMaterialListing = MaterialListing;
export const pageTodaysTasks = TodaysTasks;
export const pageAllTasks = AllTasks;
export const pageCustomers = Customers;
export const pageProspects = Prospects;
export const pageCreateProspect = CreateProspect;
export const pageDelegation = Delegation;
export const pageProducts = Products;
export const pageSalesMaterials = SalesMaterials;
export const pageHelp = Help;
export const pageCustomerSearch = CustomerSearch;
export const pageCLOverview = CLOverview;
export const pageCLBasicInfo = CLBasicInfo;
export const pageCLVisitInfo = CLVisitInfo;
export const pageCLContacts = CLContacts;
export const pageCLTasks = CLTasks;
export const pageCLServiceWorkflow = CLServiceWorkflow;
export const pageCLTurnover = CLTurnover;
export const pageCLOrderHistory = CLOrderHistory;
export const pageCLTradeAsset = CLTradeAsset;
export const pageCLSalesMaterials = CLSalesMaterials;
export const pageCLContactHistory = CLContactHistory;
export const pageCLConditions = CLConditions;
export const pageCLVacation = CLVacation;
export const pageCLProductStatistics = CLProductStatistics;
export const pageCLMaterialHierarchy = CLMaterialHierarchy;
export const pagePLFinancialInfo = PLFinancialInfo;
export const pagePLCustomerAttibutes = PLCustomerAttibutes;
export const pagePLOverview = PLOverview;
export const pagePLBasicInfo = PLBasicInfo;
export const pageSWBasicInfo = SWBasicInfo;
export const pagePLContacts = PLContacts;
export const pagePLRCA = PLRCA;
export const pagePLTradeAssets = PLTradeAssets;
export const pagePLConditionAgreements = PLConditionAgreements;
export const pagePLSEPA = PLSEPA;
export const pagePLNotes = PLNotes;
export const pagePLTAChargeOff = PLTAChargeOff;
export const pagePLTARequest = PLTARequest;
export const pagePLTARequestAgreementPreview = TARequestAgreementPreview;
export const pagePLTAChargeOffAgreementPreview = TAChargeOffAgreementPreview;
export const pagePLCreateEditCA = PLCreateEditCA;
export const pagePLSEPAPreview = PLSEPAPreview;
export const pagePLCAPreview = PLCAPreview;
