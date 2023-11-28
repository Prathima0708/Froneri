import React, {useEffect, useState} from 'react';
import Text from 'src/components/Text';
import View from 'src/components/View';
import {tw} from 'src/tw';
import {images} from 'src/assets/Images';
import {FlashList} from '@shopify/flash-list';
import AssortmentProductListingHeader from './AssortmentProductListingHeader';
import AssortmentProductListingComponent from './AssortmentProductListingComponent';

import {Alert, TouchableOpacity} from 'react-native';
import TAProductDetailController from 'src/controller/TAProductDetailController';
import {toast} from 'src/utils/Util';

interface AssortmentProductClaimedComponentProps {
  listData: any;
  userData: any;
  editMode: boolean;
  salesTypeListData: any;
  handleIcedProductInputChange: any;
  icedProductListDataError: any;
  icedProductListDropDown: any;
}
const AssortmentProductClaimedComponent = (
  props: AssortmentProductClaimedComponentProps,
) => {
  const {listData, icedProductListDataError, icedProductListDropDown} = props;

  const renderItem = ({item, index}: any) => {
    return (
      <AssortmentProductListingComponent
        icedProductListDropDown={icedProductListDropDown}
        icedProductListDataError={icedProductListDataError}
        userData={props.userData}
        salesTypeListData={props.salesTypeListData}
        index={index}
        item={item}
        lastItem={false}
        errorMessages={icedProductListDataError[index]}
        editMode={true}
        handleIcedProductInputChange={props.handleIcedProductInputChange}
      />
    );
  };
  return (
    <View style={tw('mb-5')}>
      <View style={tw('mb-2')}>
        <Text text18M>Products in Assortment to be claimed</Text>
      </View>
      <View flex>
        <View
          flex
          style={tw(
            props.listData?.length > 0
              ? 'bg-light-white border-default border-light-lavendar rounded-md'
              : '',
          )}>
          {props.listData?.length > 0 && <AssortmentProductListingHeader />}
          <FlashList
            data={props?.listData}
            keyExtractor={(_: any, index) => index?.toString()}
            estimatedListSize={{height: 72 * listData.length, width: 320}}
            estimatedItemSize={74}
            renderItem={renderItem}
          />
        </View>
      </View>
      {props?.listData > 0 && (
        <TouchableOpacity
          onPress={props.handleIcedProductInputChange('add', 0)}>
          <View row centerV style={tw('mt-12px mb-12px ml-12px')}>
            <images.AddNotesIcon style={tw('mr-6px')} />
            <Text text13R darkBlue>
              Add Product
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AssortmentProductClaimedComponent;
