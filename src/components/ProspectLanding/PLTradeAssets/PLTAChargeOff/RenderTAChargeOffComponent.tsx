import React, { memo } from 'react';

import View from 'src/components/View';
import Text from 'src/components/Text';
import CheckBox from 'src/components/CheckBox';
import InputText from 'src/components/InputText';

import { images } from 'src/assets/Images';

import { tw } from 'src/tw';

import { ColourPalette } from 'src/styles/config/ColoursStyles';
import { TouchableWithoutFeedback } from 'react-native';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface RenderTAChargeOffComponentProps {
  item: any;
  index: number;
  lastItem: boolean;
  handleInputChange: any;
  isEditable: boolean;
}

const RenderCheckBox = (props: any) => {
  const { item, isEditable } = props;

  if (item.status && isEditable) {
    return <images.CheckBox />
  } else if (item.status) {
    return <images.CheckBoxDisabled />
  } else {
    return <View
      style={tw(`h-6 w-6 border-2 rounded-md ${isEditable ? 'border-light-darkBlue' : 'border-light-grey4'} bg-light-white`)}
    />
  }
}

const RenderTAChargeOffComponent = (props: RenderTAChargeOffComponentProps) => {
  const { item, index, lastItem, handleInputChange, isEditable } = props;

  const description = item?.description ? item.description.trim() : '--';
  const materialNumber = item?.formattedMaterialNumber ? item.formattedMaterialNumber : '--';
  const serialNumber = item?.serialNumber ? item.serialNumber.trim() : '--';
  const constructionDate = item?.constructionDate ? item.constructionDate.trim() : '--';

  const handleStatus = handleInputChange('status', index);
  const handleResidualValue = handleInputChange('residualValue', index);

  return (
    <View
      flex
      paddingH-v4
      row
      paddingV-v2
      style={[
        tw(
          `${lastItem ? 'rounded-b-md' : ''
          } border-l-default border-r-default border-b-default border-light-lavendar`,
        ),
        { backgroundColor: colors[index % colors.length] },
      ]}>
      <View flex-3 marginT-v06>
        <Text numberOfLines={1} text13R textBlack>
          {description}
        </Text>
      </View>
      <View flex marginT-v06 marginL-v6>
        <Text numberOfLines={1} text13R textBlack>
          {materialNumber}
        </Text>
      </View>
      <View flex marginT-v06 marginL-v6>
        <Text numberOfLines={1} text13R textBlack>
          {serialNumber}
        </Text>
      </View>
      <View flex marginL-v2 marginT-v06 style={tw('items-center')}>
        <TouchableWithoutFeedback onPress={handleStatus} disabled={!isEditable}>
          <View marginR-v2>
            <RenderCheckBox item={item} isEditable={isEditable} />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View flex-2 marginL-v10>
        <InputText
          value={item.residualValue}
          onChangeText={handleResidualValue}
          style={tw('text-right')}
          keyboardType={'numeric'}
          errorMsg={item?.residualValueError}
          isEditable={isEditable}
          placeholder={'0'}
        />
      </View>
      <View flex marginL-v6 marginT-v06 style={tw('items-end')}>
        <Text numberOfLines={1} text13R textBlack>
          {constructionDate}
        </Text>
      </View>
    </View>
  );
};

export default memo(RenderTAChargeOffComponent);
