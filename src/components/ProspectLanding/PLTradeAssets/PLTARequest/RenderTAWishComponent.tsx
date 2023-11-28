import { TouchableOpacity } from 'react-native';
import React, { memo, useState } from 'react';
import View from 'src/components/View';
import { tw } from 'src/tw';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import InputText from 'src/components/InputText';
import { images } from 'src/assets/Images';
import Dropdown from 'src/components/DropDown';
import DropdownSearchComponent from 'src/components/DropdownSearchComponent';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface RenderTAWishComponentProps {
  item: any;
  index: number;
  lastItem: boolean;
  onDeleteTaPress: any;
  designDropdownData: any;
  searchDescriptionDropdownData: any;
  handleInputChange: any;
  isEditable: boolean;
}

const RenderTAWishComponent = (props: RenderTAWishComponentProps) => {
  const { item, index, lastItem, onDeleteTaPress, designDropdownData, searchDescriptionDropdownData, handleInputChange, isEditable } = props;

  const [searchText, setSearchText] = useState("");

  const handleTaDescription = handleInputChange('taDescription', index);

  const handleMaterialNumber = handleInputChange('materialNumber', index);

  const handleDesign = handleInputChange('design', index);

  const handleQuantity = handleInputChange('quantity', index);

  const handleExpectedTurnover = handleInputChange('expectedTurnover', index);

  const handlePrice = handleInputChange('price', index);

  const onDeletePress = () => {
    onDeleteTaPress(index);
  }

  const handleDescriptionSearch = (searchText: string) => {
    setSearchText(searchText);
    searchDescriptionDropdownData(searchText, index);
  }

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
        <Dropdown
          extraSelectedTextStyle={'w-9/12'}
          data={item.descriptionDropdownData}
          value={item.taDescription}
          labelField={'description'}
          valueField={'description'}
          onChange={handleTaDescription}
          errorMsg={item?.taDescriptionError}
          search
          searchPlaceholder="Search description..."
          renderInputSearch={() => (
            <DropdownSearchComponent
              handleSearchDropdown={handleDescriptionSearch}
              value={searchText}
            />
          )}
          isEditable={isEditable}
        />
      </View>
      <View flex-2 marginL-v6 marginT-v03>
        <InputText
          value={item.materialNumber}
          onChangeText={handleMaterialNumber}
          isEditable={isEditable}
        />
      </View>
      <View flex-2 marginT-v06 marginL-v6>
        <Dropdown
          data={designDropdownData}
          value={item.design}
          labelField={'description'}
          valueField={'discoveryListValuesId'}
          onChange={handleDesign}
          errorMsg={item?.designError}
          isEditable={isEditable}
        />
      </View>
      <View flex marginL-v6 marginT-v03>
        <InputText
          value={item.quantity}
          onChangeText={handleQuantity}
          style={tw('text-right')}
          keyboardType={'numeric'}
          errorMsg={item?.quantityError}
          isEditable={isEditable}
        />
      </View>
      <View flex-2 marginL-v6 marginT-v03>
        <InputText
          value={item.expectedTurnover}
          onChangeText={handleExpectedTurnover}
          style={tw('text-right')}
          keyboardType={'numeric'}
          errorMsg={item?.expectedTurnoverError}
          isEditable={isEditable}
        />
      </View>
      <View flex-2 marginL-v6 marginT-v03>
        <InputText
          value={item.price}
          onChangeText={handlePrice}
          style={tw('text-right')}
          keyboardType={'numeric'}
          isEditable={isEditable}
        />
      </View>
      {isEditable && <View flex style={tw('items-end')} marginT-v06>
        <TouchableOpacity onPress={onDeletePress}>
          <images.DeleteIcon />
        </TouchableOpacity>
      </View>}
    </View>
  );
};

export default memo(RenderTAWishComponent);
