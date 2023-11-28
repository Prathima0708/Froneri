import React, {memo} from 'react';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import View from 'src/components/View';
import Text from 'src/components/Text';
import CustomerIconComponent2 from 'src/components/Common/CustomerIconComponent2';
import PillsComponent from 'src/components/Common/PillsComponent';
import {images} from 'src/assets/Images';
import {tw} from 'src/tw';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import {SW_STATUS} from 'src/utils/Constant';
import ExpandableSection from 'src/components/ExpandableSection';
import TodaysTaskExpandableComponenet from './TodaysTaskExpandableComponenet';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface TodaysTasksListingComponentProps {
  item: any;
  index: number;
  lastItem: boolean;
  fromCLP?: boolean;
  onPressExpand: any;
  expandedItemIndex: number;
}

const TodaysTasksListingComponent = (
  props: TodaysTasksListingComponentProps,
) => {
  const {item, index, lastItem, onPressExpand, expandedItemIndex} = props;
  const isExpanded = index === expandedItemIndex;

  const filteredStatus = SW_STATUS.find(
    status => status.title === item?.status,
  );

  const name = item?.name ? item?.name.trim() : '--';
  const customerShipTo = item?.customerShipTo
    ? item?.customerShipTo.trim()
    : '--';
  const description = item?.description ? item?.description.trim() : '--';
  const requestedDate = item?.requestedDate ? item?.requestedDate.trim() : '--';

  return (
    <TouchableOpacity
      style={[
        tw(
          `${
            isExpanded
              ? 'border-0.5 border-light-grey3 '
              : 'border-t-default border-light-lavendar'
          }`,
        ),
        tw('px-1'),
        {
          backgroundColor: colors[index % colors.length],
          marginBottom: isExpanded ? 2 : 0,
        },
      ]}>
      <View
        paddingH-v4
        row
        centerV
        height={72}
        style={[
          tw(
            `${
              lastItem ? 'rounded-b-md' : ''
            } border-t-default border-light-lavendar `,
          ),
          {backgroundColor: colors[index % colors.length]},
        ]}>
        <View flex-2 row centerV marginR-v3>
          <CustomerIconComponent2 item={item} />
          <View marginL-v2 marginR-v4 marginV-v1>
            <TouchableOpacity>
              <Text
                numberOfLines={1}
                text13R
                textBlack
                style={tw(name !== '--' ? 'underline' : '')}>
                {name}
              </Text>
              <Text grey2 text13R style={tw('mt-6px')}>
                {customerShipTo}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View flex-4 marginR-v4>
          <Text numberOfLines={2} text13R grey2>
            {description}
          </Text>
        </View>

        <View flex-3 row>
          <View flex-1 marginR-v4>
            <Text numberOfLines={2} text13R grey2>
              {requestedDate}
            </Text>
          </View>
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
            {filteredStatus && <PillsComponent item={{...filteredStatus}} />}
          </View>
        </View>
        <View centerV>
          <TouchableOpacity onPress={() => onPressExpand(index)}>
            {isExpanded ? <images.UpIcon /> : <images.DownIcon />}
          </TouchableOpacity>
        </View>
      </View>
      <ExpandableSection expanded={isExpanded}>
        <TodaysTaskExpandableComponenet item={item} />
      </ExpandableSection>
    </TouchableOpacity>
  );
};

export default memo(TodaysTasksListingComponent);
