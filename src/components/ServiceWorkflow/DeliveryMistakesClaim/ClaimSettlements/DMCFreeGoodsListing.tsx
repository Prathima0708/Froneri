import { TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import View from 'src/components/View';
import { tw } from 'src/tw';
import { images } from 'src/assets/Images';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import InputText from 'src/components/InputText';
import Dropdown from 'src/components/DropDown';
import DropdownSearchComponent from 'src/components/DropdownSearchComponent';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface DMCFreeGoodsListingProps {
  index: number;
  item: any;
  lastItem: boolean;
  salesUnit: any;
  onChangeQuantity: any;
  handleSearchDropdown: any;
  onChangeMaterialNumberDescription?: any;
  onDelete: any;
  onChangeSalesUnitData: any;
}

const DMCFreeGoodsListing = (props: DMCFreeGoodsListingProps) => {
  const {
    index,
    item,
    onDelete,
    onChangeSalesUnitData,
    lastItem,
    salesUnit,
    onChangeQuantity,
    handleSearchDropdown,
    onChangeMaterialNumberDescription,
  } = props;

  const [materialSearchText, setMaterialSearchText] = useState("")

  const handleDropdownSearch = (searchText: string) => {
    setMaterialSearchText(searchText)
    handleSearchDropdown(searchText, index)
  }

  console.log('item :>> ', item);

  return (
    <View
      row
      centerV
      height={72}
      style={[
        tw(
          `${lastItem ? 'rounded-b-md' : ''
          } border-t-default border-light-lavendar  `,
        ),
        { backgroundColor: colors[index % colors.length] },
      ]}>
      <View paddingH-v2 row centerV marginV-v06>
        <View
          marginR-v2
          width={569}
          style={tw('mr-12px  border-light-lavendar')}>
          <Dropdown
            data={item?.materialDropdown || []}
            placeholder="Select Material Number and Description"
            value={item?.materialNumber}
            search
            labelField={'description'}
            valueField={'materialNumber'}
            onChange={onChangeMaterialNumberDescription}
            renderInputSearch={() => (
              <DropdownSearchComponent
                handleSearchDropdown={handleDropdownSearch}
                value={materialSearchText}
              />
            )}
            errorMsg={item?.materialDropdownError || ''}
          />
        </View>

        <View width={134} style={tw('mr-12px border-light-lavendar')}>
          <InputText
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={String(item?.quantity)}
            onChangeText={onChangeQuantity}
            maxLength={4}
            keyboardType={'numeric'}
            textAlign="right"
            errorMsg={item?.quantityError || ''}
          />
        </View>
        <View row>
          <View
            marginR-v2
            width={134}
            style={tw('mr-12px  border-light-lavendar')}>
            <Dropdown
              data={salesUnit}
              placeholder=""
              value={item?.salesUnit}
              labelField={'unitOfMeasureDesc'}
              valueField={'unitOfMeasure'}
              onChange={onChangeSalesUnitData}
              errorMsg={item?.salesUnitError || ''}
            />
          </View>

          <View
            width={134}
            style={tw('mr-12px border-light-lavendar mr-110px')}>
            <InputText
              inputPlaceHolderTextColor={ColourPalette.light.grey2}
              value={String(item?.price)}
              maxLength={50}
              textAlign="right"
              isEditable={false}
            />
          </View>
          <TouchableOpacity onPress={onDelete} style={tw('justify-center')}>
            <images.DeleteIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DMCFreeGoodsListing;
