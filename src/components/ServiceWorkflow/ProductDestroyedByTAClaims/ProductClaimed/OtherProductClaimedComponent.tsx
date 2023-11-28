import React, {useEffect, useState} from 'react';
import Text from 'src/components/Text';
import View from 'src/components/View';
import {tw} from 'src/tw';
import {images} from 'src/assets/Images';
import {FlashList} from '@shopify/flash-list';
import {Alert, TouchableOpacity} from 'react-native';
import OtherProductListingHeader from './OtherProductListingHeader';
import OtherProductListingComponent from './OtherProductListingComponent';
import TAProductDetailController from 'src/controller/TAProductDetailController';
import {toast} from 'src/utils/Util';

interface OtherProductClaimedComponentProps {
  listData: any;
  onChangeListData: any;
  userData: any;
  salesTypeListData: any;
  editMode: boolean;
  otherProductListDataError: any;
}
const OtherProductClaimedComponent = (
  props: OtherProductClaimedComponentProps,
) => {
  const [shipToErrorMessages, setShipToErrorMessages] = useState<any>({});

  const [materialListData, setMaterialListData] = useState([]);
  const [salesTypeListData, setSalesTypeListData] = useState([]);

  const fetchSalesUnitDropdownData = async () => {
    try {
      const salesUnitDropdownData =
        await TAProductDetailController.getSalesUnitTypeDropdownData();
      setSalesTypeListData(salesUnitDropdownData);
    } catch (error) {
      console.log('error while fetching salesUnit dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };
  const fetchMaterialListDropdownData = async () => {
    try {
      const materialDropdownData =
        await TAProductDetailController.getMaterailNumberDropdownData(
          props.userData.pickingPlantNumber,
          props.userData.salesOrganization,
          props.userData.distributionChannel,
          '',
        );

      let ar = [
        ...materialDropdownData,
        {description: '31014581', materialNumber: '31014581'},
      ];
      setMaterialListData(ar as never[]);
    } catch (error) {
      console.log('error while fetching material dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      return [];
    }
  };

  useEffect(() => {
    fetchSalesUnitDropdownData();
    fetchMaterialListDropdownData();
  }, []);

  return (
    <View style={tw('mb-2')}>
      <View style={tw('mb-2')}>
        <Text text18M>Other Products to be claimed</Text>
      </View>
      <View flex>
        <View
          flex
          style={tw(
            props.listData?.length > 0
              ? ' bg-light-white border-default border-light-lavendar rounded-md'
              : '',
          )}>
          {props.listData?.length > 0 && <OtherProductListingHeader />}
          <FlashList
            data={props?.listData ?? []}
            keyExtractor={(_: any, index) => index?.toString()}
            estimatedListSize={{
              height: 72 * props?.listData?.length,
              width: 320,
            }}
            estimatedItemSize={74}
            renderItem={({item, index}) => {
              return (
                <OtherProductListingComponent
                  salesDropdownList={props.salesTypeListData}
                  materialDropdownList={materialListData}
                  userData={props.userData}
                  index={index}
                  item={item}
                  errorMessages={props.otherProductListDataError[index]}
                  lastItem={props?.listData?.length - 1 === index}
                  onChangeValue={props.onChangeListData}
                  editMode={true}
                />
              );
            }}
          />
        </View>
      </View>
      <TouchableOpacity
        disabled={!props.editMode}
        onPress={props.onChangeListData('add', 0)}>
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

export default OtherProductClaimedComponent;
