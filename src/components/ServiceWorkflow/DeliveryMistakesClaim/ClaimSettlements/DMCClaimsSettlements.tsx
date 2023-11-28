import React, { useState } from 'react';
import Dropdown from 'src/components/DropDown';
import InputText from 'src/components/InputText';
import Text from 'src/components/Text';
import View from 'src/components/View';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import { tw } from 'src/tw';
import { images } from 'src/assets/Images';
import DMCFreeGoodsListingHeader from './DMCFreeGoodsListingHeader';
import { FlashList } from '@shopify/flash-list';
import DMCFreeGoodsListing from './DMCFreeGoodsListing';
import { TouchableOpacity } from 'react-native';
import { SETTLEMENT_DONE_BY_DROPDOWN, SETTLEMENT_TYPE_DROPDOWN } from 'src/utils/DropdownConst';
import { toast } from 'src/utils/Util';

interface DMCClaimsSettlementsProps {
  errorMessages: any;
  salesUnitData: any;
  freeGoodsData: any;
  setFreeGoodsListData: any;
  getNetValue: any;
  getMaterialData: any;
  approvedByDropDownData: any;
  reasonForClaimDropDownData: any;
  selectedDropdownOptions: any;
  requestTypeData: any;
  selectedOrder: any;
  onChangeOrderCreated: any;
  onChangeTour: any;
  onChangeReasonForClaim: any;
  onChangeApprovedBy: any;
  onChangeSettlementDone: any;
  onChangeSettlementType: any;
}

