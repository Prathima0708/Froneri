import View from 'src/components/View';
import React from 'react';
import { tw } from 'src/tw';
import CheckBox from 'src/components/CheckBox';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import Dropdown from 'src/components/DropDown';

interface CallDeliveryDayProps {
  weekLabel: string;
  isSelect: boolean;
  handleCallDay: any;
  disabled: boolean;
  dropdownValue: string;
  handleDropdown: any;
  weekDropdownData: any;
  deliveryErrorMsg: string;
}

const CallDeliveryDayComponent = (props: CallDeliveryDayProps) => {
  const {
    weekLabel,
    isSelect,
    handleCallDay,
    disabled,
    dropdownValue,
    handleDropdown,
    weekDropdownData,
    deliveryErrorMsg,
  } = props;

  let isDropdownEditable = isSelect ? true : false;

  if (disabled) {
    isDropdownEditable = false;
  }

  return (
    <View flex marginR-v2>
      <View row marginT-v5>
        <View flex marginR-v2 marginT-v1>
          <CheckBox
            label={weekLabel}
            labelStyle={tw('text-light-textBlack text-13px')}
            value={isSelect}
            onValueChange={handleCallDay}
            color={
              isSelect
                ? ColourPalette.light.darkBlue
                : ColourPalette.light.grey6
            }
            disabled={disabled}
          />
        </View>
        <View flex>
          <Dropdown
            extraStyle={'w-140px'}
            labelField="label"
            valueField="value"
            isEditable={isDropdownEditable}
            data={weekDropdownData}
            placeholder="Select"
            value={dropdownValue}
            onChange={handleDropdown}
            errorMsg={deliveryErrorMsg}
          />
        </View>
      </View>
    </View>
  );
};

export default CallDeliveryDayComponent;
