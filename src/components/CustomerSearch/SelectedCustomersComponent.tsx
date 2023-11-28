import React, { useState } from 'react';
import View from 'src/components/View';
import { images } from 'src/assets/Images';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { TouchableOpacity, FlatList } from 'react-native';
import CustomerIconComponent2 from '../Common/CustomerIconComponent2';
import Dropdown from 'src/components/DropDown';
import { VISIT_HOURS_DROPDOWN } from 'src/utils/DropdownConst';
interface SelectedCustomersComponentProps {
  data: Array<string>;
  currentDate: string;
  onDeleteCustomer: any;
  handleStartTime: any;
  startTime: string;
}
const SelectedCustomersComponent = (props: SelectedCustomersComponentProps) => {
  const { data, currentDate, onDeleteCustomer, startTime, handleStartTime } = props;
  const date = currentDate.split(' ');

  const renderCustomer = ({ item }: any) => {
    return (
      <View
        onStartShouldSetResponder={() => true}
        key={item.customerShipTo}
        paddingH-v2
        bg-white
        marginT-v2
        br20
        row
        centerV
        spread
        style={tw('py-14px')}>
        <View row centerV flex-6>
          <View>
            <CustomerIconComponent2 item={item} />
          </View>
          <View marginL-v3 paddingR-v4>
            <Text text13R numberOfLines={1}>
              {item.name1}
            </Text>
            <Text text13R grey2 marginT-v03 numberOfLines={1}>
              {item.customerShipTo}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={tw('flex-1')}
          onPress={() => onDeleteCustomer(item.customerShipTo)}>
          <images.CancelNoBorderIcon />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <Text text18M textBlack>
        {date[2]} {date[1]} {date[3]}, {date[0]}
      </Text>
      <View marginT-v4 marginB-v4>
        <Dropdown
          title="label.customersearch.start_time"
          extraStyle={'w-140px'}
          placeholder="00:00"
          labelField="label"
          valueField="value"
          data={VISIT_HOURS_DROPDOWN}
          value={startTime}
          onChange={handleStartTime}
        />
      </View>
      <View marginV-v2 row>
        <View br20 bg-white paddingH-v1 paddingV-02 row>
          <Text text13R textBlack>
            {data.length.toString() + ' '}
          </Text>
          <Text text13R textBlack>
            label.customersearch.customers_selected
          </Text>
        </View>
      </View>
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 165 }}
        renderItem={renderCustomer}
      />
    </View>
  );
};

export default SelectedCustomersComponent;
