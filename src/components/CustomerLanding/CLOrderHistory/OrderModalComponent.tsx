import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {useEffect, useState} from 'react';
import {tw} from 'src/tw';
import Modal from 'src/components/Modal';
import {images} from 'src/assets/Images';
import {ActivityIndicator, FlatList, TouchableOpacity} from 'react-native';
import RenderOrderComponent from 'src/components/CustomerLanding/CLOrderHistory/RenderOrderComponent';
import NoDataComponent from 'src/components/Common/NoDataComponent';
import {toast} from 'src/utils/Util';
import CLOrderHistoryController from 'src/controller/CLOrderHistoryController';

interface OrderModalProps {
  isModalVisible: boolean;
  onPressBack: any;
  orderData: any;
  isFilterApplied: boolean;
}

const OrderModalComponent = (props: OrderModalProps) => {
  const {isModalVisible, onPressBack, orderData, isFilterApplied} = props;
  const [loading, setLoading] = useState(false);
  const [orderLines, setOrderLines] = useState([]);

  const sapDocumentNumber = orderData.sapDocumentNumber
    ? orderData.sapDocumentNumber
    : '-';
  const idOrder = orderData.idOrder ? orderData.idOrder : '-';
  const orderTypeDescription = orderData.orderTypeDescription
    ? orderData.orderTypeDescription
    : '--';
  const poNumber = orderData.poNumber ? orderData.poNumber : '--';
  const localDeliveryDate = orderData.localDeliveryDate
    ? orderData.localDeliveryDate
    : '-';
  const formattedNetAmount = orderData.formattedNetAmount
    ? orderData.formattedNetAmount
    : '-';

  const orderStatusText = orderData.orderStatusText
    ? '|     ' + orderData.orderStatusText
    : '';

  useEffect(() => {
    setLoading(true);
    getOrderLinesInfo();
  }, []);

  const getOrderLinesInfo = async () => {
    CLOrderHistoryController.getOrderLinesInfo(idOrder, isFilterApplied)
      .then((res: any) => {
        setOrderLines(res);
      })
      .catch(err => {
        setOrderLines([]);
        toast.error({
          message: 'Something went wrong',
        });
        console.log('the err is', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleAlert = () => {
    toast.info({
      message: 'Order taking screen is in progress',
    });
  };

  return (
    <Modal visible={isModalVisible}>
      <View bg-white flex padding-v4 style={tw('ml-223px')}>
        {loading ? (
          <View flex centerH centerV>
            <ActivityIndicator size={'large'} />
          </View>
        ) : (
          <View flex>
            <View row centerV spread>
              <View row centerV>
                <TouchableOpacity onPress={onPressBack}>
                  <images.DefaultLeftArrowIcon />
                </TouchableOpacity>
                <Text text18BO textBlack marginT-v1 marginL-v6>
                  {'Order# ' + sapDocumentNumber}
                </Text>
                <View>
                  <Text text14R textBlack marginT-v1 marginL-v3 marginR-v3>
                    {orderStatusText}
                  </Text>
                </View>
              </View>
              <View row centerV>
                <TouchableOpacity onPress={handleAlert}>
                  <images.ViewIcon />
                </TouchableOpacity>
                <TouchableOpacity style={tw('mx-8')} onPress={handleAlert}>
                  <images.CopyIcon />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAlert}>
                  <images.EditWithBorderIcon />
                </TouchableOpacity>
              </View>
            </View>
            <View
              marginT-v4
              br40
              row
              spread
              padding-v4
              style={tw('border-default border-light-lavendar')}>
              <View>
                <Text text13M textBlack>
                  Order Type
                </Text>
                <Text text12R textBlack marginT-v03>
                  {orderTypeDescription}
                </Text>
              </View>
              <View>
                <Text text13M textBlack>
                  PO. Number
                </Text>
                <Text text12R textBlack marginT-v03>
                  {poNumber}
                </Text>
              </View>
              <View>
                <Text text13M textBlack>
                  Delivery Date
                </Text>
                <Text text12R textBlack marginT-v03>
                  {localDeliveryDate}
                </Text>
              </View>
              <View right>
                <Text text13M textBlack>
                  Net Amount
                </Text>
                <Text text12R textBlack marginT-v03>
                  {formattedNetAmount}
                </Text>
              </View>
            </View>
            <View>
              <View row centerV paddingH-v3 paddingV-v06 marginT-v4>
                <Text text13M textBlack flex marginR-v3>
                  Material #
                </Text>
                <Text text13M textBlack flex-4 marginR-v3>
                  Material Description
                </Text>
                <Text text13M textBlack flex marginR-v3>
                  Total Qty
                </Text>
                <Text text13M textBlack flex marginR-v3>
                  Regular
                </Text>
                <Text text13M textBlack flex marginR-v3>
                  Free Qty
                </Text>
                <Text text13M textBlack flex marginR-v3>
                  Sales Unit
                </Text>
                <View flex right>
                  <Text text13M textBlack>
                    Net Amount
                  </Text>
                </View>
              </View>
            </View>
            {orderLines.length == 0 ? (
              <NoDataComponent title={'No Data Found'} />
            ) : (
              <FlatList
                data={orderLines}
                keyExtractor={(item, i) => i.toString()}
                renderItem={({item, index}) => {
                  return <RenderOrderComponent item={item} index={index} />;
                }}
              />
            )}
          </View>
        )}
      </View>
    </Modal>
  );
};

export default OrderModalComponent;
