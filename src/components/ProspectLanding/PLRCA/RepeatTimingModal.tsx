import {TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import Modal from 'src/components/Modal';
import {WEEKS} from 'src/utils/Constant';

interface RepeatTimingModalProps {
  isVisible: boolean;
  currentDay: string;
  currentHourType: string;
  handleOnPressOk?: any;
  handleOnPressCancel?: any;
}

const RepeatTimingModal = (props: RepeatTimingModalProps) => {
  const {
    isVisible,
    currentDay,
    handleOnPressOk,
    handleOnPressCancel,
    currentHourType,
  } = props;
  const [isDayActive, setIsDayActive] = useState({
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  });

  const commonStyle =
    'border-default rounded-full h-36px w-36px justify-center items-center';

  const handleDayClick = (day: string) => {
    if (day == 'Sunday') {
      setIsDayActive({...isDayActive, sunday: !isDayActive.sunday});
    } else if (day == 'Monday') {
      setIsDayActive({...isDayActive, monday: !isDayActive.monday});
    } else if (day == 'Tuesday') {
      setIsDayActive({...isDayActive, tuesday: !isDayActive.tuesday});
    } else if (day == 'Wednesday') {
      setIsDayActive({...isDayActive, wednesday: !isDayActive.wednesday});
    } else if (day == 'Thursday') {
      setIsDayActive({...isDayActive, thursday: !isDayActive.thursday});
    } else if (day == 'Friday') {
      setIsDayActive({...isDayActive, friday: !isDayActive.friday});
    } else {
      setIsDayActive({...isDayActive, saturday: !isDayActive.saturday});
    }
  };

  const handleCancelClick = () => {
    handleOnPressCancel();
    setIsDayActive({
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
    });
  };
  const handleOkClick = () => {
    handleOnPressOk(currentDay, currentHourType, isDayActive);
    setIsDayActive({
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
    });
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      enableModalBlur={false}
      overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}>
      <View flex center>
        <View bg-white br40 style={tw('self-center')} padding-v4>
          <Text text18BO textBlack center>
            Repeat {currentDay ? currentDay : ''} Timings to
          </Text>
          <View row centerV spread style={tw('w-316px')} marginT-v4>
            {WEEKS.map(item => {
              let isActive: boolean = false;
              if (item.name == 'Sunday') {
                isActive = isDayActive.sunday;
              } else if (item.name == 'Monday') {
                isActive = isDayActive.monday;
              } else if (item.name == 'Tuesday') {
                isActive = isDayActive.tuesday;
              } else if (item.name == 'Wednesday') {
                isActive = isDayActive.wednesday;
              } else if (item.name == 'Thursday') {
                isActive = isDayActive.thursday;
              } else if (item.name == 'Friday') {
                isActive = isDayActive.friday;
              } else {
                isActive = isDayActive.saturday;
              }
              return (
                <TouchableOpacity
                  key={item.id}
                  disabled={currentDay == item.name}
                  onPress={() => handleDayClick(item.name)}
                  style={tw(
                    `${
                      currentDay == item.name
                        ? 'bg-light-white1 border-light-lavendar '
                        : 'border-light-textLight '
                    } ${
                      isActive ? 'bg-light-darkBlue border-light-darkBlue ' : ''
                    }` + commonStyle,
                  )}>
                  <Text
                    text13M
                    style={tw(
                      `${isActive ? 'text-light-white' : 'text-light-grey3'}`,
                    )}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity
            onPress={handleOkClick}
            style={tw(
              'bg-light-darkBlue justify-center items-center rounded-md mt-6',
            )}>
            <Text text13R white marginV-v2>
              Ok
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCancelClick}
            style={tw(' justify-center items-center rounded-md  mt-12px')}>
            <Text text13R grey2 marginV-v2>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RepeatTimingModal;
