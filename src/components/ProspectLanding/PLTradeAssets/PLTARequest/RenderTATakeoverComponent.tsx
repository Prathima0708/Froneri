import { TouchableOpacity } from 'react-native';
import React, { memo } from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import CheckBox from 'src/components/CheckBox';
import InputText from 'src/components/InputText';
import { images } from 'src/assets/Images';
import Dropdown from 'src/components/DropDown';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface RenderTATakeoverComponentProps {
  item: any;
  index: number;
  lastItem: boolean;
  handleInputChange: any;
  followUpActionsDropdownData: any;
  isEditable: boolean;
}
const RenderTATakeoverComponent = (props: RenderTATakeoverComponentProps) => {
  const { item, index, lastItem, handleInputChange, followUpActionsDropdownData, isEditable } = props;

  const description = item?.description || '--';
  const serialNumber = item?.serialNumber || '--';

  const handlePrice = handleInputChange('priceTag', index);

  const handleExpectedTurnover = handleInputChange('expectedTurnoverTa', index);

  const handleTaTransfer = handleInputChange('taTransfer', index);

  const handleFollowUpAction = handleInputChange('followUpAction', index);

  return (
    <View
      flex
      paddingH-v4
      row
      paddingV-v4
      style={[
        tw(
          `${lastItem ? 'rounded-b-md' : ''
          } border-l-default border-r-default border-b-default border-light-lavendar`,
        ),
        { backgroundColor: colors[index % colors.length] },
      ]}>
      <View flex-2 marginT-v06>
        <Text numberOfLines={1} text13R textBlack>
          {description}
        </Text>
      </View>
      <View flex marginT-v06 marginL-v6>
        <Text numberOfLines={1} text13R textBlack>
          {serialNumber}
        </Text>
      </View>
      <View flex-2 marginL-v6>
        <InputText
          value={item?.priceTag}
          onChangeText={handlePrice}
          style={tw("text-right")}
          keyboardType="numeric"
          isEditable={isEditable}
        />
      </View>
      <View flex-2 marginL-v10>
        <InputText
          value={item?.expectedTurnoverTa}
          onChangeText={handleExpectedTurnover}
          style={tw("text-right")}
          keyboardType="numeric"
          isEditable={!isEditable ? false : !item?.expectedTurnoverTaDisabled}
          errorMsg={item?.expectedTurnoverTaError}
        />
      </View>
      <View flex-2 marginL-v2 marginT-v2 style={tw('items-center')}>
        <CheckBox
          labelStyle={tw('text-light-grey2')}
          value={item?.taTransfer}
          onValueChange={handleTaTransfer}
          color={ColourPalette.light.darkBlue}
          disabled={!isEditable ? true : item?.taTransferDisabled}
        />
      </View>
      <View flex-2 marginL-v6 marginT-v03>
        <Dropdown
          data={followUpActionsDropdownData}
          value={item?.followUpAction}
          labelField={'description'}
          valueField={'discoveryListValuesId'}
          onChange={handleFollowUpAction}
          isEditable={!isEditable ? false : !item?.followUpActionDisabled}
          errorMsg={item?.followUpActionError}
        />
      </View>
    </View>
  );
};

export default memo(RenderTATakeoverComponent);
