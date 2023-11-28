import View from 'src/components/View';
import Text from 'src/components/Text';
import { images } from 'src/assets/Images';
import { tw } from 'src/tw';
import React, { useState } from 'react';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import ExpandableSection from 'src/components/ExpandableSection';
import { TouchableOpacity } from 'react-native';

interface RenderCLCHCustomerComponentProps {
  data: any;
  index: number;
}

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

const RenderCLCHCustomerComponent = (
  props: RenderCLCHCustomerComponentProps,
) => {
  const { data, index } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandable = () => {
    setIsExpanded(!isExpanded);
  };

  const employeeNumber = data?.employeeNumber && data.employeeNumber.trim() ? data.employeeNumber : '-';
  const employeeName = data?.employeeName && data.employeeName.trim() ? data.employeeName : '-';
  const contactType = data?.callType && data.callType.trim() ? data.callType : '-';
  const result = data?.result && data.result.trim() ? data.result : '-';
  const callPlace = data?.callPlace && data.callPlace.trim() ? data.callPlace : '-';
  const jdeOrder = data?.jdeOrder && data.jdeOrder.trim() ? data.jdeOrder : '-';
  const deliveryDate = data?.deliveryDate && data.deliveryDate.trim() ? data.deliveryDate : '-';
  const manualAction = data?.manualAction && data.manualAction.trim() ? data.manualAction : '-';
  const details = data?.details && data.details.trim() ? data.details : '-';
  const date = data?.date && data.date.trim() ? data.date : '-';
  const time = data?.time && data.time.trim() ? data.time : '-';

  let borderColor = '';

  if (data.colorCode === 'Magenta') {
    borderColor = 'border-light-green1';
  } else if (data.colorCode === 'Blue') {
    borderColor = 'border-light-darkBlue3';
  } else if (data.colorCode === 'Orange') {
    borderColor = 'border-light-yellow2';
  }

  return (
    <View
      style={[
        tw(`${isExpanded ? 'border-0.5 border-light-grey2' : ''}`),
        { backgroundColor: colors[index % colors.length] },
      ]}>
      <View
        style={[
          tw(
            `${borderColor && borderColor + ' border-2'
            } absolute h-10 rounded-r-md`,
          ),
          { height: '60%', top: '20%' },
        ]}></View>
      <View row marginH-v4 marginV-v2>
        <View flex-2 marginR-v5>
          <Text text13R grey2 numberOfLines={1}>
            {date}
          </Text>
          <Text text13R grey2 numberOfLines={1} marginT-v1>
            {time}
          </Text>
        </View>
        <View flex-3 marginR-v5>
          <Text text13R grey2 numberOfLines={1}>
            {employeeNumber}
          </Text>
          <Text text13R grey2 numberOfLines={1} marginT-v1>
            {employeeName}
          </Text>
        </View>
        <View flex-2 marginR-v5>
          <Text text13R grey2 numberOfLines={1}>
            {contactType}
          </Text>
        </View>
        <View flex-5 marginR-v5>
          <Text text13R grey2 numberOfLines={1}>
            {manualAction}
          </Text>
        </View>
        <View row spread flex-3 marginR-v5>
          <Text text13R grey2 numberOfLines={1} flex-6 marginR-v5>
            {result}
          </Text>
          <TouchableOpacity style={tw('flex-1')} onPress={handleExpandable}>
            {isExpanded ? <images.UpIcon /> : <images.DownIcon />}
          </TouchableOpacity>
        </View>
      </View>
      <ExpandableSection expanded={isExpanded}>
        <View margin-v2 style={tw('border-t-0.5 border-light-grey1')}></View>
        <View
          row
          marginH-v4
          marginV-v2
          style={{ backgroundColor: colors[index % colors.length] }}>
          <View flex-2 marginR-v5>
            <Text text13M textBlack numberOfLines={1}>
              JDE Order
            </Text>
            <Text text13R grey2 numberOfLines={1} marginT-v1>
              {jdeOrder}
            </Text>
          </View>
          <View flex-3 marginR-v5>
            <Text text13M textBlack numberOfLines={1}>
              Delivery Date
            </Text>
            <Text text13R grey2 numberOfLines={1} marginT-v1>
              {deliveryDate}
            </Text>
          </View>
          <View flex-2 marginR-v5>
            <Text text13M textBlack numberOfLines={1}>
              Call Place
            </Text>
            <Text text13R grey2 numberOfLines={1} marginT-v1>
              {callPlace}
            </Text>
          </View>
          <View flex-5 marginR-v5>
            <Text text13M textBlack numberOfLines={1}>
              Details
            </Text>
            <Text text13R grey2 marginT-v1 numberOfLines={1}>
              {details}
            </Text>
          </View>
          <View row spread flex-3 marginR-v5></View>
        </View>
      </ExpandableSection>
    </View>
  );
};

export default RenderCLCHCustomerComponent;
