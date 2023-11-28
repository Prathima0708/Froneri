import {StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import View from 'src/components/View';

import {tw} from 'src/tw';

import ProductClaimedListing from './ProductClaimed/ProductClaimedListing';
import AssortmentProductClaimedComponent from './ProductClaimed/AssortmentProductClaimedComponent';
import OtherProductListingComponent from './ProductClaimed/OtherProductClaimedComponent';
import TAProductDetailController from 'src/controller/TAProductDetailController';
import {toast} from 'src/utils/Util';

export interface ListItemType {
  selection?: boolean;
  batchNumber: null;
  brand: null;
  constructionYear: Date;
  equipmentNumber: string;
  installedDate: Date;
  manufacturerModel: null;
  manufacturerSerialNumber: string;
  materialDescription: string;
  materialNumber: number;
  price: string;
  quantity: number;
  serialNumber: string;
  status: string;
  status1: string;
  status2: string;
  targetTurnover: string;
}
export interface OrderLinesListItemType {
  materialNumber: number;
  price: number;
  productGroup: string;
  quantity: number;
  salesUnit: string;
}

interface ProductDetailComponentProps {
  userData: any;
  tradeAssetListData: any;
  handleTradeAssetItemClicked: any;
  icedProductListData: any;
  allMaterialListData: any;
  salesTypeListData: any;
  otherProductListData: any;
  handleIcedProductInputChange: any;
  handleOtherProductInputChange: any;
  icedProductListDataError: any;
  otherProductListDataError: any;
  isEditable: any;
  icedProductListDropDown: any;
}
const ProductDetailComponent = (props: ProductDetailComponentProps) => {
  return (
    <View>
      <>
        <ProductClaimedListing
          tradeAssetList={props.tradeAssetListData}
          onItemSelected={props.handleTradeAssetItemClicked}
        />
        <View style={tw('mt-10')}>
          <AssortmentProductClaimedComponent
            icedProductListDropDown={props.icedProductListDropDown}
            icedProductListDataError={props.icedProductListDataError}
            editMode={props.isEditable}
            userData={props.userData}
            listData={props.icedProductListData}
            salesTypeListData={props.salesTypeListData}
            handleIcedProductInputChange={props.handleIcedProductInputChange}
          />
        </View>
        <View style={tw('mt-2')}>
          <OtherProductListingComponent
            otherProductListDataError={props.otherProductListDataError}
            editMode={props.isEditable}
            userData={props.userData}
            listData={props.otherProductListData}
            salesTypeListData={props.salesTypeListData}
            onChangeListData={props.handleOtherProductInputChange}
          />
        </View>
      </>
    </View>
  );
};

export default ProductDetailComponent;

const styles = StyleSheet.create({});
