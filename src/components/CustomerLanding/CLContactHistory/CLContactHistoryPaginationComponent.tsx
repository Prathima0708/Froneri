import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import React from 'react';
import {images} from 'src/assets/Images';
import {TouchableOpacity} from 'react-native';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import Dropdown from 'src/components/DropDown';
import {CONTACT_HISTORY_DROPDOWN} from 'src/utils/DropdownConst';
import CLContactHistoryToolTip from 'src/components/CustomerLanding/CLContactHistory/CLContactHistoryToolTip';

interface CLContactHistoryPaginationComponentProps {
  totalCount: number;
  contactHistoryDropdownValue: string;
  handleContactHistoryDropdown: any;
  start: number;
  end: number;
  isLeftActive: boolean;
  isRightActive: boolean;
  onLeftIconPress: any;
  onRightIconPress: any;
  noDataFound: boolean;
}

const CLContactHistoryPaginationComponent = (
  props: CLContactHistoryPaginationComponentProps,
) => {
  const {
    totalCount,
    contactHistoryDropdownValue,
    handleContactHistoryDropdown,
    start,
    end,
    isLeftActive,
    isRightActive,
    onLeftIconPress,
    onRightIconPress,
    noDataFound,
  } = props;

  const paginationTitle = `Showing ${start} - ${end} results of ${totalCount}`;

  return (
    <View row centerV spread padding-v4>
      <Text text13R grey2>
        {!noDataFound && paginationTitle}
      </Text>
      <View row centerV>
        {!noDataFound && (
          <View row centerV>
            <TouchableOpacity
              style={tw('mr-3')}
              disabled={!isLeftActive}
              onPress={onLeftIconPress}>
              {isLeftActive ? <images.ActiveLeftIcon /> : <images.LeftIcon />}
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!isRightActive}
              onPress={onRightIconPress}>
              {isRightActive ? (
                <images.ActiveRightIcon />
              ) : (
                <images.RightIcon />
              )}
            </TouchableOpacity>
          </View>
        )}
        <Dropdown
          extraStyle={'ml-6 mr-4 w-136px bg-light-darkBlue '}
          extraSelectedTextStyle={'pl-1 text-light-white'}
          labelField="label"
          valueField="value"
          data={CONTACT_HISTORY_DROPDOWN}
          value={contactHistoryDropdownValue}
          onChange={handleContactHistoryDropdown}
          icon={<images.WhiteDownIcon />}
        />
        <CLContactHistoryToolTip />
      </View>
    </View>
  );
};

export default CLContactHistoryPaginationComponent;
