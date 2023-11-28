import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {useState} from 'react';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import {TouchableOpacity} from 'react-native';
import {images} from 'src/assets/Images';
import {tw} from 'src/tw';
import OrderModalComponent from './OrderModalComponent';
interface OrderHistoryProps {
  item: any;
  index: number;
  isFilterApplied: boolean;
}

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

const RenderOrderHistory = (props: OrderHistoryProps) => {
  const [isOrdersModalVisible, setIsOrdersModalVisible] = useState(false);
  const {item, index, isFilterApplied} = props;

  const localCreationDateTime = item.localCreationDateTime
    ? item.localCreationDateTime
    : '-';
  const localDeliveryDate = item.localDeliveryDate
    ? item.localDeliveryDate
    : '-';
  const formattedNetAmount = item.formattedNetAmount
    ? item.formattedNetAmount
    : '-';
  const orderOriginText = item.orderOriginText ? item.orderOriginText : '-';
  const employeeName = item.employeeName ? item.employeeName : '-';
  const sapDocumentNumber = item.sapDocumentNumber
    ? item.sapDocumentNumber
    : '-';
  const orderStatusText = item.orderStatusText ? item.orderStatusText : '';

  const onOrderPressed = () => {
    setIsOrdersModalVisible(!isOrdersModalVisible);
  };

  const handleOrdersModalGoBack = () => {
    setIsOrdersModalVisible(!isOrdersModalVisible);
  };

  return (
    <View>
      <TouchableOpacity
        style={{backgroundColor: colors[index % colors.length]}}
        onPress={onOrderPressed}>
        <View row centerV paddingH-v4 paddingV-v3>
          <Text text13M grey2 flex marginR-v2 numberOfLines={1}>
            {localCreationDateTime}
          </Text>
          <Text text13M grey2 flex marginR-v2 numberOfLines={1}>
            {orderOriginText}
          </Text>
          <Text text13M grey2 flex marginR-v2 numberOfLines={1}>
            {employeeName}
          </Text>
          <Text text13M grey2 flex marginR-v2 numberOfLines={1}>
            {localDeliveryDate}
          </Text>
          <Text text13M grey2 flex marginR-v1 numberOfLines={1}>
            {sapDocumentNumber}
          </Text>

          <View flex-2 marginR-v2 centerH>
            <Text
              text13M
              grey2
              marginR-v1
              numberOfLines={1}
              style={tw('text-center')}>
              {orderStatusText}
            </Text>
          </View>

          <Text text13M grey2 flex numberOfLines={1} style={tw('text-right')}>
            {formattedNetAmount}
          </Text>
        </View>
      </TouchableOpacity>
      {isOrdersModalVisible ? (
        <OrderModalComponent
          isModalVisible={isOrdersModalVisible}
          orderData={item}
          isFilterApplied={isFilterApplied}
          onPressBack={handleOrdersModalGoBack}
        />
      ) : null}
    </View>
  );
};

export default RenderOrderHistory;
