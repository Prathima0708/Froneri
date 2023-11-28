import {Alert, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import View from 'src/components/View';
import {tw} from 'src/tw';
import {images} from 'src/assets/Images';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import InputText from 'src/components/InputText';
import Dropdown from 'src/components/DropDown';
import Text from 'src/components/Text';
import TAProductDetailController from 'src/controller/TAProductDetailController';
import {toast} from 'src/utils/Util';
import DropdownSearchComponent from 'src/components/DropdownSearchComponent';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface AssortmentProductListingProps {
  userData: any;
  index: number;
  item: any;
  lastItem: boolean;
  errorMessages: any;
  editMode: any;
  salesTypeListData: any;
  handleIcedProductInputChange: any;
  icedProductListDataError: any;
  icedProductListDropDown: any;
}

const AssortmentProductListingComponent = (
  props: AssortmentProductListingProps,
) => {
  const {
    index,
    item,
    lastItem,
    errorMessages,
    editMode,
    salesTypeListData,
    icedProductListDataError,
  } = props;

  const [materialNumber, setMaterialNumber] = useState([]);
  const [error, setError] = useState<any>([]);
  useEffect(() => {
    fetchAllMaterialListDropdownData(item.materialNumber + '');
  }, [item]);

  const fetchAllMaterialListDropdownData = async (searchText: string = ' ') => {
    try {
      const materialDropdownData =
        await TAProductDetailController.getMaterailNumberDropdownData(
          props.userData.pickingPlantNumber,
          props.userData.salesOrganization,
          props.userData.distributionChannel,
          searchText,
        );

      // let ar = materialDropdownData.filter((item: any) =>
      //   props.icedProductListDropDown.includes(item.materialNumber),
      // );

      setMaterialNumber(materialDropdownData);
    } catch (error) {
      console.log('error while fetching material dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };
  return (
    <View
      row
      centerV
      height={72}
      style={[
        tw(
          `${
            lastItem ? 'rounded-b-md' : ''
          } border-t-default border-light-lavendar  `,
        ),
        {backgroundColor: colors[index % colors.length]},
      ]}>
      <View paddingH-v2 row centerV marginV-v06>
        <View
          marginR-v2
          width={306}
          style={tw('mr-50px  border-light-lavendar')}>
          <Dropdown
            isEditable={true}
            data={materialNumber}
            placeholder="Select Material Number and Description"
            value={item?.materialNumber}
            labelField={'description'}
            valueField={'materialNumber'}
            onChange={props.handleIcedProductInputChange(
              'materialNumber',
              index,
            )}
            errorMsg={errorMessages?.materialNumber ?? ''}
            search
            renderInputSearch={() => (
              <DropdownSearchComponent
                handleSearchDropdown={fetchAllMaterialListDropdownData}
              />
            )}
          />
        </View>

        <View width={159} style={tw('mr-50px border-light-lavendar')}>
          <InputText
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item?.quantityDeliveredInLast52Weeks + ''}
            onChangeText={() => {}}
            isEditable={false}
            maxLength={50}
            errorMsg={errorMessages?.last52Week ?? ''}
            textAlign="right"
          />
        </View>
        <View width={84} style={tw('mr-50px border-light-lavendar')}>
          <InputText
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item?.quantity + ''}
            onChangeText={props.handleIcedProductInputChange('quantity', index)}
            isEditable={true}
            maxLength={50}
            errorMsg={errorMessages?.quantity}
            textAlign="right"
          />
        </View>
        <View row>
          <View
            marginR-v2
            width={159}
            style={tw('mr-50px  border-light-lavendar')}>
            <Dropdown
              isEditable={editMode}
              data={salesTypeListData}
              placeholder="Case"
              value={item.salesUnit + ''}
              labelField={'unitOfMeasureDesc'}
              valueField={'unitOfMeasure'}
              onChange={props.handleIcedProductInputChange('salesUnit', index)}
              errorMsg={errorMessages?.salesUnit ?? ''}
            />
          </View>

          <View width={159} style={tw('mr-50px border-light-lavendar')}>
            <InputText
              inputPlaceHolderTextColor={ColourPalette.light.grey2}
              value={item.price + ''}
              onChangeText={() => {}}
              isEditable={false}
              maxLength={50}
              errorMsg={errorMessages?.price ?? ''}
              textAlign="right"
            />
          </View>
          <TouchableOpacity
            onPress={props.handleIcedProductInputChange('delete', index)}>
            <images.DeleteIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AssortmentProductListingComponent;
