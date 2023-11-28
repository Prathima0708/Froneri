import View from 'src/components/View';
import { tw } from 'src/tw';
import Text from 'src/components/Text/Text';
import React from 'react';
import Dropdown from 'src/components/DropDown';
import InputText from 'src/components/InputText';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import { formatDateReverse } from 'src/utils/CommonUtil';
import CheckBox from 'src/components/CheckBox';

interface DMCClaimedProductsComponentProps {
  item: any;
  selectedOrder: any;
  onChangeItem: any;
  onChangeOrderNumber: any;
  onCompleteDeliveryTap: any;
}
const DMCClaimedProducts = (props: DMCClaimedProductsComponentProps) => {
  const {
    item,
    selectedOrder,
    onChangeItem,
    onChangeOrderNumber,
    onCompleteDeliveryTap,
  } = props;

  const changeItemObject = (field: string, value: string) => {
    let updatedObj = item;
    updatedObj[field] = value;
    onChangeItem(updatedObj);
  };

  return (
    <View style={tw('ml-24px mr-24px')}>
      <View style={tw('mt-24px mb-12px')}>
        <Text text18M>Claimed Products</Text>
      </View>
      <View flex row>
        <View flex marginR-v2 style={tw('w-293px border-light-lavendar')}>
          <Dropdown
            title={'Order Number'}
            data={[]}
            placeholder=""
            value={selectedOrder?.orderNumber}
            labelField={'orderNumber'}
            valueField={'orderNumber'}
            onChange={onChangeOrderNumber}
          />
        </View>
        <View flex row centerV style={tw(' border-light-lavendar mt-24px')}>
          <CheckBox
            label={'Complete Delivery'}
            labelStyle={tw('text-light-grey2')}
            value={selectedOrder?.completeDelivery}
            onValueChange={onCompleteDeliveryTap}
            color={
              selectedOrder?.completeDelivery
                ? ColourPalette.light.darkBlue
                : ColourPalette.light.grey4
            }
          />
        </View>
        <View flex-2 />
      </View>
      <View marginT-v5 row>
        <View marginR-v2 style={tw('w-293px border-light-lavendar')}>
          <InputText
            title={'Employee Name'}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item?.employeeName}
            onChangeText={(text: string) =>
              changeItemObject('employeeName', text)
            }
            maxLength={50}
            isEditable={false}
          />
        </View>
        <View marginR-v2 style={tw('w-293px border-light-lavendar')}>
          <InputText
            title={'Created / Modified Date'}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={
              item?.creationDateTime &&
              formatDateReverse(new Date(item?.creationDateTime))
            }
            onChangeText={(text: string) =>
              changeItemObject('creationDateTime', text)
            }
            maxLength={50}
            isEditable={false}
          />
        </View>
        <View marginR-v2 style={tw('w-293px border-light-lavendar')}>
          <InputText
            title={'Delivery Date'}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={
              item?.deliveryDateTime &&
              formatDateReverse(new Date(item?.deliveryDateTime))
            }
            onChangeText={(text: string) =>
              changeItemObject('deliveryDateTime', text)
            }
            maxLength={50}
            isEditable={false}
          />
        </View>
        <View marginR-v2 style={tw('w-293px border-light-lavendar')}>
          <InputText
            title={'Route'}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item?.route}
            onChangeText={(text: string) => changeItemObject('route', text)}
            maxLength={50}
            isEditable={false}
          />
        </View>
      </View>
      <View marginT-v5 row>
        <View marginR-v2 style={tw('w-293px border-light-lavendar')}>
          <InputText
            title={'Sequence'}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item?.sequence}
            onChangeText={(text: string) => changeItemObject('sequence', text)}
            maxLength={50}
            isEditable={false}
          />
        </View>
        <View marginR-v2 style={tw('w-293px border-light-lavendar')}>
          <InputText
            title={'Gross Amount'}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={String(item?.grossAmount ?? '')}
            onChangeText={(text: string) =>
              changeItemObject('grossAmount', text)
            }
            maxLength={50}
            keyboardType={'numeric'}
            textAlign="right"
            isEditable={false}
          />
        </View>
        <View marginR-v2 style={tw('w-293px border-light-lavendar')}>
          <InputText
            title={'Net Amount'}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={String(item?.netAmount ?? '')}
            onChangeText={(text: string) => changeItemObject('netAmount', text)}
            maxLength={50}
            keyboardType={'numeric'}
            textAlign="right"
            isEditable={false}
          />
        </View>
        <View marginR-v2 style={tw('w-293px border-light-lavendar')}>
          <InputText
            title={'JDE Order'}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item?.SAPDocumentNumber} // Need to confirm key
            onChangeText={(text: string) =>
              changeItemObject('SAPDocumentNumber', text)
            }
            maxLength={50}
            isEditable={false}
          />
        </View>
      </View>
      <View marginT-v5 row>
        <View marginR-v2 style={tw('w-293px border-light-lavendar')}>
          <InputText
            title={'Purchase Order Number'}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item?.poNumber}
            onChangeText={(text: string) => changeItemObject('poNumber', text)}
            maxLength={50}
            isEditable={false}
          />
        </View>
        <View marginR-v2 style={tw('w-293px border-light-lavendar')}>
          <InputText
            title={'Origin'}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={item?.origin}
            onChangeText={(text: string) => changeItemObject('origin', text)}
            maxLength={50}
            isEditable={false}
          />
        </View>
      </View>
    </View>
  );
};

export default DMCClaimedProducts;