const DMCClaimsSettlements = (props: DMCClaimsSettlementsProps) => {
  const {
    requestTypeData,
    errorMessages,
    freeGoodsData,
    setFreeGoodsListData,
    getNetValue,
    getMaterialData,
    selectedOrder,
    salesUnitData,
    approvedByDropDownData,
    reasonForClaimDropDownData,
    selectedDropdownOptions,
    onChangeTour,
    onChangeOrderCreated,
    onChangeReasonForClaim,
    onChangeApprovedBy,
    onChangeSettlementDone,
    onChangeSettlementType,
  } = props;

  const onAddProduct = async () => {
    try {
      const materialDropdownData = await getMaterialData()
      const preparedData = {
        price: '',
        salesUnit: '',
        quantity: '',
        materialDescription: '',
        materialNumber: '',
        materialDropdown: materialDropdownData
      }

      setFreeGoodsListData((prevData: any) => [...prevData, preparedData])

    } catch (error) {
      console.log('error while adding data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
    }
  };

  const handleMaterialDropdownSearch = async (searchText: string, index: number) => {
    try {
      const dropdownData = await getMaterialData(searchText)

      const updatedData = freeGoodsData.map((item: any, i: number) => {
        if (i === index) {
          return {
            ...item,
            materialDropdown: dropdownData
          }
        }
        return item
      })

      setFreeGoodsListData(updatedData)

    } catch (error) {
      console.log('error while searching material dropdown data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
    }
  }

  const onChangeListData = async (key: string, value: any, index: number) => {
    console.log('key - value :>> ', key, value);

    if (key === 'quantity') {
      setFreeGoodsListData((prevData: any) => {
        const newData = [...prevData]
        if (newData[index].materialNumber) {
          getNetValue(newData[index].materialNumber, value).then((netValue: any) => {
            newData[index].price = String(netValue)
          }).catch((error: any) => {
            console.log('error while getting net value :>> ', error);
            toast.error({
              message: "Something went wrong"
            })
          })
        }

        console.log('quantity data :>> ', newData);

        newData[index][key] = value
        newData[index].quantityError = ''

        return newData
      })
    } else if (key === 'materialNumber') {
      setFreeGoodsListData((prevData: any) => {
        const newData = [...prevData]
        if (newData[index].quantity) {
          getNetValue(value.materialNumber, newData[index].quantity).then((netValue: any) => {
            newData[index].price = String(netValue)
          }).catch((error: any) => {
            console.log('error while getting net value :>> ', error);
            toast.error({
              message: "Something went wrong"
            })
          })
        }
        newData[index][key] = value.materialNumber
        newData[index].materialDropdownError = ''
        return newData
      })
    } else {
      setFreeGoodsListData((prevData: any) => {
        const newData = [...prevData]
        newData[index][key] = value.unitOfMeasure
        newData[index].salesUnitError = ''

        return newData
      })
    }
  }

  return (
    <View style={tw('ml-24px mr-24px')}>
      <View style={tw('mt-24px mb-12px')}>
        <Text text18M>Settlement</Text>
      </View>

      <View row>
        <View width={292} marginR-v2 style={tw(' border-light-lavendar')}>
          <Dropdown
            title={'Settlement Type'}
            data={SETTLEMENT_TYPE_DROPDOWN}
            placeholder="Select Settlement Type"
            value={selectedDropdownOptions?.settlementTypeVal}
            labelField={'type'}
            valueField={'value'}
            onChange={onChangeSettlementType}
            errorMsg={errorMessages}
          />
        </View>
        <View marginR-v2 style={tw('w-293px border-light-lavendar')}>
          <Dropdown
            title={'Settlement Done by'}
            data={SETTLEMENT_DONE_BY_DROPDOWN}
            placeholder="Select Settlement"
            value={selectedDropdownOptions.settlementDoneByVal}
            labelField={'label'}
            valueField={'value'}
            onChange={onChangeSettlementDone}
            errorMsg={errorMessages}
          />
        </View>
      </View>
      <View style={tw('mt-47px')}>
        <Text text18M textBlack>
          Free Goods
        </Text>
      </View>

      {freeGoodsData.length > 0 ? <View flex>
        <View
          flex
          style={tw(
            ' bg-light-white border-default border-light-lavendar rounded-md',
          )}>
          <DMCFreeGoodsListingHeader />

          <FlashList
            data={freeGoodsData}
            keyExtractor={(_: any, index) => index?.toString()}
            estimatedItemSize={86}
            renderItem={({ item, index }) => {
              return (
                <DMCFreeGoodsListing
                  index={index}
                  item={item}
                  lastItem={freeGoodsData.length - 1 === index}
                  salesUnit={salesUnitData}
                  onChangeQuantity={(value: any) => onChangeListData('quantity', value, index)}
                  onChangeMaterialNumberDescription={(value: any) => onChangeListData('materialNumber', value, index)}
                  onChangeSalesUnitData={(value: any) => onChangeListData('salesUnit', value, index)}
                  handleSearchDropdown={handleMaterialDropdownSearch}
                  onDelete={() => {
                    const updatedData = freeGoodsData.filter((_: any, i: number) => i !== index);
                    setFreeGoodsListData(updatedData);
                  }}
                />
              );
            }}
          />
        </View>
      </View> : null}

      <TouchableOpacity onPress={onAddProduct} style={tw('self-start')}>
        <View row centerV style={tw('mt-12px  ml-12px mb-32px ')}>
          <images.AddNotesIcon style={tw('mr-6px')} />
          <Text text13R darkBlue>
            Add Free Goods
          </Text>
        </View>
      </TouchableOpacity>
      <View>
        <View marginR-v2 style={tw('w-293px border-light-lavendar ')}>
          <Dropdown
            title={'Approved By'}
            data={approvedByDropDownData}
            placeholder="Select Sales Representative"
            value={selectedDropdownOptions.approvedByVal}
            labelField={'salesRepresentativesName'}
            valueField={'partnerNumber'}
            onChange={onChangeApprovedBy}
            errorMsg={errorMessages}
          />
        </View>
      </View>
      <View style={tw('mb-12px mt-34px')}>
        <Text text18M textBlack>
          Back Office
        </Text>
      </View>
      <View row style={tw('mb-24px')}>
        <View marginR-v2 style={tw('w-293px border-light-lavendar')}>
          <Dropdown
            title={'Reason for Claim'}
            data={reasonForClaimDropDownData}
            placeholder="Select Reason"
            value={selectedDropdownOptions.reasonForClaim}
            labelField={'description'}
            valueField={'claimCode'}
            onChange={onChangeReasonForClaim}
            errorMsg={errorMessages}
            dropdownPosition={'top'}
          />
        </View>
        {selectedOrder?.orderNumber !== '' && (
          <View marginR-v2 flex style={tw('w-293px border-light-lavendar')}>
            <InputText
              title={'Tour'}
              inputPlaceHolderTextColor={ColourPalette.light.grey2}
              value={'-'}
              onChangeText={onChangeTour}
              isEditable={false}
              maxLength={20}
              keyboardType={'numeric'}
              errorMsg={errorMessages}
            />
          </View>
        )}
        {selectedOrder?.orderNumber !== '' && (
          <View marginR-v2 style={tw('w-293px border-light-lavendar')}>
            <InputText
              title={'Order Created By'}
              inputPlaceHolderTextColor={ColourPalette.light.grey2}
              value={'MartinRahn'}
              onChangeText={onChangeOrderCreated}
              isEditable={false}
              maxLength={20}
              keyboardType={'numeric'}
              errorMsg={errorMessages}
            />
          </View>
        )}
        <View flex />
      </View>
    </View>
  );
};

export default DMCClaimsSettlements;
