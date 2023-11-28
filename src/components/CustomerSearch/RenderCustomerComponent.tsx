import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import React, { memo, useState } from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { images } from 'src/assets/Images';
import { tw } from 'src/tw';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import ExpandableSection from 'src/components/ExpandableSection';
import ExpandableComponent from 'src/components/CustomerSearch/ExpandableComponent';
import CustomerIconComponent2 from 'src/components/Common/CustomerIconComponent2';
import { useNavigation } from '@react-navigation/native';
import { pageNameCLOverview, pageNameVisits } from 'src/routes/Routes';
import { useAppDispatch } from 'src/reducers/hooks';
import { resetCustomerLandingState } from 'src/reducers/CustomerLandingSlice';
import PLOverviewController from 'src/controller/PLOverviewController';

let colors = [ColourPalette.light.white, ColourPalette.light.offWhite];

interface RenderCustomerSearchProps {
  item: any;
  index: number;
  getSelectedCustomerItem: any;
  selected: boolean;
  fromScreen: string;
  expandedItemIndex: number;
  onPressExpand: any;
}
const RenderCustomerComponent = (props: RenderCustomerSearchProps) => {
  const {
    item,
    index,
    getSelectedCustomerItem,
    selected,
    fromScreen,
    expandedItemIndex,
    onPressExpand,
  } = props;

  const dispatch = useAppDispatch();

  const isExpanded = index === expandedItemIndex;
  const navigation = useNavigation();

  let name2 = '';
  if (
    item.name2 &&
    item.name2 !== 'NULL' &&
    item.name3 &&
    item.name3 !== 'NULL'
  ) {
    name2 = item.name2 + ' ' + item.name3;
  } else if (item.name2 && item.name2 !== 'NULL') {
    name2 = item.name2;
  } else if (item.name3 && item.name3 !== 'NULL') {
    name2 = item.name3;
  }

  let address = item.address1 + ' ' + item.city + ' ' + item.postalCode;

  let lastVisitDatetime = item.lastVisitDatetime
    ? item.lastVisitDatetime
    : '--';
  let isActiveCustomer = item.isActiveCustomer;

  const handleSelectCustomer = (selectedItem: boolean) => {
    getSelectedCustomerItem && getSelectedCustomerItem(selectedItem);
  };

  const handleCustomerLandingNavigation = () => {
    if (item.statusType.toLowerCase() === 'c') {
      navigation.navigate(pageNameCLOverview as never, {
        customerInfo: item,
      } as never);
    } else {
      PLOverviewController.navigateToPLOverview(item)
    }
  };

  return (
    <View
      style={{
        backgroundColor: isActiveCustomer
          ? colors[index % colors.length]
          : ColourPalette.light.orange4,
      }}>
      <View row centerV padding-v2 br20>
        <View
          row
          centerV
          style={tw(`${fromScreen === pageNameVisits ? 'flex-2' : 'flex-1'}`)}>
          {/* <CheckBox
              marginR-v2
              value={selected ? selected : false}
              onValueChange={() => {
                console.log("Current item :>> ", index, item)
                handleSelectCustomer(item)
              }}
              color={
                selected
                  ? ColourPalette.light.darkBlue
                  : ColourPalette.light.grey4
              }
            /> */}
          {fromScreen === pageNameVisits && (
            <TouchableWithoutFeedback
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => {
                handleSelectCustomer(item)
              }}>
              <View
                marginR-v2>
                {selected ?
                  <images.CheckBox /> :
                  <View
                    style={tw(`h-6 w-6 border-default rounded-md border-light-grey4 bg-light-white`)} />
                }
              </View>
            </TouchableWithoutFeedback>
          )}
          <View marginH-v2>
            <CustomerIconComponent2 item={item} />
          </View>
        </View>
        <View row flex-16 style={tw('justify-between')}>
          <View flex-4 marginR-v5>
            <TouchableOpacity onPress={handleCustomerLandingNavigation}>
              <Text numberOfLines={1} text13R textBlack style={tw('underline')}>
                {item.name1}
              </Text>
              <Text textLight text13R marginT-v1>
                {item.customerShipTo}
              </Text>
            </TouchableOpacity>
          </View>
          <View flex-4 marginR-v5>
            <Text numberOfLines={2} text13R textLight>
              {name2}
            </Text>
          </View>
          <View flex-4 marginR-v5>
            <Text numberOfLines={2} textLight text13R>
              {address}
            </Text>
          </View>
          <View flex-2 marginR-v6>
            <Text textLight text13R style={tw('text-left')}>
              label.customersearch.last_visited_on
            </Text>
            <Text textLight text13R style={tw('text-left')}>
              {lastVisitDatetime}
            </Text>
          </View>

          <View flex centerH marginR-v3>
            {isActiveCustomer ? null : (
              <View row centerV>
                <View
                  style={tw('bg-light-orange2 h-3 w-3 rounded-md mr-1')}></View>
                <Text text13R orange3>
                  label.customersearch.inactive
                </Text>
              </View>
            )}
          </View>

          <View flex centerV right>
            <TouchableOpacity onPress={() => onPressExpand(index)}>
              {isExpanded ? <images.UpIcon /> : <images.DownIcon />}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ExpandableSection expanded={isExpanded}>
        <ExpandableComponent
          background={
            isActiveCustomer
              ? colors[index % colors.length]
              : ColourPalette.light.orange4
          }
          item={item}
        />
      </ExpandableSection>
    </View>
  );
};

export default memo(RenderCustomerComponent)
