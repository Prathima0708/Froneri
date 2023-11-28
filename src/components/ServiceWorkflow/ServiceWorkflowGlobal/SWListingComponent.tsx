import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import View from 'src/components/View';
import Text from 'src/components/Text';
import CustomerIconComponent2 from 'src/components/Common/CustomerIconComponent2';
import PillsComponent from 'src/components/Common/PillsComponent';

import { tw } from 'src/tw';

import { ColourPalette } from 'src/styles/config/ColoursStyles';

import { SW_STATUS } from 'src/utils/Constant';

import { pageNameCLOverview, pageNameSWBasicInfo } from 'src/routes/Routes';

import PLOverviewController from 'src/controller/PLOverviewController';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface RenderServiceWorkFlowComponentProps {
  item: any;
  index: number;
  lastItem: boolean;
  fromCLP?: boolean;
}

const SWListingComponent = (props: RenderServiceWorkFlowComponentProps) => {
  const { item, index, lastItem, fromCLP = false } = props;

  const navigation = useNavigation();

  const handleSWLandingNavigation = () => {
    if (item.statusType.toLowerCase() === 'c') {
      navigation.navigate(pageNameCLOverview as never, {
        customerInfo: {
          ...item,
          isOrderTakingDisabled: true,
        },
      } as never);
    } else {
      const data = {
        ...item,
        name1: item?.name,
      }
      PLOverviewController.navigateToPLOverview(data)
    }
  };

  const handleNavigation = () => {
    console.log('item :>> ', item);
    navigation.navigate(
      pageNameSWBasicInfo as never,
      {
        data: item,
        isEditable: true,
        fromCLP
      } as never,
    );
  };

  const filteredSWStatus = SW_STATUS.find(status => status.title === item?.status);

  const name = item?.name ? item?.name.trim() : '--';
  const customerShipTo = item?.customerShipTo ? item?.customerShipTo.trim() : '--';
  const requestType = item?.requestType ? item?.requestType.trim() : '--';
  const description = item?.description ? item?.description.trim() : '--';
  const requestedDate = item?.requestedDate ? item?.requestedDate.trim() : '--';

  return (
    <TouchableOpacity onPress={handleNavigation}>
      <View
        paddingH-v4
        row
        centerV
        height={72}
        style={[
          tw(
            `${lastItem ? 'rounded-b-md' : ''
            } border-t-default border-light-lavendar `,
          ),
          { backgroundColor: colors[index % colors.length] },
        ]}>
        {!fromCLP && <View flex-2 row centerV marginR-v4>
          <CustomerIconComponent2 item={item} />
          <View marginL-v2 marginR-v4 marginV-v1>
            <TouchableOpacity onPress={handleSWLandingNavigation}>
              <Text numberOfLines={1} text13R textBlack style={tw(name !== '--' ? 'underline' : "")}>
                {name}
              </Text>
              <Text grey2 text13R style={tw('mt-6px')}>
                {customerShipTo}
              </Text>
            </TouchableOpacity>
          </View>
        </View>}
        <View flex-2 marginR-v4>
          <Text numberOfLines={2} text13R grey2>
            {requestType}
          </Text>
        </View>
        <View flex-2 marginR-v4>
          <Text numberOfLines={2} text13R grey2>
            {description}
          </Text>
        </View>
        <View flex-2 row>
          <View flex-1 marginR-v4>
            <Text numberOfLines={1} text13R grey2>
              {requestedDate}
            </Text>
            {item?.overdue ? (
              <View row style={tw('mt-6px items-center')}>
                <View style={tw('w-2 h-2 rounded-md mr-2 bg-light-red1')} />
                <Text
                  numberOfLines={1}
                  text13R
                  red800
                  style={tw('self-center')}>
                  Overdue
                </Text>
              </View>
            ) : null}
          </View>
          <View flex-1 center>
            {filteredSWStatus && <PillsComponent item={{ ...filteredSWStatus }} />}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(SWListingComponent);
