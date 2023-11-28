import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import * as ROUTES from 'src/routes/Routes';
import { DRAWER_LABELS } from 'src/utils/Constant';
import { images } from 'src/assets/Images';
import { ColourPalette } from 'src/styles/config/ColoursStyles';

import {
  AuthStackParamList,
  DrawerTabProps,
  PrivateStackParamList,
  PublicStackParamList,
} from './types';
import DrawerMenu from './DrawerMenu';
import { scale } from 'src/styles/scaling';
const AuthStack = createStackNavigator<AuthStackParamList>();
const PublicStack = createStackNavigator<PublicStackParamList>();
const PrivateStack = createStackNavigator<PrivateStackParamList>();
const DrawerStack = createDrawerNavigator<DrawerTabProps>();

export const RootStack = createStackNavigator<
  AuthStackParamList & PublicStackParamList & PrivateStackParamList
>();

const drawerMenuItems = [
  {
    label: DRAWER_LABELS.HOME,
    name: ROUTES.pageNameHome,
    activeImage: images.HomeIconActive,
    inactiveImage: images.HomeIconInactive,
    component: ROUTES.pageHome,
  },
  {
    label: DRAWER_LABELS.VISITS,
    name: ROUTES.pageNameVisits,
    activeImage: images.VisitsIconActive,
    inactiveImage: images.VisitsIconInactive,
    component: ROUTES.pageVisits,
  },
  {
    label: DRAWER_LABELS.SERVICE_WORKFLOW,
    name: ROUTES.pageNameServiceWorkflow,
    activeImage: images.ServiceWorkflowIconActive,
    inactiveImage: images.ServiceWorkflowIconInactive,
    component: ROUTES.pageServiceWorkflow,
  },
  {
    label: DRAWER_LABELS.TASKS,
    name: ROUTES.pageNameTodaysTasks,
    activeImage: images.TasksIconActive,
    inactiveImage: images.TasksIconInactive,
    component: ROUTES.pageTodaysTasks,
  },
  {
    label: DRAWER_LABELS.CUSTOMERS,
    name: ROUTES.pageNameCustomerSearch,
    activeImage: images.CustomersIconActive,
    inactiveImage: images.CustomersIconInactive,
    component: ROUTES.pageCustomerSearch,
  },
  {
    label: DRAWER_LABELS.PROSPECTS,
    name: ROUTES.pageNameProspects,
    activeImage: images.ProspectsIconActive,
    inactiveImage: images.ProspectsIconInactive,
    component: ROUTES.pageProspects,
  },
  {
    label: DRAWER_LABELS.DELEGATION,
    name: ROUTES.pageNameDelegation,
    activeImage: images.DelegationIconActive,
    inactiveImage: images.DelegationIconInactive,
    component: ROUTES.pageDelegation,
  },
  {
    label: DRAWER_LABELS.PRODUCTS,
    name: ROUTES.pageNameProducts,
    activeImage: images.ProductIconActive,
    inactiveImage: images.ProductsIconInactive,
    component: ROUTES.pageProducts,
  },
  {
    label: DRAWER_LABELS.SALES_MATERIALS,
    name: ROUTES.pageNameSalesMaterials,
    activeImage: images.SalesMaterialsIconActive,
    inactiveImage: images.SalesMaterialsIconInactive,
    component: ROUTES.pageSalesMaterials,
  },
  {
    label: DRAWER_LABELS.HELP,
    name: ROUTES.pageNameHelp,
    activeImage: images.HelpIconActive,
    inactiveImage: images.HelpIconInactive,
    component: ROUTES.pageHelp,
  },
  {
    label: DRAWER_LABELS.HELP,
    name: ROUTES.pageNameTest,
    activeImage: images.HelpIconActive,
    inactiveImage: images.HelpIconInactive,
    component: ROUTES.pageHelp,
  },
];

export const noHeaderOptions = {};

