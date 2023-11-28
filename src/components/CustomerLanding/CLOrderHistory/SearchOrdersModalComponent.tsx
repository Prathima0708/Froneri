import View from 'src/components/View';
import Text from 'src/components/Text';
import React, { useState } from 'react';
import { tw } from 'src/tw';
import Modal from 'src/components/Modal';
import { images } from 'src/assets/Images';
import { Alert, TouchableOpacity } from 'react-native';
import InputText from 'src/components/InputText';
import Dropdown from 'src/components/DropDown';
import DateTimePicker from 'src/components/DateTimePicker';
import { DATETIME_PICKER_MODE } from 'src/utils/Constant';
import { toast } from 'src/utils/Util';

interface SearchOrderProps {
  isModalVisible: boolean;
  onPressCancel: any;
  onPressSearchOrders: any;
  searchObjInitial: any;
  orderTypeDropDown: any;
}

const SearchOrdersModalComponent = (props: SearchOrderProps) => {
  const {
    isModalVisible,
    onPressCancel,
    onPressSearchOrders,
    searchObjInitial,
    orderTypeDropDown,
  } = props;
  const [searchOrderObj, setSearchOrderObj] = useState(searchObjInitial);

  const handleOrderNumber = (text: string) => {
    setSearchOrderObj({ ...searchOrderObj, orderNumber: text });
  };

  const handleTESSInternalNumber = (text: string) => {
    setSearchOrderObj({ ...searchOrderObj, tessInternalNumber: text });
  };

  const handlePurchaseOrderNumber = (text: string) => {
    setSearchOrderObj({ ...searchOrderObj, purchaseOrderNumber: text });
  };

  const handleOrderType = (data: any) => {
    setSearchOrderObj({ ...searchOrderObj, orderType: [data] });
  };

  const handleDeliveredFrom = (date: any) => {
    setSearchOrderObj({ ...searchOrderObj, deliveryDateFrom: date });
  };

  const handleDeliveredTo = (date: any) => {
    setSearchOrderObj({ ...searchOrderObj, deliveryDateTo: date });
  };

  const handleOrderedFrom = (date: any) => {
    setSearchOrderObj({ ...searchOrderObj, orderedFrom: date });
  };

  const handleOrderedTo = (date: any) => {
    setSearchOrderObj({ ...searchOrderObj, orderedTo: date });
  };

  const handleSearchOrders = () => {
    // creationDateFrom/orderedFrom  – Required (YYYYMMDD format)
    // creationDateTo/orderedTo  – Required (YYYYMMDD format)
    if (searchOrderObj.orderedFrom == '' || searchOrderObj.orderedTo == '') {
      toast.error({
        message: 'Both Ordered From and Ordered To date are required'
      })

      return;
    }
    onPressSearchOrders(searchOrderObj);
  };

  const handleClearSearch = () => {
    setSearchOrderObj({
      orderNumber: '',
      tessInternalNumber: '',
      purchaseOrderNumber: '',
      orderType: '',
      deliveryDateFrom: '',
      deliveryDateTo: '',
      orderedFrom: '',
      orderedTo: '',
    });
  };

  return (
    <Modal visible={isModalVisible}>
      <View bg-white flex padding-v4 style={{ marginLeft: '50%' }}>
        <View row centerV spread>
          <Text text26BO textBlack>
            Search Orders
          </Text>
          <TouchableOpacity onPress={onPressCancel}>
            <images.CancelNoBorderIcon />
          </TouchableOpacity>
        </View>
        <View marginT-v4>
          <InputText
            title="Order Number"
            value={searchOrderObj.orderNumber}
            placeholder="Enter Order Number"
            onChangeText={handleOrderNumber}
          />
        </View>
        <View marginT-v4>
          <InputText
            title="TESS Internal Number"
            value={searchOrderObj.tessInternalNumber}
            placeholder="Enter TESS Internal Number"
            onChangeText={handleTESSInternalNumber}
          />
        </View>
        <View marginT-v4>
          <InputText
            title="Purchase Order Number"
            value={searchOrderObj.purchaseOrderNumber}
            placeholder="Enter PO Number"
            onChangeText={handlePurchaseOrderNumber}
          />
        </View>
        <View marginT-v4>
          <Dropdown
            title="Order Type"
            labelField="translationKey"
            valueField="translationKey"
            placeholder="Select Order Type"
            data={orderTypeDropDown}
            value={
              searchOrderObj.orderType.length > 0
                ? searchOrderObj.orderType[0].translationKey
                : ''
            }
            onChange={handleOrderType}
          />
        </View>
        <View row marginT-v4>
          <View flex>
            <Text text13M textBlack>
              Delivered From
            </Text>
            <DateTimePicker
              dateFormat={'DD-MM-YYYY'}
              mode={DATETIME_PICKER_MODE.DATE}
              maximumDate={
                searchOrderObj.deliveryDateTo !== ''
                  ? searchOrderObj.deliveryDateTo
                  : new Date()
              }
              onChange={handleDeliveredFrom}
              renderInput={({ value }: any) => {
                return (
                  <View
                    style={tw(
                      'flex-row items-center rounded-md border-default border-light-lavendar  pl-3 justify-between mr-3 mt-1',
                    )}>
                    <Text text13R marginR-v2 textBlack>
                      {value}
                    </Text>
                    <images.CalendarIcon />
                  </View>
                );
              }}
              value={searchOrderObj.deliveryDateFrom}
            />
          </View>
          <View flex>
            <Text text13M textBlack>
              Delivered To
            </Text>
            <DateTimePicker
              dateFormat={'DD-MM-YYYY'}
              mode={DATETIME_PICKER_MODE.DATE}
              minimumDate={
                searchOrderObj.deliveryDateFrom !== ''
                  ? searchOrderObj.deliveryDateFrom
                  : new Date(1950, 0, 1)
              }
              maximumDate={new Date()}
              onChange={handleDeliveredTo}
              renderInput={({ value }: any) => {
                return (
                  <View
                    style={tw(
                      'flex-row items-center rounded-md border-default border-light-lavendar  pl-3 justify-between mt-1',
                    )}>
                    <Text text13R marginR-v2 textBlack>
                      {value}
                    </Text>
                    <images.CalendarIcon />
                  </View>
                );
              }}
              value={searchOrderObj.deliveryDateTo}
            />
          </View>
        </View>
        <View row marginT-v4>
          <View flex>
            <Text text13M textBlack>
              Ordered From*
            </Text>
            <DateTimePicker
              dateFormat={'DD-MM-YYYY'}
              mode={DATETIME_PICKER_MODE.DATE}
              maximumDate={
                searchOrderObj.orderedTo !== ''
                  ? searchOrderObj.orderedTo
                  : new Date()
              }
              onChange={handleOrderedFrom}
              renderInput={({ value }: any) => {
                return (
                  <View
                    style={tw(
                      'flex-row items-center rounded-md border-default border-light-lavendar  pl-3 justify-between mr-3 mt-1',
                    )}>
                    <Text text13R marginR-v2 textBlack>
                      {value}
                    </Text>
                    <images.CalendarIcon />
                  </View>
                );
              }}
              value={searchOrderObj.orderedFrom}
            />
          </View>
          <View flex>
            <Text text13M textBlack>
              Ordered To*
            </Text>
            <DateTimePicker
              dateFormat={'DD-MM-YYYY'}
              mode={DATETIME_PICKER_MODE.DATE}
              minimumDate={
                searchOrderObj.orderedFrom !== ''
                  ? searchOrderObj.orderedFrom
                  : new Date(1950, 0, 1)
              }
              maximumDate={new Date()}
              onChange={handleOrderedTo}
              renderInput={({ value }: any) => {
                return (
                  <View
                    style={tw(
                      'flex-row items-center rounded-md border-default border-light-lavendar  pl-3 justify-between mt-1',
                    )}>
                    <Text text13R marginR-v2 textBlack>
                      {value}
                    </Text>
                    <images.CalendarIcon />
                  </View>
                );
              }}
              value={searchOrderObj.orderedTo}
            />
          </View>
        </View>
        <View flex bottom>
          <View row centerV right style={tw('self-end')}>
            <TouchableOpacity
              style={tw('py-2 px-8')}
              onPress={handleClearSearch}>
              <Text text13R style={tw('text-light-darkBlue')}>
                Clear Search
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw('rounded-md bg-light-darkBlue py-2 px-8 ml-8')}
              onPress={handleSearchOrders}>
              <Text text13R style={tw('text-light-white ml-1')}>
                Search Orders
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SearchOrdersModalComponent;
