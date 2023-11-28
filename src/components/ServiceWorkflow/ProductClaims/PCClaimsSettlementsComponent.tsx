import View from 'src/components/View';
import React, {useState} from 'react';
import {tw} from 'src/tw';
import Dropdown from 'src/components/DropDown';
import {
  MATERIAL_NUMBER_DROPDOWN,
  YES_NO_STATUS_DROPDOWN,
} from 'src/utils/DropdownConst';
import {DATETIME_PICKER_MODE} from 'src/utils/Constant';
import {TouchableOpacity} from 'react-native';
import {images} from 'src/assets/Images';
import PCFreeGoodsListingHeaderComponent from './PCFreeGoodsListingHeaderComponent';
import RenderFreeGoodsComponent from './RenderFreeGoodsComponent';
import {FlashList} from '@shopify/flash-list';
import {formatDateReverse} from 'src/utils/CommonUtil';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import Text from 'src/components/Text';
import DateTimePicker from 'src/components/DateTimePicker';
import InputText from 'src/components/InputText';
import DropdownSearchComponent from 'src/components/DropdownSearchComponent';

interface ProductClaimsInfoComponentProps {
  errorMessages: any;
  salesUnitListData: any;
  materialListData: any;
  approvedByListData: any;
  productClaimInfo: any;
  handleClaimsInputChange: any;
  priorityListData: any;
  isEditable: boolean;
  getApprovedByDropdownData: any;
  fetchClaimMaterialListDropdownData: any;
}