export const AuthRoutes = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        key={ROUTES.pageNameLogin}
        name={ROUTES.pageNameLogin}
        component={ROUTES.pageLogin}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        key={ROUTES.pageNameSignUp}
        name={ROUTES.pageNameSignUp}
        component={ROUTES.pageSignUp}
      />

      <AuthStack.Screen
        key={ROUTES.pageNameForgotPassword}
        name={ROUTES.pageNameForgotPassword}
        component={ROUTES.pageForgotPassword}
      />
    </AuthStack.Navigator>
  );
};

export const PublicRoutes = () => {
  return (
    <PublicStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: ColourPalette.light.reddishOrange,
        },
        headerTintColor: ColourPalette.light.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <PublicStack.Screen
        key={ROUTES.pageNamePrivacyPolicy}
        name={ROUTES.pageNamePrivacyPolicy}
        component={ROUTES.pagePrivacyPolicy}
        options={{
          title: 'Privacy Policy',
          headerShown: true,
          headerBackTitle: ' ',
        }}
      />
      <PublicStack.Screen
        key={ROUTES.pageNameTermsAndConditions}
        name={ROUTES.pageNameTermsAndConditions}
        component={ROUTES.pageTermsAndConditions}
        options={{
          title: 'Terms & Conditions',
          headerShown: true,
          headerBackTitle: 'Back',
        }}
      />
    </PublicStack.Navigator>
  );
};

export const HomeDrawerView = () => {
  return (
    <DrawerStack.Navigator
      useLegacyImplementation
      drawerContent={props => (
        <DrawerMenu {...props} drawerMenuItems={drawerMenuItems} />
      )}
      screenOptions={{
        swipeEnabled: false,
        drawerStyle: {
          width: scale(250),
        },
        headerShown: false,
      }}>
      {drawerMenuItems.map(item => {
        return (
          <DrawerStack.Screen
            key={item.name}
            name={item.name}
            component={item.component}
          />
        );
      })}
    </DrawerStack.Navigator>
  );
};

