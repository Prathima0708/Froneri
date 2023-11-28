import View from 'src/components/View';
import {tw} from 'src/tw';
import React from 'react';
import Dropdown from 'src/components/DropDown';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import {images} from 'src/assets/Images';
import Text from 'src/components/Text';
import {CRCA_HOURS_DROPDOWN} from 'src/utils/DropdownConst';

const CRCADropdownComponent = (props: any) => {
  const {selectedValue, handleCRCA} = props;

  const renderItem = (item: any) => {
    return (
      <View row centerV padding-v2>
        {item.value != '1' && (
          <View
            padding-v1
            marginR-v1
            style={tw(
              `${
                item.value == '2'
                  ? 'bg-light-lightBlue4'
                  : 'bg-light-lightBlue5'
              } rounded-default`,
            )}></View>
        )}
        <Text style={tw(`text-light-textBlack text-13px font-normal`)}>
          {item.label}
        </Text>
      </View>
    );
  };

  return (
    <View>
      <Dropdown
        extraStyle={'ml-6 w-140px'}
        extraSelectedTextStyle={'pl-1'}
        labelField="label"
        valueField="value"
        renderLeftIcon={() => {
          return selectedValue == CRCA_HOURS_DROPDOWN[1].value ? (
            <View
              padding-v1
              style={tw(`bg-light-lightBlue4 rounded-default`)}></View>
          ) : selectedValue == CRCA_HOURS_DROPDOWN[2].value ? (
            <View
              padding-v1
              style={tw(`bg-light-lightBlue5 rounded-default`)}></View>
          ) : (
            <></>
          );
        }}
        renderItem={renderItem}
        data={CRCA_HOURS_DROPDOWN}
        value={selectedValue}
        onChange={handleCRCA}
      />
    </View>
  );
};

export default CRCADropdownComponent;
