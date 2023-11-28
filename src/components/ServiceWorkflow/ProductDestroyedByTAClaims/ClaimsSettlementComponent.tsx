import {Alert, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import View from 'src/components/View';
import InputText from 'src/components/InputText';
import {tw} from 'src/tw';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import Text from 'src/components/Text';
import Dropdown from 'src/components/DropDown';
import {
  DEFECT_STATUS_DROPDOWN,
  SERVICE_WORKFLOW_STATUS_DROPDOWN,
  SETTLEMENT_DONE_BY_DROPDOWN,
  YES_NO_STATUS_DROPDOWN,
} from 'src/utils/DropdownConst';
import DatePicker from 'src/components/DatePicker';
import {DATETIME_PICKER_MODE} from 'src/utils/Constant';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {images} from 'src/assets/Images';
import {formatDateReverse} from 'src/utils/CommonUtil';
import DropdownSearchComponent from 'src/components/DropdownSearchComponent';
interface ClaimsSettlementProps {
  claimSettlementData: any;
  responsibleRDCListData: any;
  approvedByistData: any;
  getApprovedBy: any;
  handlSettlementInputChange: any;
  isEditable: boolean;
  otherProductListData: any;
  icedProductListData: any;
}
const ClaimsSettlementComponent = (props: ClaimsSettlementProps) => {
  console.log(props.claimSettlementData);
  const handleDefectStatus = (value: any) => {
    props.handlSettlementInputChange('defectStatus', value);
  };
  const handleSettleDone = (value: any) => {
    props.handlSettlementInputChange('settlementDone', value);
  };
  const handleSettleDoneBy = (value: any) => {
    props.handlSettlementInputChange('settlementDoneBy', value);
  };
  const handleServiceRequestDateChange = (value: any) => {
    props.handlSettlementInputChange('requestDateTechnical', value);
  };
  const handleTADateChange = (value: any) => {
    props.handlSettlementInputChange('requestDateTA', value);
  };
  const handleRefundChange = (value: any) => {
    props.handlSettlementInputChange('refund', value);
  };
  const handleNetValueChange = (value: any) => {
    props.handlSettlementInputChange('totalNetValue', value);
  };
  const handleRDC = (value: any) => {
    props.handlSettlementInputChange('rdc', value);
  };
  const handleApprovedBy = (value: any) => {
    props.handlSettlementInputChange('approvedBy', value);
  };
  const handleNotesChange = (value: any) => {
    props.handlSettlementInputChange('notes', value);
  };

  useEffect(() => {
    let amount = 0;
    if (props?.otherProductListData && props.otherProductListData.length) {
      props.otherProductListData.forEach((element: any) => {
        if (element.price && !isNaN(element.price)) {
          amount += element.price;
        }
      });
    }
    if (props?.icedProductListData && props.icedProductListData.length) {
      props.icedProductListData.forEach((element: any) => {
        if (element.price && !isNaN(element.price)) {
          amount += element.price;
        }
      });
    }
    handleNetValueChange(amount);
  }, []);

  return (
    <View>
      <Text text18M textBlack>
        Settlement
      </Text>
      <View marginT-v3 row>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title={'Defect Status'}
            isEditable={props.isEditable}
            data={DEFECT_STATUS_DROPDOWN}
            value={props.claimSettlementData.defectStatus + ''}
            labelField={'label'}
            valueField={'value'}
            onChange={handleDefectStatus}
            errorMsg={''}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title={'Settlement Done'}
            isEditable={props.isEditable}
            data={YES_NO_STATUS_DROPDOWN}
            value={props.claimSettlementData.settlementDone + ''}
            labelField={'label'}
            valueField={'value'}
            onChange={handleSettleDone}
            errorMsg={''}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title={'Settlement Done By'}
            isEditable={props.isEditable}
            data={SETTLEMENT_DONE_BY_DROPDOWN}
            value={props.claimSettlementData.settlementDoneBy + ''}
            labelField={'label'}
            valueField={'value'}
            onChange={handleSettleDoneBy}
            errorMsg={''}
          />
        </View>

        <View flex marginR-v2 style={tw('border-light-lavendar')}></View>
      </View>
      <Text marginT-v6 text18M textBlack>
        Settlement Details
      </Text>
      <View marginT-v3 row>
        <View flex marginR-v2 style={tw('border-light-lavendar ')}>
          <Text text13M textBlack style={tw('mb-1')}>
            Service Technical Request Date
          </Text>
          <View style={tw('bg-light-white')}>
            <DatePicker
              isEditable={props.isEditable}
              mode={DATETIME_PICKER_MODE.DATE}
              onChange={handleServiceRequestDateChange}
              renderInput={() => {
                return (
                  <TouchableOpacity
                    style={tw(
                      'flex-row justify-between items-center rounded-md border-default border-light-lavendar',
                    )}>
                    <Text marginH-v2 text13R grey2>
                      {props.claimSettlementData.requestDateTechnical
                        ? formatDateReverse(
                            props.claimSettlementData.requestDateTechnical,
                          )
                        : 'DD-MM-YYYY'}
                    </Text>
                    <images.CalendarIcon />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar ')}>
          <Text text13M textBlack style={tw('mb-1')}>
            TA Report Request Date
          </Text>
          <View style={tw('bg-light-white')}>
            <DatePicker
              isEditable={props.isEditable}
              mode={DATETIME_PICKER_MODE.DATE}
              onChange={handleTADateChange}
              renderInput={() => {
                return (
                  <TouchableOpacity
                    style={tw(
                      'flex-row justify-between items-center rounded-md border-default border-light-lavendar',
                    )}>
                    <Text marginH-v2 text13R grey2>
                      {props.claimSettlementData.requestDateTA
                        ? formatDateReverse(
                            props.claimSettlementData.requestDateTA,
                          )
                        : 'DD-MM-YYYY'}
                    </Text>
                    <images.CalendarIcon />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar ')}>
          <InputText
            title={'Refund%'}
            onChangeText={handleRefundChange}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={props.claimSettlementData.refund + ''}
            isEditable={props.isEditable}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar ')}>
          <InputText
            title={'Total net value of Product Destroyed'}
            onChangeText={handleNetValueChange}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={props.claimSettlementData.totalNetValue + ''}
            isEditable={props.isEditable}
          />
        </View>
      </View>
      <View marginT-v3 row>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title={'Responsible RDC'}
            isEditable={props.isEditable}
            data={props.responsibleRDCListData}
            value={props?.claimSettlementData?.rdc ?? ''}
            labelField={'rdc_number'}
            valueField={'description'}
            onChange={handleRDC}
            errorMsg={''}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title={'Approved By'}
            isEditable={props.isEditable}
            data={props.approvedByistData ?? []}
            value={props?.claimSettlementData?.approvedBy ?? ''}
            labelField={'salesRepresentativesName'}
            valueField={'partnerNumber'}
            onChange={handleApprovedBy}
            errorMsg={''}
            search
            renderInputSearch={() => (
              <DropdownSearchComponent
                handleSearchDropdown={props?.getApprovedBy}
              />
            )}
          />
        </View>

        <View flex marginR-v2 style={tw('border-light-lavendar')}></View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}></View>
      </View>
      <View marginT-v5>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            multiline
            title={'Notes*'}
            contextMenuHidden={true}
            style={[
              tw('h-136px text-btn py-2 leading-5'),
              {textAlignVertical: 'top'},
            ]}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            isEditable={props.isEditable}
            value={props?.claimSettlementData?.notes ?? ''}
            onChangeText={handleNotesChange}
            errorMsg={''}
          />
          <View marginT-v1 style={tw('items-end')}>
            <Text text13M text90R>
              {`${(props?.claimSettlementData?.notes ?? '').length} / 500`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ClaimsSettlementComponent;

const styles = StyleSheet.create({});