export const PrivateRoutes = () => {
  return (
    <PrivateStack.Navigator screenOptions={{ headerShown: false }}>
      <PrivateStack.Screen
        key={ROUTES.pageNameHomeStack}
        name={ROUTES.pageNameHomeStack}
        component={HomeDrawerView}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameSync}
        name={ROUTES.pageNameSync}
        component={ROUTES.pageSync}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameCustomerSearch}
        name={ROUTES.pageNameCustomerSearch}
        component={ROUTES.pageCustomerSearch}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameCLOverview}
        name={ROUTES.pageNameCLOverview}
        component={ROUTES.pageCLOverview}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameCLBasicInfo}
        name={ROUTES.pageNameCLBasicInfo}
        component={ROUTES.pageCLBasicInfo}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameCLVisitInfo}
        name={ROUTES.pageNameCLVisitInfo}
        component={ROUTES.pageCLVisitInfo}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameCLContacts}
        name={ROUTES.pageNameCLContacts}
        component={ROUTES.pageCLContacts}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameCLTasks}
        name={ROUTES.pageNameCLTasks}
        component={ROUTES.pageCLTasks}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameCLServiceWorkflow}
        name={ROUTES.pageNameCLServiceWorkflow}
        component={ROUTES.pageCLServiceWorkflow}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameCLTurnover}
        name={ROUTES.pageNameCLTurnover}
        component={ROUTES.pageCLTurnover}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameCLOrderHistory}
        name={ROUTES.pageNameCLOrderHistory}
        component={ROUTES.pageCLOrderHistory}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameCLTradeAsset}
        name={ROUTES.pageNameCLTradeAsset}
        component={ROUTES.pageCLTradeAsset}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameCLSalesMaterials}
        name={ROUTES.pageNameCLSalesMaterials}
        component={ROUTES.pageCLSalesMaterials}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameCLContactHistory}
        name={ROUTES.pageNameCLContactHistory}
        component={ROUTES.pageCLContactHistory}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameCLConditions}
        name={ROUTES.pageNameCLConditions}
        component={ROUTES.pageCLConditions}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameCLVacation}
        name={ROUTES.pageNameCLVacation}
        component={ROUTES.pageCLVacation}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameCLProductStatistics}
        name={ROUTES.pageNameCLProductStatistics}
        component={ROUTES.pageCLProductStatistics}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameCLMaterialHierarchy}
        name={ROUTES.pageNameCLMaterialHierarchy}
        component={ROUTES.pageCLMaterialHierarchy}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNamePLFinancialInfo}
        name={ROUTES.pageNamePLFinancialInfo}
        component={ROUTES.pagePLFinancialInfo}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNamePLCustomerAttibutes}
        name={ROUTES.pageNamePLCustomerAttibutes}
        component={ROUTES.pagePLCustomerAttibutes}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameCreateProspect}
        name={ROUTES.pageNameCreateProspect}
        component={ROUTES.pageCreateProspect}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNamePLOverview}
        name={ROUTES.pageNamePLOverview}
        component={ROUTES.pagePLOverview}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNamePLBasicInfo}
        name={ROUTES.pageNamePLBasicInfo}
        component={ROUTES.pagePLBasicInfo}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNamePLContacts}
        name={ROUTES.pageNamePLContacts}
        component={ROUTES.pagePLContacts}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNamePLRCA}
        name={ROUTES.pageNamePLRCA}
        component={ROUTES.pagePLRCA}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNamePLTradeAssets}
        name={ROUTES.pageNamePLTradeAssets}
        component={ROUTES.pagePLTradeAssets}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNamePLConditionAgreements}
        name={ROUTES.pageNamePLConditionAgreements}
        component={ROUTES.pagePLConditionAgreements}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNamePLSEPA}
        name={ROUTES.pageNamePLSEPA}
        component={ROUTES.pagePLSEPA}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNamePLNotes}
        name={ROUTES.pageNamePLNotes}
        component={ROUTES.pagePLNotes}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNamePLTAChargeOff}
        name={ROUTES.pageNamePLTAChargeOff}
        component={ROUTES.pagePLTAChargeOff}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNamePLTARequest}
        name={ROUTES.pageNamePLTARequest}
        component={ROUTES.pagePLTARequest}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNamePLTARequestAgreementPreview}
        name={ROUTES.pageNamePLTARequestAgreementPreview}
        component={ROUTES.pagePLTARequestAgreementPreview}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNamePLTAChargeOffAgreementPreview}
        name={ROUTES.pageNamePLTAChargeOffAgreementPreview}
        component={ROUTES.pagePLTAChargeOffAgreementPreview}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNamePLCreateEditCA}
        name={ROUTES.pageNamePLCreateEditCA}
        component={ROUTES.pagePLCreateEditCA}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNamePLSEPAPreview}
        name={ROUTES.pageNamePLSEPAPreview}
        component={ROUTES.pagePLSEPAPreview}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNamePLCAPreview}
        name={ROUTES.pageNamePLCAPreview}
        component={ROUTES.pagePLCAPreview}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameDeliveryMistakesClaim}
        name={ROUTES.pageNameDeliveryMistakesClaim}
        component={ROUTES.pageDeliveryMistakesClaim}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameProductDestroyedByTAClaims}
        name={ROUTES.pageNameProductDestroyedByTAClaims}
        component={ROUTES.pageProductDestroyedByTAClaims}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameMaterialListing}
        name={ROUTES.pageNameMaterialListing}
        component={ROUTES.pageMaterialListing}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameSWBasicInfo}
        name={ROUTES.pageNameSWBasicInfo}
        component={ROUTES.pageSWBasicInfo}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameAllTasks}
        name={ROUTES.pageNameAllTasks}
        component={ROUTES.pageAllTasks}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <PrivateStack.Screen
        key={ROUTES.pageNameProductClaims}
        name={ROUTES.pageNameProductClaims}
        component={ROUTES.pageProductClaims}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
    </PrivateStack.Navigator>
  );
};
