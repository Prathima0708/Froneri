import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { useNavigation } from '@react-navigation/native';
import { images } from 'src/assets/Images';
import { TouchableOpacity } from 'react-native';
import { RootState, useAppSelector } from 'src/reducers/hooks';
import CustomerIconComponent from '../Common/CustomerIconComponent';
import CustomerIconComponent2 from '../Common/CustomerIconComponent2';
import { pageNameCLProductStatistics, pageNameCLServiceWorkflow, pageNameSWBasicInfo } from 'src/routes/Routes';
import { removeLeadingZeroes } from 'src/utils/CommonUtil';
import Clipboard from '@react-native-clipboard/clipboard';
import { toast } from 'src/utils/Util';

interface CustomerLandingHeaderProps {
  message?: string;
  screen?: string;
}

const CustomerLandingHeader = (props: CustomerLandingHeaderProps) => {
  const { message, screen } = props;
  const navigation = useNavigation();

  const customerInfoData = useAppSelector(
    (state: RootState) => state.customerLanding.customerInfo,
  );

  const fromCustomerSearch = customerInfoData?.fromCustomerSearch;

  const name = customerInfoData?.name1 || '';
  const customerShipToBgColor =
    customerInfoData?.overdue === '1'
      ? 'border-light-yellow1 bg-light-white4'
      : 'border-light-grey5 bg-light-lavendar2';
  const customerShipToTextColor =
    customerInfoData?.overdue === '1'
      ? 'text-light-orange1'
      : 'text-light-textBlack';
  const customerShipTo = customerInfoData.customerShipTo
    ? removeLeadingZeroes(customerInfoData.customerShipTo)
    : '';

  const handleGoBack = () => {
    navigation.goBack();
  };

  const copyText = () => {
    Clipboard.setString(customerShipTo);
    toast.info({
      message: "Copied to clipboard"
    })
  }

  const handleCreateServiceWorkflow = () => {
    navigation.navigate(
      pageNameSWBasicInfo as never,
      {
        data: customerInfoData,
        isEditable: false,
      } as never,
    );
  }

  return (
    <View centerH style={tw('flex-row p-12px justify-between')}>
      <View centerH centerV style={tw('flex-row')}>
        <TouchableOpacity onPress={handleGoBack}>
          <images.DefaultLeftArrowIcon />
        </TouchableOpacity>
        <View
          row
          centerV
          marginL-v12
          style={tw(`${screen == pageNameCLProductStatistics ? 'ml-4' : ''}`)}>
          {fromCustomerSearch ? (
            <CustomerIconComponent2
              item={{ ...customerInfoData, visitType: null }}
            />
          ) : (
            <CustomerIconComponent
              item={{ ...customerInfoData, visit_type: null }}
            />
          )}
          <Text marginT-v03 text18M textBlack marginH-v4>
            {name}
          </Text>
          <images.VerticalSeparatorIcon />
          <TouchableOpacity onPress={copyText} style={tw('ml-2-1')} >
            <View
              marginL-v4
              paddingV-v01
              paddingH-v1
              center
              style={tw(`${customerShipToBgColor} border-default  rounded-md`)}>
              <Text marginT-v03 text18M style={tw(customerShipToTextColor)}>
                {customerShipTo}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {message && (
        <Text red10 text18>
          {message}
        </Text>
      )}
      {screen === pageNameCLServiceWorkflow && <TouchableOpacity
        onPress={handleCreateServiceWorkflow}
        style={tw(
          'flex-row bg-light-darkBlue border-default border-light-darkBlue rounded-md items-center py-2-1 px-36px ml-36px',
        )}>
        <images.PlusIcon />
        <Text text13R white marginL-v1>
          Create Service Workflow
        </Text>
      </TouchableOpacity>}
    </View>
  );
};

export default CustomerLandingHeader;
