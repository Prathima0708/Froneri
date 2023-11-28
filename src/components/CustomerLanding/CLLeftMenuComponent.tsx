import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import {images} from 'src/assets/Images';
import React, {useEffect, useRef} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native';
import {CUSTOMER_LANDING_SCREENS} from 'src/utils/Constant';
import {useNavigation, StackActions} from '@react-navigation/native';
import * as ROUTES from 'src/routes/Routes';
import {scale} from 'src/styles/scaling';

interface CLLeftMenuComponentProps {
  activeTab: string;
}

const CLLeftMenuComponent = (props: CLLeftMenuComponentProps) => {
  const {activeTab} = props;
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (
      activeTab == CUSTOMER_LANDING_SCREENS.TURNOVER ||
      activeTab == CUSTOMER_LANDING_SCREENS.ORDER_HISTORY ||
      activeTab == CUSTOMER_LANDING_SCREENS.TRADE_ASSET ||
      activeTab == CUSTOMER_LANDING_SCREENS.SALES_MATERIALS ||
      activeTab == CUSTOMER_LANDING_SCREENS.CONTACT_HISTORY ||
      activeTab == CUSTOMER_LANDING_SCREENS.CONDITIONS ||
      activeTab == CUSTOMER_LANDING_SCREENS.VACATION
    ) {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }
  }, []);

  const CLScreens = [
    {
      title: CUSTOMER_LANDING_SCREENS.OVERVIEW,
      activeIcon: images.OverviewActiveIcon,
      inActiveIcon: images.OverviewInactiveIcon,
    },
    {
      title: CUSTOMER_LANDING_SCREENS.BASIC_INFO,
      activeIcon: images.BasicInfoActiveIcon,
      inActiveIcon: images.BasicInfoInactiveIcon,
    },
    {
      title: CUSTOMER_LANDING_SCREENS.VISIT_INFO,
      activeIcon: images.VisitInfoActiveIcon,
      inActiveIcon: images.VisitInfoInactiveIcon,
    },
    {
      title: CUSTOMER_LANDING_SCREENS.CONTACTS,
      activeIcon: images.ContactActiveIcon,
      inActiveIcon: images.ContactInactiveIcon,
    },
    {
      title: CUSTOMER_LANDING_SCREENS.TASKS,
      activeIcon: images.CLTasksActiveIcon,
      inActiveIcon: images.CLTasksInactiveIcon,
    },
    {
      title: CUSTOMER_LANDING_SCREENS.SERVICE_WORKFLOW,
      activeIcon: images.CLServiceWorkflowActiveIcon,
      inActiveIcon: images.CLServiceWorkflowInactiveIcon,
    },
    {
      title: CUSTOMER_LANDING_SCREENS.TURNOVER,
      activeIcon: images.TurnoverActiveIcon,
      inActiveIcon: images.TurnoverInactiveIcon,
    },
    {
      title: CUSTOMER_LANDING_SCREENS.ORDER_HISTORY,
      activeIcon: images.OrderHistoryActiveIcon,
      inActiveIcon: images.OrderHistoryInactiveIcon,
    },
    {
      title: CUSTOMER_LANDING_SCREENS.TRADE_ASSET,
      activeIcon: images.TradeAssestActiveIcon,
      inActiveIcon: images.TradeAssetInactiveIcon,
    },
    {
      title: CUSTOMER_LANDING_SCREENS.SALES_MATERIALS,
      activeIcon: images.CLSalesMaterialsActiveIcon,
      inActiveIcon: images.CLSalesMaterialsInactiveIcon,
    },
    {
      title: CUSTOMER_LANDING_SCREENS.CONTACT_HISTORY,
      activeIcon: images.ContactHistoryActiveIcon,
      inActiveIcon: images.ContactHistoryInactiveIcon,
    },
    {
      title: CUSTOMER_LANDING_SCREENS.CONDITIONS,
      activeIcon: images.ConditionActiveIcon,
      inActiveIcon: images.ConditionsInactiveIcon,
    },
    {
      title: CUSTOMER_LANDING_SCREENS.VACATION,
      activeIcon: images.VacationActiveIcon,
      inActiveIcon: images.VacationInactiveIcon,
    },
  ];

  const handleScreens = (screen: string) => {
    if (screen == CUSTOMER_LANDING_SCREENS.OVERVIEW) {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNameCLOverview as never),
      );
    } else if (screen == CUSTOMER_LANDING_SCREENS.BASIC_INFO) {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNameCLBasicInfo as never),
      );
    } else if (screen == CUSTOMER_LANDING_SCREENS.VISIT_INFO) {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNameCLVisitInfo as never),
      );
    } else if (screen == CUSTOMER_LANDING_SCREENS.CONTACTS) {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNameCLContacts as never),
      );
    } else if (screen == CUSTOMER_LANDING_SCREENS.TASKS) {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNameCLTasks as never),
      );
    } else if (screen == CUSTOMER_LANDING_SCREENS.SERVICE_WORKFLOW) {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNameCLServiceWorkflow as never),
      );
    } else if (screen == CUSTOMER_LANDING_SCREENS.TURNOVER) {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNameCLTurnover as never),
      );
    } else if (screen == CUSTOMER_LANDING_SCREENS.ORDER_HISTORY) {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNameCLOrderHistory as never),
      );
    } else if (screen == CUSTOMER_LANDING_SCREENS.TRADE_ASSET) {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNameCLTradeAsset as never),
      );
    } else if (screen == CUSTOMER_LANDING_SCREENS.SALES_MATERIALS) {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNameCLSalesMaterials as never),
      );
    } else if (screen == CUSTOMER_LANDING_SCREENS.CONTACT_HISTORY) {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNameCLContactHistory as never),
      );
    } else if (screen == CUSTOMER_LANDING_SCREENS.CONDITIONS) {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNameCLConditions as never),
      );
    } else {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNameCLVacation as never),
      );
    }
  };

  return (
    <View
      bg-white
      marginH-v2
      br40
      marginB-v2
      padding-v2
      style={{width: scale(92)}}>
      <ScrollView showsVerticalScrollIndicator={false} ref={scrollViewRef}>
        {CLScreens.map((item, i) => {
          return (
            <TouchableOpacity
              key={item.title}
              style={tw('justify-center items-center my-3')}
              onPress={() => handleScreens(item.title)}>
              {activeTab == item.title ? (
                <item.activeIcon />
              ) : (
                <item.inActiveIcon />
              )}
              <Text
                numberOfLines={1}
                Text13R
                style={tw(
                  `${
                    activeTab == item.title
                      ? 'text-light-darkBlue'
                      : 'text-light-textBlack'
                  } text-center w-full`,
                )}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CLLeftMenuComponent;