const PCClaimsSettlementsComponent = (
  props: ProductClaimsInfoComponentProps,
) => {
  const {
    errorMessages,
    materialListData,
    salesUnitListData,
    productClaimInfo,
    handleClaimsInputChange,
    isEditable,
    getApprovedByDropdownData,
  } = props;

  const onDeleteTaPress = () => {};

  const handleMinorDamage = handleClaimsInputChange('minorDamage');
  const handleApprovedBy = handleClaimsInputChange('approvedBy');
  const handleAlreadyDestroyed = handleClaimsInputChange('alreadyDestroyed');
  const handlePickupNecessary = handleClaimsInputChange('pickupNecessary');
  const handleNotifiedProductDestructionDate = handleClaimsInputChange(
    'notifiedProductDestructionDate',
    0,
  );
  const handlePickUpDate = handleClaimsInputChange('pickUpDate');
  const handleClaimNumber = handleClaimsInputChange('claimNumber');
  const handlePriority = handleClaimsInputChange('priority');
  const handleDateOfAnswer = handleClaimsInputChange('dateOfAnswer');
  const handleReplyLetter = handleClaimsInputChange('replyLetter');

  return (
    <View flex marginT-v2>
      <View marginT-v4 centerH style={tw('flex-row justify-between')}>
        <Text text18M textBlack>
          Settlement
        </Text>
      </View>
      <View marginT-v2 row>
        <View flex style={tw('border-light-lavendar')}>
          <Dropdown
            title="Minor Damage"
            isEditable={isEditable}
            data={YES_NO_STATUS_DROPDOWN}
            placeholder="Select"
            value={productClaimInfo?.minorDamage}
            labelField="label"
            valueField="value"
            onChange={handleMinorDamage}
            errorMsg={errorMessages.minorDamage}
          />
        </View>
        <View flex />
        <View flex />
        <View flex />
      </View>
      <View marginT-v4>
        <View marginT-v1 style={tw('flex-row justify-between')}>
          <Text text18M textBlack>
            Free Goods
          </Text>
        </View>
        <View marginT-v3>
          <PCFreeGoodsListingHeaderComponent />
        </View>
        <View flex style={tw('border-light-grey1 h-24')}>
          <RenderFreeGoodsComponent
            errorMessages={errorMessages}
            salesUnitListData={salesUnitListData}
            materialListData={materialListData}
            item={productClaimInfo}
            index={0}
            lastItem={true}
            onDeleteTaPress={onDeleteTaPress}
            handleInputChange={handleClaimsInputChange}
            isEditable={isEditable}
            fetchClaimMaterialListDropdownData={
              props.fetchClaimMaterialListDropdownData
            }
          />
          {/* <FlashList
            data={productClaimInfo?.freeGoods ?? []}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item, index}) => {
              return (
                
              );
            }}
            extraData={true}
            keyboardShouldPersistTaps="always"
            estimatedItemSize={59}
          /> */}
          {/* ) } */}
        </View>
      </View>
      <View marginT-v4 row>
        <View flex style={tw('border-light-lavendar')}>
          <Dropdown
            title="Approved By"
            isEditable={isEditable}
            data={props.approvedByListData}
            placeholder="Select Sales Representative"
            value={productClaimInfo?.approvedBy}
            labelField="salesRepresentativesName"
            valueField="partnerNumber"
            onChange={handleApprovedBy}
            errorMsg={errorMessages.approvedBy}
            search
            searchPlaceholder="Search items..."
            renderInputSearch={() => (
              <DropdownSearchComponent
                handleSearchDropdown={getApprovedByDropdownData}
              />
            )}
          />
        </View>
        <View flex />
        <View flex />
        <View flex />
      </View>
      <View marginT-v10 centerH style={tw('flex-row justify-between')}>
        <Text text18M textBlack>
          Control of Pickup
        </Text>
      </View>
      <View marginT-v2 row>
        <View flex style={tw('border-light-lavendar')}>
          <Dropdown
            title="Product already destryed by consumer"
            isEditable={isEditable}
            data={YES_NO_STATUS_DROPDOWN}
            placeholder="Select"
            value={productClaimInfo?.alreadyDestroyed}
            labelField="label"
            valueField="value"
            onChange={handleAlreadyDestroyed}
            errorMsg={errorMessages.alreadyDestroyed}
          />
        </View>
        <View flex marginL-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title="Product pickup necessary"
            isEditable={isEditable}
            data={YES_NO_STATUS_DROPDOWN}
            placeholder="Select"
            value={productClaimInfo?.pickupNecessary}
            labelField="label"
            valueField="value"
            onChange={handlePickupNecessary}
            errorMsg={errorMessages.pickupNecessary}
          />
        </View>
        <View flex marginR-v2 marginL-v2 style={tw('border-light-lavendar')}>
          <View>
            <Text text13M textBlack>
              Customer notified of product destruction on
            </Text>
            <View style={tw(isEditable ? 'bg-light-white' : 'bg-light-white1')}>
              <DateTimePicker
                editable={isEditable}
                dateFormat={'DD-MM-YYYY'}
                mode={DATETIME_PICKER_MODE.DATE}
                onChange={handleNotifiedProductDestructionDate}
                maximumDate={new Date()}
                value={productClaimInfo?.notifiedProductDestructionDate}
                renderInput={() => {
                  return (
                    <View>
                      <TouchableOpacity
                        style={tw(
                          'flex-row items-center rounded-md border-default border-light-lavendar pl-2 justify-between  mt-1',
                        )}>
                        <Text
                          text13R
                          grey2={
                            !productClaimInfo?.notifiedProductDestructionDate
                          }>
                          {productClaimInfo?.notifiedProductDestructionDate
                            ? formatDateReverse(
                                productClaimInfo?.notifiedProductDestructionDate,
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
        <View flex marginR-v2 marginL-v2 style={tw('border-light-lavendar')}>
          <View>
            <Text text13M textBlack>
              Pick up date of products
            </Text>
            <View style={tw(isEditable ? 'bg-light-white' : 'bg-light-white1')}>
              <DateTimePicker
                editable={isEditable}
                dateFormat={'DD-MM-YYYY'}
                mode={DATETIME_PICKER_MODE.DATE}
                onChange={handlePickUpDate}
                maximumDate={new Date()}
                value={productClaimInfo?.pickUpDate}
                renderInput={() => {
                  return (
                    <View>
                      <TouchableOpacity
                        style={tw(
                          'flex-row items-center rounded-md border-default border-light-lavendar pl-2 justify-between  mt-1',
                        )}>
                        <Text grey2={!productClaimInfo?.pickUpDate}>
                          {productClaimInfo?.pickUpDate
                            ? formatDateReverse(productClaimInfo?.pickUpDate)
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
      </View>
      <View marginT-v8 centerH style={tw('flex-row justify-between')}>
        <Text text18M textBlack>
          Claim entry by quality/Back office
        </Text>
      </View>
      <View marginT-v3 row>
        <View flex style={tw('border-light-lavendar')}>
          <InputText
            title={'Claim Number'}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            placeholder="Enter Claim Number"
            value={productClaimInfo?.claimNumber}
            onChangeText={handleClaimNumber}
            isEditable={isEditable}
            maxLength={40}
            errorMsg={errorMessages.claimNumber}
          />
        </View>
        <View flex marginL-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title="Priority"
            isEditable={isEditable}
            data={props.priorityListData}
            placeholder="Select Priority"
            value={productClaimInfo.priority}
            labelField="description"
            valueField="claim_code"
            onChange={handlePriority}
            errorMsg={errorMessages.priority}
          />
        </View>
        <View flex marginR-v2 marginL-v2 style={tw('border-light-lavendar')}>
          <View>
            <Text text13M textBlack>
              Date of answer by quality team
            </Text>
            <View style={tw(isEditable ? 'bg-light-white' : 'bg-light-white1')}>
              <DateTimePicker
                editable={isEditable}
                dateFormat={'DD-MM-YYYY'}
                mode={DATETIME_PICKER_MODE.DATE}
                onChange={handleDateOfAnswer}
                maximumDate={new Date()}
                value={productClaimInfo?.dateOfAnswer}
                renderInput={() => {
                  return (
                    <View>
                      <TouchableOpacity
                        style={tw(
                          'flex-row items-center rounded-md border-default border-light-lavendar pl-2 justify-between  mt-1',
                        )}>
                        <Text text13R grey2={!productClaimInfo?.dateOfAnswer}>
                          {productClaimInfo?.dateOfAnswer
                            ? formatDateReverse(productClaimInfo?.dateOfAnswer)
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
      </View>
      <View marginT-v4>
        <View flex style={tw('border-light-lavendar')}>
          <InputText
            title="Reply letter to consumer"
            style={[tw('p-3 h-40'), {textAlignVertical: 'top'}]}
            isEditable={isEditable}
            multiline
            value={productClaimInfo?.replyLetter}
            enableErrors
            placeholder="Enter Reply"
            // validate={[(value: string) => value.length > 500]}
            validationMessage={['Words limit reached']}
            validateOnStart={true}
            validateOnChange={true}
            validationMessagePosition={'down'}
            showCharCounter={true}
            maxLength={1000}
            errorMsg={errorMessages.replyLetter}
            onChangeText={handleReplyLetter}
          />
        </View>
      </View>
    </View>
  );
};

export default PCClaimsSettlementsComponent;
