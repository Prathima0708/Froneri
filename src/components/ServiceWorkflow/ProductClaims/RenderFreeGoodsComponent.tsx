import {TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import View from 'src/components/View';
import {tw} from 'src/tw';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import InputText from 'src/components/InputText';
import {images} from 'src/assets/Images';
import Dropdown from 'src/components/DropDown';
import DropdownSearchComponent from 'src/components/DropdownSearchComponent';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface RenderTAWishComponentProps {
  item: any;
  index: number;
  lastItem: boolean;
  onDeleteTaPress: any;
  designDropdownData?: any;
  handleInputChange: any;
  isEditable: boolean;
  salesUnitListData: any;
  materialListData: any;
  errorMessages: any;

  fetchClaimMaterialListDropdownData: any;
}

const RenderFreeGoodsComponent = (props: RenderTAWishComponentProps) => {
  const {
    item,
    index,
    lastItem,
    onDeleteTaPress,
    handleInputChange,
    isEditable,
    errorMessages,
  } = props;

  const handleQuanity = handleInputChange('freeGoodQuantity');

  const handleMaterialNumber = handleInputChange('freeGoodNumber');

  const handleSalesUnit = handleInputChange('freeGoodSalesUnit');

  const handleDelete = handleInputChange('freeGoodDelete');

  return (
    <View
      flex
      paddingH-v4
      row
      paddingV-v4
      style={[
        tw(
          `${
            lastItem ? 'rounded-b-md' : ''
          } border-l-default border-r-default border-b-default border-light-lavendar`,
        ),
        {backgroundColor: colors[index % colors.length]},
      ]}>
      <View flex-4 marginT-v06>
        <Dropdown
          data={props.materialListData}
          value={item.freeGoodNumber}
          placeholder="Select Material Number and Description"
          labelField={'description'}
          valueField={'materialNumber'}
          onChange={handleMaterialNumber}
          isEditable={isEditable}
          errorMsg={errorMessages.freeGoodNumber}
          search
          renderInputSearch={() => (
            <DropdownSearchComponent
              handleSearchDropdown={props.fetchClaimMaterialListDropdownData}
            />
          )}
        />
      </View>
      <View flex marginL-v2 marginT-v03>
        <InputText
          value={item.freeGoodQuantity + ''}
          placeholder="Quantity"
          onChangeText={handleQuanity}
          isEditable={isEditable}
          errorMsg={errorMessages.freeGoodQuantity}
        />
      </View>
      <View flex marginT-v06 marginL-v2>
        <Dropdown
          errorMessages=""
          data={props.salesUnitListData}
          value={item.freeGoodSalesUnit}
          placeholder="Select Unit"
          labelField="unitOfMeasureDesc"
          valueField="unitOfMeasure"
          onChange={handleSalesUnit}
          isEditable={isEditable}
          errorMsg={errorMessages.freeGoodSalesUnit}
        />
      </View>
      <View flex marginL-v2 marginT-v03>
        <InputText
          value={item.freeGoodValue + ''}
          onChangeText={() => {}}
          style={tw('text-right')}
          keyboardType={'numeric'}
          isEditable={false}
        />
      </View>
      {false && (
        <View flex style={tw('items-end')} marginT-v06>
          <TouchableOpacity onPress={handleDelete}>
            <images.DeleteIcon />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default memo(RenderFreeGoodsComponent);
