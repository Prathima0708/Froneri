import { TouchableOpacity } from 'react-native';
import React from 'react';
import { FlashList } from '@shopify/flash-list';

import Text from 'src/components/Text';
import View from 'src/components/View';

import { tw } from 'src/tw';

import { images } from 'src/assets/Images';

import { toast } from 'src/utils/Util';

import DMCListingHeaderComponent from './DMCListingHeaderComponent';
import DMCProductsDeliveredListing from './DMCProductsDeliveredListing';

interface IDMCProductsDelivered {
  productsShouldHaveBeenDeliveredData: any;
  setProductsShouldHaveBeenDeliveredData: any;
  salesUnitData: any;
  getMaterialData: any;
  getMaterialProductGroup: any;
  getNetValue: any;
  changeDisableState: any;
}

const DMCProductsDelivered = (props: IDMCProductsDelivered) => {
  const { productsShouldHaveBeenDeliveredData, setProductsShouldHaveBeenDeliveredData, salesUnitData, getMaterialData, getMaterialProductGroup, getNetValue, changeDisableState } = props;

  const onDelete = (index: number) => {
    setProductsShouldHaveBeenDeliveredData((prevData: any) => {
      const newData = [...prevData]
      newData.splice(index, 1)
      return newData
    })

    changeDisableState()
  };

  const onAddProduct = async () => {
    try {
      const materialData = await getMaterialData('')

      const preparedData = {
        price: '',
        salesUnit: '',
        quantity: '',
        productGroup: '',
        materialDescription: '',
        materialNumber: '',
        materialDropdown: materialData
      }

      setProductsShouldHaveBeenDeliveredData((prevData: any) => ([...prevData, preparedData]))

      changeDisableState()
    } catch (error) {
      console.log('error while adding data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
    }

  };

  const handleMaterialSearch = async (searchText: string, index: number) => {
    const materialData = await getMaterialData(searchText)

    setProductsShouldHaveBeenDeliveredData((prevData: any) => {
      prevData[index].materialDropdown = materialData

      return [...prevData]
    })
  }

  const onChangeData = async (value: any, index: number, key: string) => {
    try {
      if (key === 'materialNumber') {
        const materialProductGroup = await getMaterialProductGroup(value.material_hierarchy_from_sap_node_l2, value.material_hierarchy_node_l2)

        setProductsShouldHaveBeenDeliveredData((prevData: any) => {
          prevData[index].materialNumber = value.materialNumber
          prevData[index].productGroup = materialProductGroup
          return [...prevData]
        })
      } else if (key === 'salesUnit') {
        setProductsShouldHaveBeenDeliveredData((prevData: any) => {
          prevData[index][key] = value.unitOfMeasure

          return [...prevData]
        })

      } else if (key === 'quantity') {
        setProductsShouldHaveBeenDeliveredData((prevData: any) => {
          prevData[index][key] = value;
          return [...prevData]
        })

        const netValue = await getNetValue(productsShouldHaveBeenDeliveredData[index].materialNumber, value);
        setProductsShouldHaveBeenDeliveredData((prevData: any) => {
          prevData[index].price = netValue;

          return [...prevData]
        })

      } else {
        setProductsShouldHaveBeenDeliveredData((prevData: any) => {
          prevData[index][key] = value

          return [...prevData]
        })
      }
    } catch (error) {
      console.log('error while changing not delivered data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
    } finally {
      changeDisableState()
    }
  }

  return (
    <View style={tw('ml-24px mr-24px')}>
      <View style={tw(' mb-12px')}>
        <Text text18M>Products that should have been delivered</Text>
      </View>
      {productsShouldHaveBeenDeliveredData.length > 0 ? <View flex>
        <View
          flex
          style={tw(
            ' bg-light-white border-default border-light-lavendar rounded-md',
          )}>
          <DMCListingHeaderComponent />
          <FlashList
            data={productsShouldHaveBeenDeliveredData}
            keyExtractor={(_: any, index) => index.toString()}
            estimatedItemSize={86}
            renderItem={({ item, index }) => {
              return (
                <DMCProductsDeliveredListing
                  index={index}
                  item={item}
                  salesUnitDropDownData={salesUnitData}
                  lastItem={productsShouldHaveBeenDeliveredData.length - 1 === index}
                  onChangeSalesUnitData={(value: any, index: number) => onChangeData(value, index, 'salesUnit')}
                  onChangeQuantity={(value: any, index: number) => onChangeData(value, index, 'quantity')}
                  onChangeMaterialNumberDescription={(value: any, index: number) => onChangeData(value, index, 'materialNumber')}
                  onDelete={onDelete}
                  handleMaterialSearch={handleMaterialSearch}
                />
              );
            }}
          />
        </View>
      </View> : null}
      <TouchableOpacity onPress={onAddProduct} style={tw('self-start')}>
        <View row centerV style={tw('mt-12px mb-12px ml-12px')}>
          <images.AddNotesIcon style={tw('mr-6px')} />
          <Text text13R darkBlue>
            Add Product
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default DMCProductsDelivered;
