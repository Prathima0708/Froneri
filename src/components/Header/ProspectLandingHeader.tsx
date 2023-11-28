import React, { useState } from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { useNavigation } from '@react-navigation/native';
import { images } from 'src/assets/Images';
import { TouchableOpacity } from 'react-native';
import { RootState, useAppDispatch, useAppSelector } from 'src/reducers/hooks';
import CustomerIconComponent2 from '../Common/CustomerIconComponent2';
import {
  pageNameCLProductStatistics,
  pageNamePLOverview,
  pageNamePLTAChargeOff,
  pageNamePLTradeAssets,
} from 'src/routes/Routes';
import Switch from 'src/components/Switch';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import MessageModal from 'src/components/Common/MessageModal';
import Dropdown from 'src/components/DropDown';
import {
  SEPA_AGREEMENT_TYPE_DROPDOWN,
  TRADE_ASSETS_TYPE_DROPDOWN,
} from 'src/utils/DropdownConst';
import { removeLeadingZeroes } from 'src/utils/CommonUtil';
import { toast } from 'src/utils/Util';
import { resetProspectLandingState } from 'src/reducers/ProspectLandingSlice';
import ACLService from 'src/services/ACLService';

interface ProspectLandingHeaderProps {
  message?: string;
  screen?: string;
  onPressCustomerCreationReq?: any;
  agreementType?: any;
  handleSepaAgreementType?: any;
  createAgreementDropdown?: any;
  handleCaTypeDropdown?: any;
  isReactivate?: boolean;
  fromPLP?: boolean;
  onChangeReactivate?: (val: boolean) => void | undefined;
}

