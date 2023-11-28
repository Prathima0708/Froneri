import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';

import View from 'src/components/View';
import Text from 'src/components/Text';
import CustomerIconComponent2 from 'src/components/Common/CustomerIconComponent2';

import { tw } from 'src/tw';

import { images } from 'src/assets/Images';

import { removeLeadingZeroes } from 'src/utils/CommonUtil';
import { toast } from 'src/utils/Util';

import {
  pageNameCLProductStatistics,
} from 'src/routes/Routes';

interface ServiceWorkFlowLandingHeaderProps {
  data: any;
  screen?: string;
}

const ServiceWorkFlowLandingHeader = (
  props: ServiceWorkFlowLandingHeaderProps,
) => {
  const { data, screen } = props;
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const copyText = () => {
    Clipboard.setString(customerShipTo);
    toast.info({
      message: "Copied to clipboard"
    })
  }

  const customerShipTo = useMemo(() => {
    if (data?.customerShipTo) {
      return removeLeadingZeroes(data?.customerShipTo)
    }

    return ''
  }, [data])

  const name = useMemo(() => {
    if (data?.name) {
      return data?.name
    }

    if (data?.name1) {
      return data?.name1
    }

    return '--'
  }, [data])

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
              item={data}
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

            <>
              <images.VerticalSeparatorIcon />
              <TouchableOpacity onPress={copyText} style={tw('ml-2-1')}>
                <View
                  marginL-v4
                  paddingV-v01
                  paddingH-v1
                  center
                  style={tw(
                    `border-light-grey5 bg-light-lavendar2 border-default  rounded-md`,
                  )}>
                  <Text marginT-v03 text18M style={tw('text-light-textBlack')}>
                    {customerShipTo}
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ServiceWorkFlowLandingHeader;
