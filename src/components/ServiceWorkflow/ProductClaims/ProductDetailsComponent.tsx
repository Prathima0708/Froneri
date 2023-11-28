import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {useState} from 'react';
import {tw} from 'src/tw';
import {PRODUCT_CLAIMS_TYPES} from 'src/utils/Constant';
import {ScrollView, TouchableOpacity} from 'react-native';
import ProductClaimsTopTabComponent from './ProductClaimsTopTabComponent';
import PCDetailsComponent from './PCDetailsComponent';
import PCClaimsSettlementsComponent from './PCClaimsSettlementsComponent';
import {BUTTON_TYPE} from 'src/components/Button/ButtonType';

interface ProductDetailsComponentProps {
  isSaveAllowed: boolean;
  materialListData: any;
  approvedByListData: any;
  salesUnitListData: any;
  productConditionListData: any;
  claimTypeListData: any;
  productDetailInfo: any;
  productClaimInfo: any;
  handleDetailInputChange: any;
  handleSaveCustomerInfo?: any;
  isEditable: boolean;
  handleCancel: any;
  handleModal: any;
  userData: any;
  handleClaimsInputChange: any;
  productDetailError: any;
  productClaimInfoErrorMessage: any;
  priorityListData: any;
  getApprovedByDropdownData: any;
  fetchMaterialListDropdownData: any;
  fetchClaimMaterialListDropdownData: any;
  claimMaterialListData: any;
}

const ProductDetailsComponent = (props: ProductDetailsComponentProps) => {
  const {
    isEditable,
    handleCancel,
    handleSaveCustomerInfo,
    handleModal,
    productClaimInfoErrorMessage,
    getApprovedByDropdownData,
  } = props;

  const [pdSelectedValue, setPDSelectedValue] = useState(
    PRODUCT_CLAIMS_TYPES.PRODUCT_DETAILS,
  );

  const handlePDSelectedValue = (data: string) => {
    setPDSelectedValue(data);
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[0]}>
      <View row spread bg-white marginH-v4 centerH paddingT-v4>
        <Text text26BO textBlack>
          Product Details
        </Text>
        <View row>
          <View center row style={tw('mr-66px')}>
            <Text text12R textBlack>
              Claim, Customer and Sales Rep Data
            </Text>
            <TouchableOpacity onPress={handleModal}>
              <Text
                text12R
                textBlack
                marginL-v2
                style={tw('text-light-darkBlue')}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <View center row>
            <TouchableOpacity onPress={handleCancel}>
              <Text textBlack text13R>
                {'Cancel'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw(
                `bg-light-darkBlue rounded-md py-2 px-8 flex-row items-center ml-6
                ${
                  !props.isSaveAllowed
                    ? BUTTON_TYPE.PRIMARY_DISABLED
                    : BUTTON_TYPE.PRIMARY_ENABLED
                }`,
              )}
              disabled={!props.isSaveAllowed}
              onPress={handleSaveCustomerInfo}>
              <Text
                white
                text13R
                style={tw(
                  `${
                    !props.isSaveAllowed
                      ? BUTTON_TYPE.PRIMARY_DISABLED_LABEL
                      : BUTTON_TYPE.PRIMARY_ENABLED_LABEL
                  }`,
                )}>
                {'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View marginH-v4 marginT-v4>
        <View flex-7>
          <ProductClaimsTopTabComponent
            handleChangeTab={handlePDSelectedValue}
            parterDetailsSelectedValue={pdSelectedValue}
          />
        </View>
        <View flex>
          {pdSelectedValue === PRODUCT_CLAIMS_TYPES.PRODUCT_DETAILS && (
            <ScrollView
              contentContainerStyle={{flexGrow: 1}}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}>
              <PCDetailsComponent
                fetchMaterialListDropdownData={
                  props.fetchMaterialListDropdownData
                }
                productDetailInfo={props.productDetailInfo}
                handleDetailInputChange={props.handleDetailInputChange}
                productConditionListData={props.productConditionListData}
                claimTypeListData={props.claimTypeListData}
                salesUnitListData={props.salesUnitListData}
                materialListData={props.materialListData}
                isEditable={isEditable}
                errorMessages={props.productDetailError}
              />
              <View flex marginV-v4 />
            </ScrollView>
          )}
          {pdSelectedValue === PRODUCT_CLAIMS_TYPES.CLAIMS_SETTLEMENTS && (
            <ScrollView
              contentContainerStyle={{flexGrow: 1}}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}>
              <PCClaimsSettlementsComponent
                fetchClaimMaterialListDropdownData={
                  props.fetchClaimMaterialListDropdownData
                }
                getApprovedByDropdownData={getApprovedByDropdownData}
                productClaimInfo={props.productClaimInfo}
                handleClaimsInputChange={props.handleClaimsInputChange}
                approvedByListData={props.approvedByListData}
                salesUnitListData={props.salesUnitListData}
                materialListData={props.claimMaterialListData}
                isEditable={isEditable}
                errorMessages={productClaimInfoErrorMessage}
                priorityListData={props.priorityListData}
              />
              <View flex marginV-v2 />
            </ScrollView>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductDetailsComponent;