const ProspectLandingHeader = (props: ProspectLandingHeaderProps) => {
  const {
    message,
    screen,
    onPressCustomerCreationReq,
    agreementType,
    handleSepaAgreementType,
    createAgreementDropdown,
    handleCaTypeDropdown,
    isReactivate,
    fromPLP,
    onChangeReactivate,
  } = props;
  const navigation = useNavigation();

  const prospectInfoData = useAppSelector(
    (state: RootState) => state.prospectLanding.prospectInfo,
  );

  const dispatch = useAppDispatch();

  console.log('prospectInfoData :>> ', prospectInfoData);
  const name = prospectInfoData?.name1 || prospectInfoData?.customerName || '';
  const prospectNumber = prospectInfoData?.customerShipTo
    ? removeLeadingZeroes(prospectInfoData?.customerShipTo)
    : prospectInfoData?.prospectNumber;

  const handleGoBack = async () => {
    try {
      const isFormDirty = await ACLService.isFormDirty();

      navigation.goBack();

      if (fromPLP && !isFormDirty) {
        setTimeout(() => {
          dispatch(resetProspectLandingState());
        }, 500);
      }
    } catch (error) {
      console.log('error while navigating to previous screen :>> ', error);
      toast.error({
        message: "Something went wrong"
      })

    }
  };

  const handleReactivate = () => {
    if (!onChangeReactivate) return;

    onChangeReactivate(!isReactivate);
  };

  const renderCreateAgreementDropdown = (item: any) => {
    return (
      <View padding-v2>
        <Text
          text13R
          textBlack
          style={tw(
            `${item.value === agreementType
              ? 'text-light-darkBlue'
              : 'text-light-textBlack'
            }`,
          )}>
          {item.value}
        </Text>
      </View>
    );
  };

  const renderCreateConditionDropdown = (item: any) => {
    return (
      <View padding-v2>
        <Text
          style={tw(
            `${item.value === createAgreementDropdown
              ? 'text-light-darkBlue'
              : 'text-light-textBlack'
            } text-btn font-normal`,
          )}>
          {item.description}
        </Text>
      </View>
    );
  };

  const renderTradeAssetsDropdown = (item: any) => {
    return (
      <View padding-v2>
        <Text style={tw(`text-light-textBlack text-btn font-normal`)}>
          {item.value}
        </Text>
      </View>
    );
  };

  const handleTaTypeDropdown = (item: any) => {
    if (
      item.screen === pageNamePLTAChargeOff &&
      prospectInfoData.statusType.toLowerCase() === 'p'
    ) {
      toast.error({
        message: 'Charge Off agreement can only be created for customers',
        duration: 4000,
      });
      return;
    }

    navigation.navigate(
      item.screen as never,
      {
        type: item.value,
      } as never,
    );
  };

  return (
    <View centerH style={tw('flex-row p-12px justify-between')}>
      <View centerH centerV style={tw('flex-row')}>
        <TouchableOpacity onPress={handleGoBack}>
          <images.DefaultLeftArrowIcon />
        </TouchableOpacity>
        <View
          flex
          row
          centerV
          marginL-v12
          spread
          style={tw(`${screen === pageNameCLProductStatistics ? 'ml-4' : ''}`)}>
          <View row centerV>
            <CustomerIconComponent2
              item={{ ...prospectInfoData, visitType: null }}
            />
            <Text
              marginT-v03
              text18M
              textBlack
              marginH-v4
              numberOfLines={1}
              style={tw('max-w-md')}>
              {name}
            </Text>

            {prospectNumber && (
              <>
                <images.VerticalSeparatorIcon />
                <View
                  marginL-v4
                  paddingV-v01
                  paddingH-v1
                  center
                  style={tw(
                    `border-light-grey5 bg-light-lavendar2 border-default  rounded-md`,
                  )}>
                  <Text marginT-v03 text18M style={tw('text-light-textBlack')}>
                    {prospectNumber}
                  </Text>
                </View>
              </>
            )}
          </View>
          {screen === pageNamePLOverview && (
            <View row centerV>
              <View row centerV>
                <Text text13R textBlack>
                  Reactivate
                </Text>
                <Switch
                  offColor={ColourPalette.light.greyCloud}
                  onColor={ColourPalette.light.darkBlue}
                  thumbColor={ColourPalette.light.white}
                  onValueChange={handleReactivate}
                  value={isReactivate}
                  style={tw('ml-2')}
                />
              </View>
              <TouchableOpacity
                onPress={onPressCustomerCreationReq}
                style={tw(
                  'flex-row bg-light-white border-default border-light-darkBlue rounded-md items-center py-2-1 px-36px ml-36px',
                )}>
                <images.PlusBlueIcon />
                <Text text13R darkBlue marginL-v1>
                  Customer Creation Req
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {agreementType && (
            <Dropdown
              extraStyle={'w-190px border-light-darkBlue'}
              extraSelectedTextStyle={'text-light-darkBlue'}
              data={SEPA_AGREEMENT_TYPE_DROPDOWN}
              labelField="label"
              valueField="value"
              value={SEPA_AGREEMENT_TYPE_DROPDOWN[0].value}
              renderItem={renderCreateAgreementDropdown}
              onChange={handleSepaAgreementType}
              icon={<images.DownArrowBlueIcon />}
              renderLeftIcon={() => {
                return <images.PlusBlueIcon />;
              }}
            />
          )}
          {screen === 'PLConditionAgreement' &&
            createAgreementDropdown.length > 0 && (
              <Dropdown
                extraStyle={'w-195px bg-light-darkBlue'}
                extraSelectedTextStyle={'text-light-white ml-2'}
                extraPlaceholderStyle={'text-light-white ml-2 text-13px'}
                placeholder="Create Condition"
                data={createAgreementDropdown}
                labelField="label"
                valueField="description"
                value={createAgreementDropdown[0].label}
                renderItem={renderCreateConditionDropdown}
                onChange={handleCaTypeDropdown}
                icon={<images.WhiteDownIcon />}
                renderLeftIcon={() => {
                  return <images.PlusIcon />;
                }}
              />
            )}
          {screen === pageNamePLTradeAssets && (
            <Dropdown
              extraStyle={'w-32 bg-light-darkBlue items-center'}
              extraSelectedTextStyle={'text-light-white ml-2'}
              extraPlaceholderStyle={'text-light-white ml-2 text-13px'}
              placeholder="Create TA"
              value=""
              data={TRADE_ASSETS_TYPE_DROPDOWN}
              labelField="label"
              valueField="value"
              renderItem={renderTradeAssetsDropdown}
              onChange={handleTaTypeDropdown}
              icon={<images.WhiteDownIcon />}
              renderLeftIcon={() => {
                return <images.PlusIcon />;
              }}
            />
          )}
        </View>
      </View>
      {message && (
        <Text red10 text18>
          {message}
        </Text>
      )}

    </View>
  );
};

export default ProspectLandingHeader;
