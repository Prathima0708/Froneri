import View from 'src/components/View';
import Text from 'src/components/Text';
import { images } from 'src/assets/Images';
import React, { useEffect, useState } from 'react';
import Card from 'src/components/Card';
import { tw } from 'src/tw';
import { TouchableOpacity } from 'react-native';
import { RootState, useAppSelector } from 'src/reducers/hooks';
import { removeLeadingZeroes } from 'src/utils/CommonUtil';
import CopyTextComponent from 'src/components/Common/CopyTextComponent';

interface CustomerInfoComponentProps {
  isOnVacation: boolean;
  isNewOrder: boolean;
  vacationDate: string;
  onCrmButtonPress: any;
}

const CustomerInfoComponent = (props: CustomerInfoComponentProps) => {
  const { isOnVacation, vacationDate, isNewOrder, onCrmButtonPress } = props;

  const customerInfoData = useAppSelector(
    (state: RootState) => state.customerLanding.customerInfo,
  );

  const customerShipTo = customerInfoData.customerShipTo
    ? removeLeadingZeroes(customerInfoData.customerShipTo)
    : '';

  const name = customerInfoData?.name1 || '';
  const name2 =
    customerInfoData.name2 && customerInfoData.name2.trim()
      ? customerInfoData.name2
      : '--';
  const name3 =
    customerInfoData.name3 && customerInfoData.name3.trim()
      ? customerInfoData.name3
      : '--';
  const address1 =
    customerInfoData.address1 && customerInfoData.address1.trim()
      ? customerInfoData.address1
      : '--';
  const postalCode = customerInfoData?.postalCode && customerInfoData?.postalCode.trim() ? customerInfoData?.postalCode.trim() : '';
  const city = customerInfoData?.city && customerInfoData?.city.trim() ? customerInfoData?.city.trim() : '';

  const address = `${address1} ${city} ${postalCode}`;

  return (
    <Card marginR-v2 marginB-v2>
      {isOnVacation && (
        <View row centerV style={tw('w-full rounded-t-12px bg-light-white3')}>
          <images.VacationInactiveIcon />
          <Text text13R textBlack>
            {name} is on vacation till {vacationDate}
          </Text>
        </View>
      )}
      <View padding-v4>
        <Text text18M textBlack>
          label.customerlandingoverview.customer_information
        </Text>
        <View row spread marginT-v1>
          <View paddingR-v2 flex-2>
            <Text text13M textBlack>
              label.general.customer_no
            </Text>
            <CopyTextComponent
              marginT-v1
              text13R
              textBlack
              numberOfLines={1}
              text={customerShipTo}
              iconStyle={{ 'marginT-v1': true }}
            />
          </View>
          <View paddingR-v2 flex-2>
            <Text text13M textBlack>
              label.general.name2
            </Text>
            <Text marginT-v1 text13R textBlack numberOfLines={0}>
              {name2}
            </Text>
          </View>
          <View paddingR-v2 flex-2>
            <Text text13M textBlack>
              label.general.name3
            </Text>
            <Text marginT-v1 text13R textBlack numberOfLines={0}>
              {name3}
            </Text>
          </View>
          <View flex-3>
            <Text text13M textBlack>
              label.general.address
            </Text>
            <CopyTextComponent
              marginT-v1
              text13R
              textBlack
              numberOfLines={0}
              style={{ maxWidth: 140 }}
              text={address}
              iconStyle={{ 'marginT-v1': true, 'marginL-v1': true }}
            />
          </View>
        </View>
        <View row right marginT-v4>
          {!customerInfoData?.isOrderTakingDisabled && <TouchableOpacity
            style={tw(
              'flex-row justify-center items-center px-12 py-2 border-default border-light-lavendar rounded-md',
            )}>
            <images.DarkPlusIcon />
            <Text text13R textBlack marginL-v1>
              label.customerlandingoverview.new_order
            </Text>
          </TouchableOpacity>}
          <TouchableOpacity
            style={tw(
              'flex-row justify-center items-center px-12 py-7px border-default border-light-darkBlue rounded-md ml-8',
            )}
            onPress={onCrmButtonPress}
          >
            <images.EyeIcon />
            <Text text13R darkBlue marginL-v1>
              label.customerlandingoverview.view_crm
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

export default CustomerInfoComponent;
