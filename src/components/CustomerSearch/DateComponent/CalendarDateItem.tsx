import React, { useEffect, useState } from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { TouchableOpacity } from 'react-native';
import SelectedCustomersComponent from 'src/components/CustomerSearch/SelectedCustomersComponent';
import Tooltip from 'react-native-walkthrough-tooltip';

interface CalendarDateItemProps {
  key: string;
  date: string;
  isActiveDate: string;
  onDatePress: any;
  allSelectedCustomersList: any;
  setAllSelectedCustomersList: any;
}

const CalendarDateItem = (props: CalendarDateItemProps) => {
  const {
    date,
    onDatePress,
    allSelectedCustomersList,
    setAllSelectedCustomersList,
  } = props;

  const [selectedCustomersData, setSelectedCustomersData] = useState([]);
  const [startTime, setStartTime] = useState('1');

  const [showPopover, setShowPopover] = useState(false);
  const newDate = date.split(' ');

  useEffect(() => {
    findAndSetCustomersData();
  }, [date, allSelectedCustomersList]);

  const findAndSetCustomersData = () => {
    const selectedCustomer = allSelectedCustomersList.find(
      (item: any) => item.date === date,
    );
    if (selectedCustomer) {
      setSelectedCustomersData(selectedCustomer.data);
      if (selectedCustomer?.time) {
        setStartTime(selectedCustomer?.time);
      }
    } else {
      setSelectedCustomersData([]);
    }
  };

  const handleClickedDate = () => {
    onDatePress(date);
    setShowPopover(true);
  };

  const handleDeleteCustomers = (customerShipTo: any) => {
    const updatedData = selectedCustomersData.filter(
      (selectedCustomer: any) =>
        selectedCustomer.customerShipTo !== customerShipTo,
    );
    setSelectedCustomersData(updatedData);

    const selectedCustomerIndex = allSelectedCustomersList.findIndex(
      (item: any) => item.date === date,
    );

    const allSelectedCustomersListClone = [...allSelectedCustomersList];
    allSelectedCustomersListClone[selectedCustomerIndex].data = updatedData;
    setAllSelectedCustomersList(allSelectedCustomersListClone);
  };

  const onTimeChange = (time: any) => {
    const selectedCustomerIndex = allSelectedCustomersList.findIndex(
      (item: any) => item.date === date,
    );

    if (selectedCustomerIndex === -1) {
      const allSelectedCustomersListClone = [...allSelectedCustomersList];
      allSelectedCustomersListClone.push({
        date,
        data: [],
        time,
      });
      setAllSelectedCustomersList(allSelectedCustomersListClone);
    } else {
      const allSelectedCustomersListClone = [...allSelectedCustomersList];
      allSelectedCustomersListClone[selectedCustomerIndex].time = time;
      setAllSelectedCustomersList(allSelectedCustomersListClone);
    }
  }

  const handleStartTime = (item: any) => {
    setStartTime(item.value);
    onTimeChange(item.value);
  };

  return (
    <Tooltip
      isVisible={showPopover}
      content={
        <SelectedCustomersComponent
          data={selectedCustomersData}
          currentDate={date}
          onDeleteCustomer={handleDeleteCustomers}
          handleStartTime={handleStartTime}
          startTime={startTime}
        />
      }
      backgroundColor={'rgba(0,0,0,0)'}
      contentStyle={[tw('bg-light-lightBlue1 p-6'), { width: 305, height: 598 }]}
      placement="left"
      displayInsets={{ top: 85, bottom: 68, left: 0, right: 0 }}
      showChildInTooltip={false}
      closeOnContentInteraction={false}
      closeOnChildInteraction={false}
      onClose={() => setShowPopover(false)}>
      <TouchableOpacity
        style={tw('justify-center')}
        onPress={handleClickedDate}>
        <View
          row
          bg-white
          spread
          marginH-v2
          paddingV-v1
          paddingH-v2
          br20
          style={tw(
            `${selectedCustomersData.length > 0
              ? 'border-default border-light-darkBlue'
              : ''
            }`,
          )}>
          <View>
            <Text text13R textBlack>
              {newDate[2]} {newDate[1]}
            </Text>
            <Text text13R grey2>
              {newDate[0]}
            </Text>
          </View>
          {selectedCustomersData.length > 0 && (
            <View centerV>
              <View bg-lightBlue1 paddingH-v06 paddingV-v01 br40>
                <Text>
                  {selectedCustomersData.length >= 10
                    ? `${selectedCustomersData.length}`
                    : `0${selectedCustomersData.length}`}
                </Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Tooltip>
  );
};

export default CalendarDateItem;
