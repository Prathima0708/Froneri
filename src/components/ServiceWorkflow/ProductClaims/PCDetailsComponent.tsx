import View from 'src/components/View';
import React, {useState} from 'react';
import {tw} from 'src/tw';
import Dropdown from 'src/components/DropDown';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import {YES_NO_STATUS_DROPDOWN} from 'src/utils/DropdownConst';
import {DATETIME_PICKER_MODE} from 'src/utils/Constant';
import {TouchableOpacity} from 'react-native';
import {images} from 'src/assets/Images';
import {formatDateReverse} from 'src/utils/CommonUtil';
import InputText from 'src/components/InputText';
import Text from 'src/components/Text';
import DateTimePicker from 'src/components/DateTimePicker';
import DropdownSearchComponent from 'src/components/DropdownSearchComponent';

interface ProductClaimsInfoComponentProps {
  productDetailInfo: any;
  handleDetailInputChange: any;
  materialListData: any;
  salesUnitListData: any;
  productConditionListData: any;
  claimTypeListData: any;
  errorMessages: any;
  isEditable: boolean;
  fetchMaterialListDropdownData: any;
}

const PCDetailsComponent = (props: ProductClaimsInfoComponentProps) => {
  const {
    errorMessages,
    productDetailInfo,
    handleDetailInputChange,
    materialListData,
    salesUnitListData,
    claimTypeListData,
    isEditable,
  } = props;

  const productGroup = productDetailInfo?.productGroup || '-';
  return (
    <View marginT-v2>
      <View marginT-v2 row>
        <View flex-5 style={tw('border-light-lavendar')}>
          <Dropdown
            title="Material Number and Description*"
            isEditable={isEditable}
            data={materialListData}
            placeholder="Select Material Number and Description"
            value={productDetailInfo?.materialNumber}
            labelField={'description'}
            search
            valueField={'materialNumber'}
            onChange={handleDetailInputChange('materialNumber')}
            errorMsg={errorMessages.materialNumber}
            renderInputSearch={() => (
              <DropdownSearchComponent
                handleSearchDropdown={props.fetchMaterialListDropdownData}
              />
            )}
          />
        </View>
        <View flex-2 marginR-v2 marginL-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={'Product Group'}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={productGroup}
            onChangeText={handleDetailInputChange('productGroup')}
            isEditable={false}
            maxLength={40}
            errorMsg={errorMessages.productGroup}
          />
        </View>
        <View flex />
      </View>
      <View marginT-v4 row>
        <View flex style={tw('border-light-lavendar')}>
          <InputText
            title={'Batch Code or Delivery Date*'}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            placeholder="Enter Batch Code or Delivery Date"
            value={productDetailInfo?.batchCode}
            onChangeText={handleDetailInputChange('batchCode')}
            isEditable={isEditable}
            maxLength={40}
            errorMsg={errorMessages.batchCode}
          />
        </View>
        <View flex marginR-v2 marginL-v2 style={tw('border-light-lavendar')}>
          <View>
            <Text text13M textBlack>
              Best before Date
            </Text>
            <View style={tw(isEditable ? 'bg-light-white' : 'bg-light-white1')}>
              <DateTimePicker
                editable={isEditable}
                errorMessages={errorMessages.bestBeforDate}
                dateFormat={'DD-MM-YYYY'}
                mode={DATETIME_PICKER_MODE.DATE}
                onChange={handleDetailInputChange('bestBeforDate')}
                // maximumDate={
                //   productDetailInfo?.bestBeforDate !== ''
                //     ? productDetailInfo?.bestBeforDate
                //     : new Date()
                // }
                minimumDate={new Date()}
                value={productDetailInfo?.bestBeforDate}
                renderInput={() => {
                  return (
                    <View>
                      <TouchableOpacity
                        style={tw(
                          'flex-row items-center rounded-md border-default border-light-lavendar pl-2 justify-between  mt-1',
                        )}>
                        <Text grey2={!productDetailInfo?.bestBeforDate} text13R>
                          {productDetailInfo?.bestBeforDate
                            ? formatDateReverse(
                                productDetailInfo?.bestBeforDate,
                              )
                            : 'DD-MM-YYYY'}
                        </Text>
                        <images.CalendarIcon />
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </View>
        <View flex />
        <View flex />
      </View>
      <View marginT-v4 row>
        <View flex-5 style={tw('border-light-lavendar')}>
          <InputText
            title="Best before time visible on product label*"
            isEditable={isEditable}
            value={productDetailInfo?.bestBeforTime}
            enableErrors
            placeholder="Enter Best before time visible on product label"
            // validate={[(value: string) => value.length > 500]}
            validationMessage={['Words limit reached']}
            validateOnStart={true}
            validateOnChange={true}
            validationMessagePosition={'down'}
            showCharCounter={true}
            maxLength={100}
            errorMsg={errorMessages.bestBeforTime}
            onChangeText={handleDetailInputChange('bestBeforTime')}
          />
        </View>
        <View flex-2>
          <Text text13M textBlack marginL-v2>
            Quantity of claimed products*
          </Text>
          <View row marginL-v2>
            <View flex style={tw('border-light-lavendar')}>
              <InputText
                placeholder="Enter Quantity"
                inputPlaceHolderTextColor={ColourPalette.light.grey2}
                value={productDetailInfo?.quantity}
                keyboardType="numeric"
                onChangeText={handleDetailInputChange('quantity')}
                isEditable={isEditable}
                maxLength={40}
                errorMsg={errorMessages.quantity}
              />
            </View>
            <View
              flex
              marginL-v2
              marginT-v03
              style={tw('border-light-lavendar')}>
              <Dropdown
                isEditable={isEditable}
                data={salesUnitListData}
                placeholder="Cases"
                value={productDetailInfo?.salesUnit}
                labelField="unitOfMeasureDesc"
                valueField="unitOfMeasure"
                onChange={handleDetailInputChange('salesUnit')}
                errorMsg={errorMessages.salesUnit}
              />
            </View>
          </View>
        </View>
        <View flex />
      </View>
      <View marginT-v4 centerH style={tw('flex-row justify-between')}>
        <Text text18M textBlack>
          Reason for Claim
        </Text>
      </View>
      <View marginT-v2 row>
        <View flex style={tw('border-light-lavendar')}>
          <Dropdown
            title="Claim Type*"
            isEditable={isEditable}
            data={claimTypeListData}
            placeholder="Select Claim Type"
            value={productDetailInfo?.claimType}
            labelField="description"
            valueField="claim_code"
            onChange={handleDetailInputChange('claimType')}
            errorMsg={errorMessages.claimType}
          />
        </View>
        <View flex marginR-v2 marginL-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title={'Condition of the product*'}
            isEditable={isEditable}
            data={props.productConditionListData}
            placeholder="Enter Condition of the product"
            value={productDetailInfo?.productCondition}
            labelField={'description'}
            valueField={'claim_code'}
            onChange={handleDetailInputChange('productCondition')}
            errorMsg={errorMessages.materialNumber}
          />
        </View>
        <View flex />
        <View flex />
      </View>
      <View marginT-v3>
        <View flex style={tw('border-light-lavendar')}>
          <InputText
            title="Exact description of claim reason*"
            style={[tw('p-3 h-40'), {textAlignVertical: 'top'}]}
            isEditable={isEditable}
            multiline
            value={productDetailInfo?.claimDescription}
            enableErrors
            placeholder="Enter description"
            // validate={[(value: string) => value.length > 500]}
            validationMessage={['Words limit reached']}
            validateOnStart={true}
            validateOnChange={true}
            validationMessagePosition={'down'}
            showCharCounter={true}
            maxLength={1000}
            errorMsg={errorMessages.claimDescription}
            onChangeText={handleDetailInputChange('claimDescription')}
          />
        </View>
      </View>
      <View marginT-v3 row>
        <View flex style={tw('border-light-lavendar')}>
          <InputText
            title={'Email to share claimed product images'}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={productDetailInfo?.email}
            onChangeText={handleDetailInputChange('email')}
            isEditable={false}
            maxLength={40}
            errorMsg={errorMessages.email}
          />
        </View>
        <View flex />
        <View flex />
        <View flex />
      </View>
      <View marginT-v3 row>
        <View flex style={tw('border-light-lavendar')}>
          <Dropdown
            title="Are the claimed products available*"
            isEditable={isEditable}
            data={YES_NO_STATUS_DROPDOWN}
            placeholder="Select"
            value={productDetailInfo?.claimProductsAvl}
            labelField="label"
            valueField="value"
            onChange={handleDetailInputChange('claimProductsAvl')}
            errorMsg={errorMessages.claimProductsAvl}
            dropdownPosition={'top'}
          />
        </View>
        <View flex marginR-v2 marginL-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title="Is an Answer/Feedback requested by customer"
            isEditable={isEditable}
            data={YES_NO_STATUS_DROPDOWN}
            placeholder="Select"
            value={productDetailInfo?.feedbackRequested}
            labelField="label"
            valueField="value"
            onChange={handleDetailInputChange('feedbackRequested')}
            errorMsg={errorMessages.feedbackRequested}
            dropdownPosition={'top'}
          />
        </View>
        <View flex />
        <View flex />
      </View>
    </View>
  );
};

export default PCDetailsComponent;
