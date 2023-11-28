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

interface DMCProductsDeliveredListingProps {
  index: number;
  item: any;
  lastItem: boolean;
  salesUnitDropDownData: any;
  onChangeSalesUnitData: any;
  onChangeQuantity: any;
  onChangeMaterialNumberDescription?: any;
  onDelete: any;
  handleMaterialSearch: any;
}

const DMCProductsDeliveredListing = (
  props: DMCProductsDeliveredListingProps,
) => {
  const {
    index,
    item,
    lastItem,
    onChangeQuantity,
    salesUnitDropDownData,
    onChangeSalesUnitData,
    onChangeMaterialNumberDescription,
    onDelete,
    handleMaterialSearch,
  } = props;

  const [materialSearchText, setMaterialSearchText] = useState("")

  const searchMaterialData = (searchText: string) => {
    setMaterialSearchText(searchText)
    handleMaterialSearch(searchText, index)
  }

  const onMaterialNumberDescriptionChange = (value: any) => {
    onChangeMaterialNumberDescription(value, index)
  }

  const onQuantityChange = (value: any) => {
    onChangeQuantity(value, index)
  }

  const onSalesUnitChange = (value: any) => {
    onChangeSalesUnitData(value, index)
  }

  const onDeletePress = () => {
    onDelete(index)
  }

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
          width={306}
          style={tw('mr-50px  border-light-lavendar')}>
          <Dropdown
            data={item.materialDropdown ?? []}
            placeholder="Select Material Number and Description"
            value={item.materialNumber}
            labelField={'description'}
            valueField={'materialNumber'}
            onChange={onMaterialNumberDescriptionChange}
            errorMsg={item?.materialNumberError}
            search
            renderInputSearch={() => (
              <DropdownSearchComponent
                handleSearchDropdown={searchMaterialData}
                value={materialSearchText}
              />
            )}
          />
        </View>

        <View width={159} style={tw('mr-50px border-light-lavendar')}>
          <InputText
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item?.productGroup ?? ''}
            isEditable={false}
            maxLength={50}
            errorMsg={''}
            textAlign="right"
          />
        </View>
        <View width={84} style={tw('mr-50px border-light-lavendar')}>
          <InputText
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={String(item?.quantity)}
            onChangeText={onQuantityChange}
            maxLength={4}
            keyboardType={'numeric'}
            errorMsg={item?.quantityError}
            textAlign="right"
          />
        </View>
        <View row>
          <View
            marginR-v2
            width={159}
            style={tw('mr-50px  border-light-lavendar')}>
            <Dropdown
              data={salesUnitDropDownData}
              placeholder=""
              value={item?.salesUnit}
              labelField={'unitOfMeasureDesc'}
              valueField={'unitOfMeasure'}
              onChange={onSalesUnitChange}
              errorMsg={item?.salesUnitError}
            />
          </View>

          <View width={159} style={tw('mr-50px border-light-lavendar')}>
            <InputText
              inputPlaceHolderTextColor={ColourPalette.light.grey2}
              isEditable={false}
              value={String(item?.price)}
              maxLength={50}
              errorMsg={''}
              textAlign="right"
            />
          </View>
          <TouchableOpacity onPress={onDeletePress}>
            <images.DeleteIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DMCProductsDeliveredListing;
