import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { images } from 'src/assets/Images';
import React, { useEffect, useRef } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { PROSPECT_LANDING_SCREENS } from 'src/utils/Constant';
import { useNavigation, StackActions } from '@react-navigation/native';
import * as ROUTES from 'src/routes/Routes';
import { scale } from 'src/styles/scaling';
import { RootState, useAppSelector } from 'src/reducers/hooks';

interface PLLeftMenuComponentProps {
  activeTab: string;
}

const PLLeftMenuComponent = (props: PLLeftMenuComponentProps) => {
  const { activeTab } = props;

  const prospectData = useAppSelector(
    (state: RootState) => state.prospectLanding.prospectInfo,
  );

  const isScreenVisible =
    prospectData?.statusType && prospectData?.statusType.toLowerCase() === 'p';

  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (
      activeTab === PROSPECT_LANDING_SCREENS.TRADE_ASSET ||
      activeTab === PROSPECT_LANDING_SCREENS.CONDITION_AGGREMENTS ||
      activeTab === PROSPECT_LANDING_SCREENS.SEPA ||
      activeTab === PROSPECT_LANDING_SCREENS.NOTES
    ) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, []);

  const PLScreens = [
    {
      title: PROSPECT_LANDING_SCREENS.OVERVIEW,
      activeIcon: images.OverviewActiveIcon,
      inActiveIcon: images.OverviewInactiveIcon,
    },
    {
      title: PROSPECT_LANDING_SCREENS.BASIC_INFO,
      activeIcon: images.BasicInfoActiveIcon,
      inActiveIcon: images.BasicInfoInactiveIcon,
    },
    {
      title: PROSPECT_LANDING_SCREENS.CUSTOMER_ATTRIBUTE,
      activeIcon: images.CustomerAttributeActiveIcon,
      inActiveIcon: images.CustomerAttributeInactiveIcon,
    },
    {
      title: PROSPECT_LANDING_SCREENS.CONTACTS,
      activeIcon: images.ContactActiveIcon,
      inActiveIcon: images.ContactInactiveIcon,
    },
    {
      title: PROSPECT_LANDING_SCREENS.RCA,
      activeIcon: images.VisitInfoActiveIcon,
      inActiveIcon: images.VisitInfoInactiveIcon,
    },
    {
      title: PROSPECT_LANDING_SCREENS.FINANCIAL_INFO,
      activeIcon: images.TurnoverActiveIcon,
      inActiveIcon: images.TurnoverInactiveIcon,
    },
    {
      title: PROSPECT_LANDING_SCREENS.TRADE_ASSET,
      activeIcon: images.TradeAssestActiveIcon,
      inActiveIcon: images.TradeAssetInactiveIcon,
    },
    {
      title: PROSPECT_LANDING_SCREENS.CONDITION_AGGREMENTS,
      activeIcon: images.ConditionAgreementActiveIcon,
      inActiveIcon: images.ConditionAgreementInactiveIcon,
    },
    {
      title: PROSPECT_LANDING_SCREENS.SEPA,
      activeIcon: images.SepaActiveIcon,
      inActiveIcon: images.SepaInactiveIcon,
    },
    {
      title: PROSPECT_LANDING_SCREENS.NOTES,
      activeIcon: images.NotesActiveIcon,
      inActiveIcon: images.NotesInactiveIcon,
    },
  ];

  const handleScreens = (screen: string) => {
    if (screen === PROSPECT_LANDING_SCREENS.OVERVIEW) {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNamePLOverview as never),
      );
    } else if (screen === PROSPECT_LANDING_SCREENS.BASIC_INFO) {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNamePLBasicInfo as never),
      );
    } else if (screen === PROSPECT_LANDING_SCREENS.CUSTOMER_ATTRIBUTE) {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNamePLCustomerAttibutes as never),
      );
    } else if (screen === PROSPECT_LANDING_SCREENS.CONTACTS) {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNamePLContacts as never),
      );
    } else if (screen === PROSPECT_LANDING_SCREENS.RCA) {
      navigation.dispatch(StackActions.replace(ROUTES.pageNamePLRCA as never));
    } else if (screen === PROSPECT_LANDING_SCREENS.FINANCIAL_INFO) {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNamePLFinancialInfo as never),
      );
    } else if (screen === PROSPECT_LANDING_SCREENS.TRADE_ASSET) {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNamePLTradeAssets as never),
      );
    } else if (screen === PROSPECT_LANDING_SCREENS.CONDITION_AGGREMENTS) {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNamePLConditionAgreements as never),
      );
    } else if (screen === PROSPECT_LANDING_SCREENS.SEPA) {
      navigation.dispatch(StackActions.replace(ROUTES.pageNamePLSEPA as never));
    } else {
      navigation.dispatch(
        StackActions.replace(ROUTES.pageNamePLNotes as never),
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
      style={{ width: scale(92) }}>
      <ScrollView showsVerticalScrollIndicator={false} ref={scrollViewRef} keyboardShouldPersistTaps="always">
        {PLScreens.map(item => {
          if (
            (item.title === PROSPECT_LANDING_SCREENS.OVERVIEW ||
              item.title === PROSPECT_LANDING_SCREENS.NOTES) &&
            !isScreenVisible
          ) {
            return null;
          }

          return (
            <TouchableOpacity
              key={item.title}
              style={tw('justify-center items-center my-3')}
              onPress={() => handleScreens(item.title)}>
              {activeTab === item.title ? (
                <item.activeIcon />
              ) : (
                <item.inActiveIcon />
              )}
              <Text
                numberOfLines={1}
                Text13R
                style={tw(
                  `${activeTab === item.title
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

export default PLLeftMenuComponent;
